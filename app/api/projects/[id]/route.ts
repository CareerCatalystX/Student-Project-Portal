// /app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET( _: any, { params }: { params: { id: string } }) {
    const id = params.id;
    if (!id) {
        return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
    }

    try {
        // Fetch project details by ID
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                professor: {
                    select: {
                        name: true,
                        department: true,
                        email: true,
                    },
                },
            },
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
