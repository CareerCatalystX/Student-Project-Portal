// /app/api/projects/unenroll/route.ts
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
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
        if (decoded.role !== 'student') {
            throw new Error('Access forbidden: Students only');
        }
        return { studentId: decoded.id };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function POST(req: NextRequest) {
    try {
        const { studentId } = await authenticateStudent(req);

        const body = await req.json();
        const { projectId } = body;

        if (!projectId) {
            return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
        }

        // Check if the student has an application for the project
        const application = await prisma.application.findFirst({
            where: {
                projectId,
                studentId,
            },
        });

        if (!application) {
            return NextResponse.json({ message: 'You are not enrolled in this project' }, { status: 404 });
        }

        // Delete the application
        await prisma.application.delete({
            where: { id: application.id },
        });

        return NextResponse.json({ message: 'Successfully unenrolled from the project' }, { status: 200 });
    } catch (error: any) {
        console.error('Error unenrolling from project:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}