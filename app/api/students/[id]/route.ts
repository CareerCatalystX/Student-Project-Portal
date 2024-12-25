// /app/api/students/[id]/route.ts
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await authenticateProfessor(req);

        const { id: studentId } = await params;

        if (!studentId) {
            return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
        }

        // Fetch student details
        const student = await prisma.student.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Student details fetched successfully', student }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching student details:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
