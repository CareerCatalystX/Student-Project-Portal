// /app/api/professors/[id]/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

async function authenticateStudent(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('studentToken')?.value;
    if (!token) {
        throw new Error('Authentication token is missing');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            role: string;
            name: string;
            collegeId: string;
            studentId: string;
        };

        if (decoded.role !== 'STUDENT') {
            throw new Error('Access forbidden: Students only');
        }

        return { id: decoded.id };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function GET(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await authenticateStudent(req);

        const {id : professorId} = await params;

        if (!professorId) {
            return NextResponse.json({ message: 'Professor ID is required' }, { status: 400 });
        }

        // Fetch all projects created by the professor
        const projects = await prisma.project.findMany({
            where: { professorId },
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
