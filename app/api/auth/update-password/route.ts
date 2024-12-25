// /app/api/auth/update-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';


export async function POST(req: NextRequest) {
    try {
        const { token, role, newPassword } = await req.json();

        if (!token || !role || !newPassword) {
            return NextResponse.json({ message: 'Token, role, and new password are required' }, { status: 400 });
        }

        // Determine the model and narrow the type
        let user: any;
        if (role === 'professor') {
            user = await prisma.professor.findFirst({
                where: {
                    resetToken: token,
                    resetTokenExpiresAt: {
                        gte: new Date(), // Ensure the token has not expired
                    },
                },
            });
        } else if (role === 'student') {
            user = await prisma.student.findFirst({
                where: {
                    resetToken: token,
                    resetTokenExpiresAt: {
                        gte: new Date(), // Ensure the token has not expired
                    },
                },
            });
        } else {
            return NextResponse.json({ message: 'Invalid role provided' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the reset token
        if (role === 'professor') {
            await prisma.professor.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetTokenExpiresAt: null,
                },
            });
        } else {
            await prisma.student.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetTokenExpiresAt: null,
                },
            });
        }
        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating password:', error.message);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
