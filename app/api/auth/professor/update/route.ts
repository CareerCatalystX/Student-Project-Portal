import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { completeProfessorProfileSchema } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to authenticate professor
async function authenticateProfessor(req: NextRequest) {
    const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if(!token){
            throw new Error('Authentication token is missing');
        }
    
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as {
              id: string;
              role: string;
              name: string;
              collegeId: string;
              professorId: string;
            };
        
            if (decoded.role !== 'PROFESSOR') {
              throw new Error('Access forbidden: Professor only');
            }
        
            return { professorId: decoded.professorId };
          } catch (error) {
            throw new Error('Invalid or expired token');
          }
}

export async function PUT(req: NextRequest) {
    try {
        // Authenticate professor
        const { professorId } = await authenticateProfessor(req);

        const body = await req.json();
        const result = completeProfessorProfileSchema.safeParse(body);
            if (!result.success) {
              const errorMessage = result.error.issues[0].message;
              return NextResponse.json({ error: errorMessage }, { status: 400 });
            }

        // Parse and validate the request body
        const {department, designation, qualification, researchAreas, officeLocation, officeHours, bio, publications, websiteUrl} = body;

        const Professor = await prisma.professor.findUnique({
            where: { id: professorId },
          });
      
        if (!Professor) {
            return NextResponse.json(
              { error: 'Student Not Found' },
              { status: 400 }
            );
          }

        const updatedProfessor = await prisma.professor.update({
            where: { id: professorId },
            data: {
                department, 
                designation, 
                qualification, 
                researchAreas, 
                officeLocation, 
                officeHours, 
                bio, 
                publications, 
                websiteUrl
             },
        });

        return NextResponse.json(
            { message: 'Profile updated successfully', updatedProfessor },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error updating Profile:', error.issues[0].message);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
