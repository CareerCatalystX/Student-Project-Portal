// /app/api/plans/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET() {
    try {
        // Fetch all Plans
        const plans = await prisma.plan.findMany({
            include: {
                
            },
        });

        return NextResponse.json({ message: 'Plans fetched successfully', plans }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
