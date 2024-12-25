// /app/api/students/[id]/projects/route.ts
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
            throw new Error('Access forbidden: Students only');
        }
        return { professorId: decoded.id };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await authenticateProfessor(req);

        const studentId = params.id;

        if (!studentId) {
            return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
        }

        // Fetch all projects the student has applied for
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
                        department: true,
                    },
                },
            },
        });

        if (applications.length === 0) {
            return NextResponse.json({ message: 'No projects found for this student' }, { status: 404 });
        }

        const projects = applications.map((application) => application.project);

        return NextResponse.json({ message: 'Projects fetched successfully', projects }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching student projects:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
