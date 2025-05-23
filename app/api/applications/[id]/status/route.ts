// /app/api/applications/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { sendApplicationStatusEmail } from '@/lib/email';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production
// Middleware to authenticate professor
async function authenticateProfessor(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('professorToken')?.value;
    if (!token) {
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
        return {
            professorId: decoded.professorId,
            collegeId: decoded.collegeId,
            userId: decoded.id
        };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function PATCH(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        const { professorId } = await authenticateProfessor(req);

        const {id : applicationId} = await params;
        if (!applicationId) {
            return NextResponse.json({ message: 'Application ID is required' }, { status: 400 });
        }

        const { status } = await req.json();
        if (!status || !['accepted', 'rejected'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status. Allowed values are "accepted" or "rejected"' }, { status: 400 });
        }

        // Fetch the application to ensure the professor is authorized to update it
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                project: {
                    select: {
                        professorId: true,
                        title: true,
                        professorName: true
                    },
                },
                student: {
                    select: {
                        user: {
                        select: {
                            name: true,
                            email: true,
                        },
                        },
                    },
                }
            },
        });

        if (!application) {
            return NextResponse.json({ message: 'Application not found' }, { status: 404 });
        }

        if (application.project.professorId !== professorId) {
            return NextResponse.json({ message: 'Unauthorized to update this application' }, { status: 403 });
        }

        // Update the application status
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: {
                status,
            },
        });


        const studentEmail = application.student.user.email;
        const studentName = application.student.user.name;
        const projectName = application.project.title
        const profName = application.project.professorName
        await sendApplicationStatusEmail(studentEmail, studentName,projectName,profName, status);

        return NextResponse.json({ message: 'Application status updated successfully', application: updatedApplication }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating application status:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
