import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { completeProfileSchema } from '@/lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to authenticate student
async function authenticateStudent(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('studentToken')?.value;
    if(!token){
        throw new Error('Authentication token is missing');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
          id: string;
          role: string;
          name: string;
          collegeId: string;
          studentId: string;
        };
    
        if (decoded.role !== 'STUDENT') {
          throw new Error('Access forbidden: Students only');
        }
    
        return { studentId: decoded.studentId };
      } catch (error) {
        throw new Error('Invalid or expired token');
      }
}

export async function PUT(req: NextRequest) {
    try {
        // Authenticate student
        const { studentId } = await authenticateStudent(req);

        const body = await req.json();
        const result = completeProfileSchema.safeParse(body);
            if (!result.success) {
              const errorMessage = result.error.issues[0].message;
              return NextResponse.json({ error: errorMessage }, { status: 400 });
            }

        // Parse and validate the request body
        const {year, branch, cvUrl, bio, gpa} = body;

        const Student = await prisma.student.findUnique({
            where: { id: studentId },
          });
      
        if (!Student) {
            return NextResponse.json(
              { error: 'Student Not Found' },
              { status: 400 }
            );
          }

        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                year,
                branch,
                cvUrl,
                bio,
                gpa,
                isUpdated: true,
             },
        });

        return NextResponse.json(
            { message: 'Profile updated successfully', updatedStudent },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error updating Profile:', error.message);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
