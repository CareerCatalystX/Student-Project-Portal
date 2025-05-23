// /app/api/students/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
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

export async function GET(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await authenticateProfessor(req);

        const {id : studentId} = await params;

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
