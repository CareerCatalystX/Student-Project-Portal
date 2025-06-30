import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_TEST_KEY_SECRET;

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
        
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({
                message: "Missing required payment details",
                code: 'INVALID_REQUEST'
            }, { status: 400 });
        }

        // Verify the payment signature
        const body_to_verify = razorpay_order_id + "|" + razorpay_payment_id;
        const expected_signature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET!)
            .update(body_to_verify.toString())
            .digest('hex');

        if (expected_signature !== razorpay_signature) {
            return NextResponse.json({
                message: "Payment verification failed - Invalid signature",
                code: 'VERIFICATION_FAILED'
            }, { status: 400 });
        }

        // Payment is verified, now save to database and create subscription
        try {
            // Get the plan details (assuming you pass planId in the request)
            const { planId } = body;
            if (!planId) {
                return NextResponse.json({
                    message: "Plan ID is required",
                    code: 'INVALID_REQUEST'
                }, { status: 400 });
            }

            const plan = await prisma.plan.findUnique({
                where: { id: planId }
            });

            if (!plan) {
                return NextResponse.json({
                    message: "Invalid plan ID",
                    code: 'PLAN_NOT_FOUND'
                }, { status: 400 });
            }

            // Calculate subscription end date based on plan cycle
            const startDate = new Date();
            const endDate = new Date();
            
            switch (plan.billingCycle) {
                case 'MONTHLY':
                    endDate.setMonth(endDate.getMonth() + 1);
                    break;
                case 'YEARLY':
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    break;
                default:
                    // For FREE plans or other cycles
                    endDate.setMonth(endDate.getMonth() + 1);
            }

            // Create subscription for the student
            const subscription = await prisma.subscription.create({
                data: {
                    userId: student.userId,
                    planId: planId,
                    status: 'ACTIVE',
                    startedAt: startDate,
                    endsAt: endDate
                }
            });

            return NextResponse.json({
                message: "Payment verified and subscription created successfully",
                success: true,
                subscription: {
                    id: subscription.id,
                    planName: plan.name,
                    endsAt: subscription.endsAt
                }
            }, { status: 200 });

        } catch (dbError: any) {
            console.error('Database error:', dbError);
            return NextResponse.json({
                message: "Payment verified but failed to create subscription",
                code: 'DATABASE_ERROR'
            }, { status: 500 });
        }

    } catch (error: any) {
        // Handle authentication errors with 401 status
        if (error.message === 'Authentication token is missing' || 
            error.message === 'Invalid or expired token' ||
            error.message === 'Access forbidden: Students only') {
            return NextResponse.json({
                message: error.message,
                code: 'AUTHENTICATION_ERROR'
            }, { status: 401 });
        }

        // Handle other errors with 500 status
        console.error('Verification error:', error);
        return NextResponse.json({
            message: error.message || "Internal server error",
            code: 'INTERNAL_ERROR'
        }, { status: 500 });
    }
}