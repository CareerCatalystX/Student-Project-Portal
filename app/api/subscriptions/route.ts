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

export async function POST(req: NextRequest) {
    try {
        const { id } = await authenticateStudent(req);
        const { planId } = await req.json();
        const plan = await prisma.plan.findUnique({
            where: {
                id: planId
            }
        })
        if (!plan) {
            return NextResponse.json({ message: "Plan not Found" }, { status: 400 });
        }
        const billingCycle = plan.billingCycle;
        const endsAt = new Date();

        if (billingCycle === "MONTHLY") {
            endsAt.setMonth(endsAt.getMonth() + 1);
        } else if (billingCycle === "YEARLY") {
            endsAt.setFullYear(endsAt.getFullYear() + 1);
        }
        const subscription = await prisma.subscription.create({
            data: {
                userId: id,
                planId: planId,
                status: 'ACTIVE',
                endsAt: endsAt
            }
        })
        return NextResponse.json({ message: 'Subscription successfully added', subscription }, { status: 200 });
    } catch (error: any) {
        console.error('Error while subscribing:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { id } = await authenticateStudent(req);
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: id
            },
            include: {
                plan: true
            }
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