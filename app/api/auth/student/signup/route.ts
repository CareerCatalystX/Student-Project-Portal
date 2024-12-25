import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, password, college, year, branch, cvUrl } = await req.json();

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save student and OTP to database
    await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        college,
        year,
        branch,
        cvUrl,
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
