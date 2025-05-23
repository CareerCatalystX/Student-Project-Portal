// /app/api/applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production
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

export async function GET(req: NextRequest) {
    try {
        const { studentId } = await authenticateStudent(req);

        // Fetch all applications for the authenticated student
        const applications = await prisma.application.findMany({
            where: { studentId },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        deadline: true,
                        professorName: true,
                    },
                },
            },
        });

        return NextResponse.json({ message: 'Applications fetched successfully', applications }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching applications:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
