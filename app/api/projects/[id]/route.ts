// /app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_: any, { params }: { params: Promise<{ id: string }> }) {
    const { id: id } = await params;
    if (!id) {
        return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
    }

    try {
        // Fetch project details by ID
        const project = await prisma.project.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                duration: true,
                stipend: true,
                deadline: true,
                department: true,
                closed: true,
                numberOfStudentsNeeded: true,
                preferredStudentDepartments: true,
                certification: true,
                letterOfRecommendation: true,
                catego0ry: {
                    select: {
                        name: true
                    }
                },
                skills: {
                    select: {
                        skill: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                professor: {
                    select: {
                        department: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project fetched successfully', project }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching project:', error.message);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
