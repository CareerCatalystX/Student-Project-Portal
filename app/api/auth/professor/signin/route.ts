import prisma from '@/lib/prisma'; // Ensure this is the correct import (without curly braces)
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';
import { professorSigninSchema } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = professorSigninSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email, role: "PROFESSOR" },
      include: {
        auth: true,
        professorProfile: true
      }
    });

    if (!user || !user.auth) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Check if user is a student
    if (user.role !== "PROFESSOR" || !user.professorProfile) {
      return NextResponse.json(
        { error: 'Account is not a professor account' },
        { status: 400 }
      );
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.auth.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update the OTP and expiration in the database
    await prisma.userAuth.update({
      where: { userId: user.id },
      data: {
        otp,
        otpExpiresAt
      },
    });

    // Send the OTP to the professor's email
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