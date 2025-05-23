import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';
import { studentSignupSchema } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body with simplified schema
    const result = studentSignupSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, password } = body;

    // Extract domain from email to find college
    const emailDomain = email.split('@')[1];
    
    // Find college by domain
    const college = await prisma.college.findUnique({
      where: { domain: emailDomain }
    });
    
    if (!college) {
      return NextResponse.json(
        { error: 'Your college is not registered with our platform yet' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingStudent = await prisma.user.findUnique({
      where: { email, role: "STUDENT" },
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
    const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // OTP valid for 1 hour

    // Create user with minimal info and student profile placeholder
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'STUDENT',
        collegeId: college.id,
        auth: {
          create: {
            password: hashedPassword,
            otp,
            otpExpiresAt
          }
        },
        studentProfile: {
          create: {
            year: null, // Avoid `null` if necessary
            branch: "",
            cvUrl: null
          }
        }
      },
      include: {
        auth: true,
        studentProfile: true,
        college: true
      }
    });
    // Send OTP via email
    await sendOTP(email, otp);

    return NextResponse.json({
      message: 'OTP sent to email. Please verify.',
      profileComplete: false
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup.' },
      { status: 500 }
    );
  }
}