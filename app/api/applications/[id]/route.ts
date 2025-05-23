// /app/api/applications/[id]/route.ts
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

export async function GET(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        const { studentId } = await authenticateStudent(req);

        const {id : applicationId} = await params;

        if (!applicationId) {
            return NextResponse.json({ message: 'Application ID is required' }, { status: 400 });
        }

        // Fetch the specific application
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
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

        if (!application || application.studentId !== studentId) {
            return NextResponse.json({ message: 'Application not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Application fetched successfully', application }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching application:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
