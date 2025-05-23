import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { skillSchema } from "@/lib/validations";

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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

export async function POST(req: NextRequest){
    try {
        const { studentId } = await authenticateStudent(req);
        const student = await prisma.student.findUnique({
            where: { id : studentId },
        });
        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }
        const body = await req.json();
        const result = skillSchema.safeParse(body);
        if(!result.success){
            const errorMessage = result.error.issues;
            return NextResponse.json({error: errorMessage}, {status: 400});
        }
        const { skills } = body;

        const skillRecords = await Promise.all(
        skills.map(async (skillName: string) => {
            return await prisma.skill.upsert({
            where: { name: skillName },
            update: {},
            create: { name: skillName }
            });
        })
        );

        await Promise.all(
        skillRecords.map(async (skill) => {
            await prisma.studentSkill.upsert({
            where: {
                studentId_skillId: {
                studentId,
                skillId: skill.id
                }
            },
            update: {},
            create: {
                studentId,
                skillId: skill.id
            }
            });
        })
        );
        return NextResponse.json({ message: "Skills added successfully." }, { status: 200 });

    } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest){
    try {
        const { studentId } = await authenticateStudent(req);
        const student = await prisma.student.findUnique({
            where: { id : studentId },
        });
        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }
        const body = await req.json();
        const result = skillSchema.safeParse(body);
        if(!result.success){
            const errorMessage = result.error.issues;
            return NextResponse.json({error: errorMessage}, {status: 400});
        }
        const { skills } = body;

        const skillsToRemove = await prisma.skill.findMany({
        where: {
            name: {
            in: skills,
            },
        },
        select: {
            id: true,
        },
        });

        const skillIds = skillsToRemove.map((skill) => skill.id);

        if (skillIds.length === 0) {
        return NextResponse.json({ message: 'No matching skills found to delete' }, { status: 404 });
        }

        // Delete relations
        await prisma.studentSkill.deleteMany({
        where: {
            studentId,
            skillId: {
            in: skillIds,
            },
        },
        });

        return NextResponse.json({ message: 'Skills removed successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}