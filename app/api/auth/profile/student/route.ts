import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

async function authenticateStudent(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('studentToken')?.value;
    if (!token) {
        throw new Error('Authentication token is missing');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            role: string;
            name: string;
            collegeId: string;
            studentId: string;
        };

        if (decoded.role !== 'STUDENT') {
            throw new Error('Access forbidden: Students only');
        }

        return { studentId: decoded.studentId };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function GET(req: NextRequest) {
    try {
        const { studentId } = await authenticateStudent(req);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                user: {
                    include: {
                        college: true,
                        subscriptions: {
                            include: {
                                plan: true
                            }
                        }
                    }
                },
                applications: {
                    include: {
                        project: {
                            include: {
                                professor: {
                                    include: {
                                        user: true
                                    }
                                },
                                college: true,
                                catego0ry: true,
                                skills: {
                                    include: {
                                        skill: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        appliedAt: 'desc'
                    }
                },
                skills: {
                    include: {
                        skill: true
                    }
                }
            }
        });

        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Student profile fetched successfully', student }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching student profile:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
