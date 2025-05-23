// /app/api/projects/[id]/close/route.ts
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

export async function POST(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        const { professorId } = await authenticateProfessor(req);

        const {id : projectId} = await params;

        if (!projectId) {
            return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
        }

        // Ensure the project belongs to the authenticated professor
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.professorId !== professorId) {
            return NextResponse.json({ message: 'Project not found or unauthorized' }, { status: 404 });
        }

        // Mark the project as closed
        const closedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                closed: true, // Set the closed field to true
            },
        });

        return NextResponse.json({ message: 'Project closed successfully', project: closedProject }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
