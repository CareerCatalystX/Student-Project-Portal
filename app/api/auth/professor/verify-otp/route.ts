// /app/api/auth/professor/verify-otp/route.ts
import prisma from '@/lib/prisma'; // Ensure correct import (no curly braces)
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    // Find the professor by email
    const professor = await prisma.professor.findUnique({
      where: { email },
    });

    if (!professor) {
      return NextResponse.json({ error: 'Professor not found' }, { status: 404 });
    }

    // Check if OTP is valid
    if (professor.otp !== otp || professor.otpExpiresAt! < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Clear OTP and expiration after successful verification
    await prisma.professor.update({
      where: { email },
      data: {
        otp: null,
        otpExpiresAt: null,
      },
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: professor.id, role: 'professor', name:professor.name },
      JWT_SECRET,
      { expiresIn: '1h' } // Token valid for 1 hour
    );

    return NextResponse.json({
      token,
      message: 'Login successful',
    },{
      status: 200
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during OTP verification.' },
      { status: 500 }
    );
  }
}