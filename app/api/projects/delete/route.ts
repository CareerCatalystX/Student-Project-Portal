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
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; name: string };
        if (decoded.role !== 'professor') {
            throw new Error('Access forbidden: Professors only');
        }
        return { professorId: decoded.id };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const professor = await authenticateProfessor(req);

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
        }

        // Ensure the project belongs to the authenticated professor
        const project = await prisma.project.findUnique({
            where: { id },
        });

        if (!project || project.professorId !== professor.professorId) {
            return NextResponse.json({ message: 'Project not found or unauthorized' }, { status: 404 });
        }

        // Delete the project
        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
