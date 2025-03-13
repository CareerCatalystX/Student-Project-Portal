// /app/api/auth/professor/signin/route.ts
import prisma from '@/lib/prisma'; // Ensure this is the correct import (without curly braces)
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find the professor by email
    const professor = await prisma.professor.findUnique({
      where: { email },
    });

    if (!professor) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, professor.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the OTP and expiration in the database
    await prisma.professor.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt: new Date(Date.now() + 60 * 1000), // OTP valid for 10 minutes
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