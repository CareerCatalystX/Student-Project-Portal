// /app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const { email, role } = await req.json();

        if (!email || !role) {
            return NextResponse.json({ message: 'Email and role are required' }, { status: 400 });
        }

        // Determine the model and narrow the type
        let user: any;
        if (role === 'professor') {
            user = await prisma.professor.findUnique({
                where: { email },
            });
        } else if (role === 'student') {
            user = await prisma.student.findUnique({
                where: { email },
            });
        } else {
            return NextResponse.json({ message: 'Invalid role provided' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Generate a reset token and expiration
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        // Update the user with the reset token and expiration
        if (role === 'professor') {
            await prisma.professor.update({
                where: { email },
                data: {
                    resetToken,
                    resetTokenExpiresAt,
                },
            });
        } else {
            await prisma.student.update({
                where: { email },
                data: {
                    resetToken,
                    resetTokenExpiresAt,
                },
            });
        }

        // Get the base URL from environment variables or use localhost as a fallback
        const baseUrl = process.env.BASEd_URL || 'http://localhost:3000';

        // Generate the reset URL
        const resetUrl = `${baseUrl}/update-password?token=${resetToken}&role=${role}`;

        // Send reset email
        await sendEmail(
            email,
            'Password Reset Request',
            `You requested a password reset. Click the link to reset your password: ${resetUrl}`
        );

        return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
    } catch (error: any) {
        console.error('Error sending reset password email:', error.message);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
