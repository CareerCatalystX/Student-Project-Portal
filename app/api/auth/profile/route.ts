// /app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production
// Middleware to authenticate user
async function authenticateUser(req: NextRequest) {
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
        return { id: decoded.id, role: decoded.role };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function GET(req: NextRequest) {
    try {
        const { id, role } = await authenticateUser(req);

        let user: any;
        if (role === 'professor') {
            user = await prisma.professor.findUnique({
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
                        }
                    }
                }
            });
        } else if (role === 'student') {
            user = await prisma.student.findUnique({
                where: { id },
                include: {
                    applications: {
                        select: {
                            id: true,
                            projectId: true,
                            status: true,
                        }
                    }
                }
            });
        } else {
            return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User profile fetched successfully', user }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching user profile:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
