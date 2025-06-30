import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET
})

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

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

export async function POST(req: NextRequest) {
    try {

        const student = await authenticateStudent(req);
        const body = await req.json();
        const { planId, portal } = body;

        if (portal != "PROJECT") {
            return NextResponse.json({
                message: "Specified Portal is under development!",
                code: "INVALID_PORTAL_SELECTION"
            }, { status: 400 }
            )
        }

        const plan = await prisma.plan.findUnique({
            where: {
                id: planId
            }
        })

        if(plan == undefined) {
            return NextResponse.json({
                message: "Specified Plans doesnt exist.",
                code: "INVALID_PLAN"
            }, {status: 400})
        }

        const order = await razorpay.orders.create({
            amount: plan.price * 100,
            currency: "INR"
        });

        return NextResponse.json({
            order,
            userName: student.userName
        }, { status: 200 });

    } catch (error: any) {
        if (error.message === 'Authentication token is missing' ||
            error.message === 'Invalid or expired token' ||
            error.message === 'Access forbidden: Students only') {
            return NextResponse.json({
                message: error.message,
                code: 'AUTHENTICATION_ERROR'
            }, { status: 401 });
        }

        // Handle other errors with 500 status
        return NextResponse.json({
            message: error.message,
            code: 'INTERNAL_ERROR'
        }, { status: 500 });

    }
}