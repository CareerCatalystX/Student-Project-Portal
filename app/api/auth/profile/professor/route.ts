import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

async function authenticateProfessor(req: NextRequest) {
    const cookieStore = await cookies();
        const token = cookieStore.get('professorToken')?.value;
        if(!token){
            throw new Error('Authentication token is missing');
        }
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as {
                id: string;
                role: string;
                name: string;
                collegeId: string;
                professorId: string;
            };
            if (decoded.role !== 'PROFESSOR') {
                throw new Error('Access forbidden: Professor only');
            }
            return { professorId: decoded.professorId };
        } catch (error) {
            throw new Error('Invalid or expired token');
        }    
}

export async function GET(req: NextRequest) {
    try {
        const { professorId } = await authenticateProfessor(req);
        const professor = await prisma.professor.findUnique({
            where: { id : professorId },
            select: {
                isUpdated: true,
                department: true,
                designation: true,
                qualification: true,
                researchAreas: true,
                officeLocation: true,
                officeHours: true,
                bio: true,
                publications: true,
                websiteUrl: true,
                projects: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        closed: true,
                        deadline:true
                    }
                },
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
                    }
                },
            }
        });

        if (!professor) {
            return NextResponse.json({ message: 'Professor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Professor profile fetched successfully', professor }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching professor profile:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
