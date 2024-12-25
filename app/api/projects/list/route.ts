// /app/api/projects/list/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET() {
    try {
        // Fetch all projects
        const projects = await prisma.project.findMany({
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

        return NextResponse.json({ message: 'Projects fetched successfully', projects }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
