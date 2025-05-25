import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';
import { studentSigninSchema } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = studentSigninSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const { email, password } = body;
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email, role: "STUDENT" },
      include: {
        auth: true,
        studentProfile: true
      }
    });

    if (!user || !user.auth) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Check if user is a student
    if (user.role !== 'STUDENT' || !user.studentProfile) {
      return NextResponse.json(
        { error: 'Account is not a student account' },
        { status: 400 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.auth.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 1 hour

    // Update the OTP and expiration in the database
    await prisma.userAuth.update({
      where: { userId: user.id },
      data: {
        otp,
        otpExpiresAt
      },
    });

    // Send the OTP to the user's email
    await sendOTP(email, otp);

    return NextResponse.json({
      message: 'OTP sent to email. Please verify.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during signin.' },
      { status: 500 }
    );
  }
}