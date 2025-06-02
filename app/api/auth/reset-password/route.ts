import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';
import { resetPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = resetPassword.safeParse(body);
            if (!result.success) {
              const errorMessage = result.error.issues[0].message;
              return NextResponse.json({ error: errorMessage }, { status: 400 });
            }
            const { email } = body;

        if (!email) {
            return NextResponse.json({ message: 'Email and role are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Generate a reset token and expiration
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        // Update the user with the reset token and expiration
        await prisma.user.update({
            where: { email },
            data: {
                auth: {
                    update: {
                        resetToken,
                        resetTokenExpiresAt,
                    }
                }
            },
        });

        // Get the base URL from environment variables or use localhost as a fallback
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

        // Generate the reset URL
        const resetUrl = `${baseUrl}/update-password?token=${resetToken}`;

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
