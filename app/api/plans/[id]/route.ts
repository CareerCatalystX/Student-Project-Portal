// /app/api/plans/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(_: any, {params}: { params: Promise<{ id: string }> }) {
    const {id : id} = await params;
        if (!id) {
            return NextResponse.json({ message: 'Plan ID is required' }, { status: 400 });
        }
    try {
        // Fetch all Plans
        const plans = await prisma.plan.findUnique({
            where: {
                id: id
            }
        });

        return NextResponse.json({ message: 'Plan fetched successfully', plans }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
