// /app/api/projects/enroll/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production
// Middleware to authenticate student
async function authenticateStudent(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        throw new Error('Authorization token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('Invalid authorization header format');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; name: string };
        if (decoded.role !== 'student') {
            throw new Error('Access forbidden: Students only');
        }
        return { studentId: decoded.id, studentName: decoded.name };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function POST(req: NextRequest) {
    try {
        const student = await authenticateStudent(req);

        const body = await req.json();
        const { projectId } = body;

        if (!projectId) {
            return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
        }

        // Check if the project exists
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        // Check if the project is closed
        if (project.closed) {
            return NextResponse.json({ message: 'This project is closed for applications' }, { status: 400 });
        }

        // Check if the current date is past the deadline
        const now = new Date();
        const deadline = new Date(project.deadline);
        if (now > deadline) {
            return NextResponse.json({ message: 'The application deadline for this project has passed' }, { status: 400 });
        }

        // Check if the student has already applied
        const existingApplication = await prisma.application.findFirst({
            where: {
                projectId,
                studentId: student.studentId,
            },
        });

        if (existingApplication) {
            return NextResponse.json({ message: 'You have already applied for this project' }, { status: 400 });
        }

        // Create a new application
        const application = await prisma.application.create({
            data: {
                projectId,
                studentId: student.studentId,
                status: 'pending',
                appliedAt: new Date().toISOString(),
            },
        });

        return NextResponse.json({ message: 'Application submitted successfully', application }, { status: 201 });
    } catch (error: any) {
        console.error('Error enrolling in project:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
