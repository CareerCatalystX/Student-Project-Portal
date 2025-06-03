// /app/api/projects/skills/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const skills = await prisma.skill.findMany();
        return NextResponse.json({ message: 'Skills fetched successfully', skills }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
