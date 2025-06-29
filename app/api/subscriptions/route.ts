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

        return {
            userId: decoded.id,
            studentId: decoded.studentId,
            collegeId: decoded.collegeId,
            userName: decoded.name
        };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = await authenticateStudent(req);
        
        // Fetch 10 recent subscriptions sorted by nearest end date
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId
            },
            include: {
                plan: true
            },
            orderBy: {
                startedAt: 'desc' // Nearest end date first
            },
            take: 10 // Limit to 10 subscriptions
        });
        
        const updatedSubscriptions = subscriptions.map(sub => {
            const isExpired = new Date(sub.endsAt) < new Date();
            return {
                ...sub,
                status: isExpired ? 'EXPIRED' : sub.status
            };
        });
        
        return NextResponse.json({ message: 'Subscription successfully fetched', updatedSubscriptions }, { status: 200 });
    } catch (error: any) {
        console.error('Error while subscribing:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}