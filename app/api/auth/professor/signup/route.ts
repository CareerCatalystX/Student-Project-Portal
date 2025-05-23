import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTP } from '@/lib/email';
import { professorSignupSchema } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    const result = professorSignupSchema.safeParse(body);
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

    // Check if professor already exists
    const existingProfessor = await prisma.user.findUnique({
      where: { email, role: "PROFESSOR" },
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
    const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: "PROFESSOR",
        collegeId: college.id,
        auth: {
          create: {
            password: hashedPassword,
            otp,
            otpExpiresAt
          }
        },
        professorProfile: {
          create: {
            department: "",
            designation: "",
          }
        }
      },
      include: {
        auth: true,
        professorProfile: true,
        college: true
      }
    });

    // Send OTP via email
    await sendOTP(email, otp);

    return NextResponse.json(
      { message: 'OTP sent to email. Please verify.',
        profileComplete: false
       },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during signup.' },
      { status: 500 }
    );
  }
}