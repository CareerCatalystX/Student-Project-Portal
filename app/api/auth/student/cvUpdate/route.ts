// /app/api/professors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cvSchema } from '@/lib/auth';

export const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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

export async function PUT(req: NextRequest) {
    try {
        // Authenticate student
        const { studentId } = await authenticateStudent(req);

        // Parse and validate the request body
        const body = await req.json();
        const validationResult = cvSchema.safeParse(body);

        if (!validationResult.success) {
            const errorMessage = validationResult.error.issues.map(issue => issue.message).join(', ');
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        const { cvUrl } = validationResult.data;

        // Update the student's CV URL
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: { cvUrl },
        });

        return NextResponse.json(
            { message: 'CV updated successfully', student: updatedStudent },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error updating CV:', error.message);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
