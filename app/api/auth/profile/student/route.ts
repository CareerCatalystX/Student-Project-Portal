import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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
            throw new Error('Unauthorized: Not a student');
        }
        return { id: decoded.id };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function GET(req: NextRequest) {
    try {
        const { id } = await authenticateStudent(req);
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                applications: {
                    select: {
                        id: true,
                        projectId: true,
                        status: true,
                    },
                },
            },
        });

        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Student profile fetched successfully', student }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching student profile:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
