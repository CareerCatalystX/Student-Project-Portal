import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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
            throw new Error('Unauthorized: Not a professor');
        }
        return { id: decoded.id };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function GET(req: NextRequest) {
    try {
        const { id } = await authenticateProfessor(req);
        const professor = await prisma.professor.findUnique({
            where: { id },
            include: {
                projects: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        duration: true,
                        stipend: true,
                        deadline: true,
                        features: true,
                        closed: true,
                    },
                },
            },
        });

        if (!professor) {
            return NextResponse.json({ message: 'Professor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Professor profile fetched successfully', professor }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching professor profile:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
