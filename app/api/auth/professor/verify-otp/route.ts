import prisma from '@/lib/prisma'; // Ensure correct import (no curly braces)
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyOTPSchema } from '@/lib/auth';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = verifyOTPSchema.safeParse(body);
        if (!result.success) {
          const errorMessage = result.error.issues[0].message;
          return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
    const { email, otp } = body;

    // Find the professor by email
    const user = await prisma.user.findUnique({
      where: { email, role: "PROFESSOR"},
      include: {
        auth: true,
        professorProfile: true,
        college: true
      }
    });

    if (!user || !user.auth) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if OTP is valid
        if (user.auth.otp !== otp || !user.auth.otpExpiresAt || user.auth.otpExpiresAt < new Date()) {
          return NextResponse.json(
            { error: 'Invalid or expired OTP' },
            { status: 400 }
          );
        }


    // Clear OTP fields after successful verification
    await prisma.userAuth.update({
      where: { userId: user.id },
      data: { otp: null, otpExpiresAt: null },
    });

    // Generate a JWT token with necessary information
        const token = jwt.sign(
          { 
            id: user.id, 
            role: user.role, 
            name: user.name,
            collegeId: user.collegeId,
            professorId: user.professorProfile?.id // Include student ID if it exists
          },
          JWT_SECRET,
          { expiresIn: '10h' } // Token valid for 10 hours
        );

        const serialized = serialize('professorToken', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 10, // 10h
            });

        return NextResponse.json({
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            collegeId: user.collegeId,
            collegeName: user.college.name,
            professorProfile: user.professorProfile 
              ? {
                  id: user.professorProfile.id,
                  department: user.professorProfile.department
                } 
              : null
          },
          message: 'Login successful'
        }, {
          status: 200,
          headers: {
            'Set-Cookie': serialized,
            'Content-Type': 'application/json'
          }
        });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during OTP verification.' },
      { status: 500 }
    );
  }
}