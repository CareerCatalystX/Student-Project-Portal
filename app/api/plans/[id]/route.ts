// /app/api/plans/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Fetch all Plans with accessible colleges
        const plans = await prisma.plan.findMany({
            include: {
                accessibleColleges: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
            orderBy: {
                price: 'asc'
            }
        });

        // Group plans by name and billing cycle for frontend processing
        const groupedPlans = plans.reduce((acc, plan) => {
            const planName = plan.name.replace(/_(MONTHLY|YEARLY)$/, '');
            
            if (!acc[planName]) {
                acc[planName] = {
                    name: planName,
                    features: plan.features,
                    accessibleColleges: plan.accessibleColleges,
                    pricing: {}
                };
            }
            
            acc[planName].pricing[plan.billingCycle] = {
                id: plan.id,
                price: plan.price,
                billingCycle: plan.billingCycle
            };
            
            return acc;
        }, {} as any);

        return NextResponse.json({ 
            message: 'Plans fetched successfully', 
            plans: Object.values(groupedPlans),
            rawPlans: plans 
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching plans:', error);
        return NextResponse.json({ 
            message: error.message || 'Internal server error' 
        }, { status: 500 });
    }
}