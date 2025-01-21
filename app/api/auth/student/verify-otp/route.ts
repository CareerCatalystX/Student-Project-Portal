import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production
export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if OTP is valid
    if (student.otp !== otp || student.otpExpiresAt! < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Clear OTP fields after successful verification
    await prisma.student.update({
      where: { email },
      data: { otp: null, otpExpiresAt: null },
    });

    // Generate a JWT token
        const token = jwt.sign(
          { id: student.id, role: 'student', name:student.name},
          JWT_SECRET,
          { expiresIn: '10h' } // Token valid for 10 hour
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
