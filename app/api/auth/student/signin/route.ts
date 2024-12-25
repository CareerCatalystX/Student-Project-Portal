import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the OTP and expiration in the database
    await prisma.student.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
      },
    });

    // Send the OTP to the student's email
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
