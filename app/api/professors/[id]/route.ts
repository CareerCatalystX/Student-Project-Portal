// /app/api/professors/[id]/route.ts
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await authenticateStudent(req);

        const { id: professorId } = await params;

        if (!professorId) {
            return NextResponse.json({ message: 'Professor ID is required' }, { status: 400 });
        }

        // Fetch professor details
        const professor = await prisma.professor.findUnique({
            where: { id: professorId },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                createdAt: true,
            },
        });

        if (!professor) {
            return NextResponse.json({ message: 'Professor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Professor details fetched successfully', professor }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching professor details:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
