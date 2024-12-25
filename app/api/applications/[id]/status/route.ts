// /app/api/applications/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production
// Middleware to authenticate professor
async function authenticateProfessor(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        throw new Error('Authorization token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('Invalid authorization header format');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
        if (decoded.role !== 'professor') {
            throw new Error('Access forbidden: Professors only');
        }
        return { professorId: decoded.id };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { professorId } = await authenticateProfessor(req);

        const applicationId = params.id;
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
                    },
                },
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

        return NextResponse.json({ message: 'Application status updated successfully', application: updatedApplication }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating application status:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
