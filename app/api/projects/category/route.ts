// /app/api/projects/category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const categories = await prisma.projectCategory.findMany();
        return NextResponse.json({ message: 'Categories fetched successfully', categories }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
