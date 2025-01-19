import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';
import { studentSignupSchema } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    const result = studentSignupSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, password, college, year, branch, cvUrl } = body;

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
        otpExpiresAt: new Date(Date.now() + 60 * 1000), // OTP valid for 1 minutes
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
