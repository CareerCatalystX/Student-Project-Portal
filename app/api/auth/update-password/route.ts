import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { updatePassword } from '@/lib/auth';


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = updatePassword.safeParse(body);
            if (!result.success) {
              const errorMessage = result.error.issues[0].message;
              return NextResponse.json({ error: errorMessage }, { status: 400 });
            }
            const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json({ message: 'Token, role, and new password are required' }, { status: 400 });
        }

        // Determine the model and narrow the type
        const user = await prisma.user.findFirst({
            where: {
                auth: {
                    resetToken: token,
                    resetTokenExpiresAt: {
                    gte: new Date(), // Ensure the token has not expired
                },
                }
            },
        });
        

        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                auth: {
                    update: {
                        password: hashedPassword,
                        resetToken: null,
                        resetTokenExpiresAt: null,
                    }
                }
            },
        });
        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating password:', error.message);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
