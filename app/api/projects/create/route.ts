// /app/api/projects/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production
// Middleware to authenticate and extract professor data
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
        return { professorId: decoded.id, professorName: decoded.name };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function POST(req: NextRequest) {
    try {
        const professor = await authenticateProfessor(req);

        const body = await req.json();
        const { title, description, duration, stipend, deadline, features, department, milestones, numberOfStudentsNeeded, preferredStudentDepartments, certification, letterOfRecommendation } = body;

        // Validate required fields
        if (!title || !description || !duration || !deadline || !features || !department) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Create project
        const project = await prisma.project.create({
            data: {
                title,
                description,
                duration,
                stipend: stipend || null,
                deadline,
                features,
                department,
                professorId: professor.professorId,
                professorName: professor.professorName,
                milestones,
                numberOfStudentsNeeded,
                preferredStudentDepartments,
                certification,
                letterOfRecommendation,
            },
        });

        return NextResponse.json({ message: 'Project created successfully', project }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
