// /app/api/auth/professor/signup/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, password, department } = await req.json();

    // Check if professor already exists
    const existingProfessor = await prisma.professor.findUnique({
      where: { email },
    });

    if (existingProfessor) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save professor and OTP to database
    await prisma.professor.create({
      data: {
        name,
        email,
        password: hashedPassword,
        department,
        otp, // Temporary OTP field for verification
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
      },
    });

    // Send OTP via email
    await sendOTP(email, otp);

    return NextResponse.json(
      { message: 'OTP sent to email. Please verify.' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during signup.' },
      { status: 500 }
    );
  }
}