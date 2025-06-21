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
            where: {
                id: studentId
            },
            select: {
                isUpdated: true,
                year: true,
                branch: true,
                cvUrl: true,
                bio: true,
                gpa: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                        college: {
                            select: {
                                name: true
                            }
                        },
                        subscriptions: {
                            orderBy: { endsAt: 'desc' },
                            select: {
                                id: true,
                                planId: true,
                                status: true,
                                startedAt: true,
                                endsAt: true,
                                plan: {
                                    select: {
                                        name: true,
                                        billingCycle: true
                                    }
                                }
                            }
                        }
                    }
                },
                skills: {
                    select: {
                        skill: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                applications: {
                    orderBy: {
                        appliedAt: 'desc'
                    },
                    select: {
                        id: true,
                        status: true,
                        appliedAt: true,
                        project: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            }
        });

        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        // Check if topmost subscription is expired and update if needed
        const currentDate = new Date();
        if (student.user.subscriptions && student.user.subscriptions.length > 0) {
            const latestSubscription = student.user.subscriptions[0];
            
            if (latestSubscription.status === 'ACTIVE' && new Date(latestSubscription.endsAt) < currentDate) {
                await prisma.subscription.update({
                    where: {
                        id: latestSubscription.id
                    },
                    data: {
                        status: 'EXPIRED'
                    }
                });
            }
        }

        // Prepare response data
        const responseData = {
            isUpdated: student.isUpdated,
            year: student.year,
            branch: student.branch,
            cvUrl: student.cvUrl,
            bio: student.bio,
            gpa: student.gpa,
            user: {
                name: student.user.name,
                email: student.user.email,
                role: student.user.role,
                college: student.user.college,
                subscriptions: student.user.subscriptions.filter(sub => sub.status === 'ACTIVE').map(sub => ({
                    planId: sub.planId,
                    status: sub.status,
                    startedAt: sub.startedAt,
                    endsAt: sub.endsAt,
                    plan: sub.plan
                }))
            },
            skills: student.skills,
            applications: student.applications
        };

        return NextResponse.json({ 
            message: 'Student profile fetched successfully', 
            student: responseData 
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching student profile:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}