// /app/api/projects/list/route.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

async function authenticateStudent(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('studentToken')?.value;
    if (!token) {
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

        return {
            id: decoded.id,
            collegeId: decoded.collegeId,
            studentId: decoded.studentId
        };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

async function getAccessibleProjects(userId: string, cursor: string | null = null, limit: number = 10) {
    try {
        // Get user with their subscriptions and college info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                college: {
                    select: {
                        name: true,
                        logo: true
                    }
                },
                subscriptions: {
                    where: {
                        status: 'ACTIVE',
                        endsAt: {
                            gte: new Date() // Only active subscriptions that haven't expired
                        }
                    },
                    include: {
                        plan: {
                            include: {
                                accessibleColleges: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if user has any active paid subscriptions
        const hasActivePaidSubscription = user.subscriptions.some(
            (sub: { plan: { billingCycle: string; }; status: string; }) => sub.plan.billingCycle !== 'FREE' && sub.status === 'ACTIVE'
        );

        let accessibleCollegeIds: string[] = [];

        if (hasActivePaidSubscription) {
            // User has paid plan - get accessible colleges from all active subscriptions
            const allAccessibleColleges = user.subscriptions.flatMap(
                (sub: { plan: { accessibleColleges: any[]; }; }) => sub.plan.accessibleColleges.map(college => college.id)
            );

            // Remove duplicates and add user's own college
            accessibleCollegeIds = [...new Set([...allAccessibleColleges, user.collegeId])];
        } else {
            // User has free plan - only show their own college projects
            accessibleCollegeIds = [user.collegeId];
        }

        // Build where clause with cursor
        const whereClause: any = {
            collegeId: {
                in: accessibleCollegeIds
            },
            closed: false,
            deadline: {
                gte: new Date()
            }
        };

        // Add cursor condition for pagination
        if (cursor) {
            whereClause.id = {
                lt: cursor // Get projects with ID less than cursor (for desc order)
            };
        }

        // Get projects with one extra to check if there are more
        const projects = await prisma.project.findMany({
            where: whereClause,
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                    }
                },
                professor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                skills: {
                    include: {
                        skill: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                catego0ry: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit + 1 ,// Get one extra to determine if there are more
            distinct: ['id']
        });

        // Check if there are more projects
        const hasMore = projects.length > limit;
        const projectsToReturn = hasMore ? projects.slice(0, limit) : projects;
        const nextCursor = hasMore ? projectsToReturn[projectsToReturn.length - 1].id : null;


        return {
            userInfo: {
                id: user.id,
                name: user.name,
                college: user.college,
                hasActivePaidSubscription,
                activePlans: user.subscriptions.map(sub => ({
                    planName: sub.plan.name,
                    endsAt: sub.endsAt
                }))
            },
            accessibleCollegeIds,
            hasMore,
            nextCursor,
            projects: projectsToReturn.map(project => ({
                id: project.id,
                title: project.title,
                description: project.description,
                closed: project.closed,
                duration: project.duration,
                stipend: project.stipend,
                deadline: project.deadline,
                department: project.department,
                professorName: project.professorName,
                numberOfStudentsNeeded: project.numberOfStudentsNeeded,
                preferredStudentDepartments: project.preferredStudentDepartments,
                certification: project.certification,
                letterOfRecommendation: project.letterOfRecommendation,
                createdAt: project.createdAt,
                college: project.college,
                professor: {
                    name: project.professor.user.name,
                    department: project.professor.department
                },
                skills: project.skills.map(ps => ({
                    name: ps.skill.name
                })),
                category: project.catego0ry ? {
                    name: project.catego0ry.name
                } : null,
            }))
        };

    } catch (error) {
        console.error('Error fetching accessible projects:', error);
        throw error;
    }
}

export async function GET(req: NextRequest) {
    try {
        const { id } = await authenticateStudent(req);

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor'); // ID of last project from previous batch
        const limit = parseInt(searchParams.get('limit') || '10');

        const result = await getAccessibleProjects(id, cursor, limit);

        return NextResponse.json({
            message: 'Projects fetched successfully',
            userInfo: result.userInfo,
            projects: result.projects,
            nextCursor: result.nextCursor,
            hasMore: result.hasMore
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error in projects list API:', error);
        return NextResponse.json({
            message: error.message || 'Internal server error'
        }, { status: 500 });
    }
}