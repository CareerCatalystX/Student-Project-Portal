// /app/api/projects/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { projectSchema } from '@/lib/validations';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production

async function authenticateProfessor(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('professorToken')?.value;
    if (!token) {
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
        return {
            professorId: decoded.professorId,
            collegeId: decoded.collegeId,
            userId: decoded.id
        };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function POST(req: NextRequest) {
    try {
        const professor = await authenticateProfessor(req);

        const body = await req.json();
        const result = projectSchema.safeParse(body);
        if (!result.success) {
            const errorMessage = result.error.issues;
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
        const { title, description, duration, stipend, deadline, department, categoryName, numberOfStudentsNeeded, preferredStudentDepartments, certification, letterOfRecommendation, skills } = body;

        // Validate required fields
        if (!title || !description || !duration || !deadline || !department || !categoryName) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        const category = await prisma.projectCategory.findUnique({
            where: {
                name: categoryName,
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: `Category '${categoryName}' does not exist` },
                { status: 404 }
            );
        }

        const categoryId = category.id;

        const professorWhole = await prisma.user.findUnique({
            where: {
                id: professor.userId,
            },
        });

        if (!professorWhole) {
            return NextResponse.json(
                { error: `Professor '${professorWhole}' does not exist` },
                { status: 404 }
            );
        }

        const professorName = professorWhole.name;

        // Create project
        const project = await prisma.project.create({
            data: {
                title,
                description,
                duration,
                stipend: stipend || null,
                deadline,
                professorId: professor.professorId,
                professorName: professorName,
                department,
                collegeId: professor.collegeId,
                categoryId,
                numberOfStudentsNeeded,
                preferredStudentDepartments,
                certification,
                letterOfRecommendation,
            },
        });

        if (skills && skills.length > 0) {
            const skillRecords = await Promise.all(
                skills.map(async (skillName: string) => {
                    return await prisma.skill.upsert({
                        where: { name: skillName },
                        update: {},
                        create: { name: skillName },
                    });
                })
            );

            await Promise.all(
                skillRecords.map(async (skill) => {
                    await prisma.projectSkill.upsert({
                        where: {
                            projectId_skillId: {
                                projectId: project.id,
                                skillId: skill.id,
                            },
                        },
                        update: {},
                        create: {
                            projectId: project.id,
                            skillId: skill.id,
                        },
                    });
                })
            );
        }


        return NextResponse.json({ message: 'Project created successfully', project }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
