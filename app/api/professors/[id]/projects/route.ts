// /app/api/professors/[id]/projects/route.ts
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

export async function GET(req: NextRequest, context: { params: { id: string } }): Promise<NextResponse> {
    try {
        await authenticateStudent(req);

        const professorId = context.params.id;

        if (!professorId) {
            return NextResponse.json({ message: 'Professor ID is required' }, { status: 400 });
        }

        // Fetch all projects created by the professor
        const projects = await prisma.project.findMany({
            where: { professorId },
            select: {
                id: true,
                title: true,
                description: true,
                duration: true,
                stipend: true,
                deadline: true,
                features: true,
                department: true,
            },
        });

        if (projects.length === 0) {
            return NextResponse.json({ message: 'No projects found for this professor' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Projects fetched successfully', projects }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching professor projects:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
