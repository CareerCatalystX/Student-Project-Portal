// /app/api/applications/route.ts
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

export async function GET(req: NextRequest) {
    try {
        const { studentId } = await authenticateStudent(req);

        // Fetch all applications for the authenticated student
        const applications = await prisma.application.findMany({
            where: { studentId },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        deadline: true,
                        professorName: true,
                    },
                },
            },
        });

        return NextResponse.json({ message: 'Applications fetched successfully', applications }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching applications:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
