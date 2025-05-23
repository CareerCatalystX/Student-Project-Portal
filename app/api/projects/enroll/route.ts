// /app/api/projects/enroll/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable in production
// Middleware to authenticate student
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
            userId: decoded.id,
            studentId: decoded.studentId, 
            collegeId: decoded.collegeId 
        };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

// Check if student has access to the project based on subscription
async function checkProjectAccessibility(userId: string, projectCollegeId: string, userCollegeId: string) {
    // If project is from user's own college, always accessible
    if (projectCollegeId === userCollegeId) {
        return { hasAccess: true, reason: 'own_college' };
    }

    // Check if user has active paid subscription that includes this college
    const activeSubscription = await prisma.subscription.findFirst({
        where: {
            userId: userId,
            status: 'ACTIVE',
            endsAt: {
                gte: new Date()
            }
        },
        include: {
            plan: {
                include: {
                    accessibleColleges: {
                        where: {
                            id: projectCollegeId
                        }
                    }
                }
            }
        }
    });

    if (activeSubscription && 
        activeSubscription.plan.billingCycle !== 'FREE' && 
        activeSubscription.plan.accessibleColleges.length > 0) {
        return { 
            hasAccess: true, 
            reason: 'paid_subscription',
            planName: activeSubscription.plan.name,
            expiresAt: activeSubscription.endsAt
        };
    }

    return { hasAccess: false, reason: 'no_access' };
}

// Additional validation checks
async function validateProjectApplication(projectId: string, studentId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            college: {
                select: {
                    id: true,
                    name: true
                }
            },
            applications: {
                select: {
                    id: true,
                    status: true
                }
            },
            _count: {
                select: {
                    applications: {
                        where: {
                            status: {
                                in: ['PENDING', 'SHORTLISTED', 'ACCEPTED']
                            }
                        }
                    }
                }
            }
        }
    });

    if (!project) {
        throw new Error('Project not found');
    }

    // Check if project is closed
    if (project.closed) {
        throw new Error('This project is closed for applications');
    }

    // Check deadline with buffer (give 1 minute grace period for timezone issues)
    const now = new Date();
    const deadline = new Date(project.deadline);
    const graceDeadline = new Date(deadline.getTime() + 60000); // 1 minute grace
    
    if (now > graceDeadline) {
        throw new Error(`The application deadline for this project has passed (Deadline: ${deadline.toLocaleString()})`);
    }

    // Check if student already applied
    const existingApplication = await prisma.application.findFirst({
        where: {
            projectId,
            studentId,
        },
    });

    if (existingApplication) {
        const statusMessage = {
            'PENDING': 'Your application is under review',
            'SHORTLISTED': 'Congratulations! You have been shortlisted',
            'ACCEPTED': 'Congratulations! Your application has been accepted',
            'REJECTED': 'Your previous application was not successful'
        };
        
        throw new Error(`You have already applied for this project. Status: ${statusMessage[existingApplication.status as keyof typeof statusMessage] || existingApplication.status}`);
    }

    // Check if project has reached maximum applications (optional business rule)
    const maxApplicationsPerProject = project.numberOfStudentsNeeded * 10; // Allow 10x applications than needed
    if (project._count.applications >= maxApplicationsPerProject) {
        throw new Error('This project has reached the maximum number of applications');
    }

    return project;
}

// Get student profile for additional validations
async function getStudentProfile(studentId: string) {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    collegeId: true
                }
            },
            skills: {
                include: {
                    skill: true
                }
            }
        }
    });

    if (!student) {
        throw new Error('Student profile not found');
    }

    return student;
}

export async function POST(req: NextRequest) {
    try {
        const student = await authenticateStudent(req);
        const body = await req.json();
        const { projectId, coverLetter } = body;

        // Input validation
        if (!projectId) {
            return NextResponse.json({ 
                message: 'Project ID is required',
                code: 'MISSING_PROJECT_ID'
            }, { status: 400 });
        }

        if (typeof projectId !== 'string' || projectId.trim().length === 0) {
            return NextResponse.json({ 
                message: 'Invalid project ID format',
                code: 'INVALID_PROJECT_ID'
            }, { status: 400 });
        }

        // Validate cover letter if provided
        if (coverLetter && (typeof coverLetter !== 'string' || coverLetter.length > 2000)) {
            return NextResponse.json({ 
                message: 'Cover letter must be a string with maximum 2000 characters',
                code: 'INVALID_COVER_LETTER'
            }, { status: 400 });
        }

        // Get student profile
        const studentProfile = await getStudentProfile(student.studentId);

        // Validate project and check basic eligibility
        const project = await validateProjectApplication(projectId, student.studentId);

        // Check project accessibility based on subscription
        const accessCheck = await checkProjectAccessibility(
            student.userId, 
            project.collegeId, 
            student.collegeId
        );

        if (!accessCheck.hasAccess) {
            return NextResponse.json({ 
                message: 'You do not have access to apply for projects from this college. Please upgrade your subscription to access projects from other colleges.',
                code: 'ACCESS_DENIED',
                projectCollege: project.college.name,
                userCollege: studentProfile.user.collegeId === student.collegeId ? 'Your college' : 'Unknown'
            }, { status: 403 });
        }

        // Additional business logic checks
        const warnings = [];

        // Check if student's branch matches preferred departments
        if (project.preferredStudentDepartments.length > 0 && 
            !project.preferredStudentDepartments.includes(studentProfile.branch)) {
            warnings.push(`Your branch (${studentProfile.branch}) is not in the preferred departments: ${project.preferredStudentDepartments.join(', ')}`);
        }

        // Check deadline proximity (warn if less than 24 hours remaining)
        const timeUntilDeadline = new Date(project.deadline).getTime() - new Date().getTime();
        const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60);
        if (hoursUntilDeadline < 24) {
            warnings.push(`Application deadline is in ${Math.round(hoursUntilDeadline)} hours`);
        }

        // Create application with transaction for data consistency
        const application = await prisma.$transaction(async (tx) => {
            // Double-check project status in transaction
            const currentProject = await tx.project.findUnique({
                where: { id: projectId },
                select: { closed: true, deadline: true }
            });

            if (!currentProject) {
                throw new Error('Project not found');
            }

            if (currentProject.closed) {
                throw new Error('Project was closed while processing your application');
            }

            if (new Date() > new Date(currentProject.deadline)) {
                throw new Error('Deadline passed while processing your application');
            }

            // Create the application
            return await tx.application.create({
                data: {
                    projectId,
                    studentId: student.studentId,
                    status: 'PENDING',
                    appliedAt: new Date(),
                    coverLetter: coverLetter?.trim() || null,
                },
                include: {
                    project: {
                        select: {
                            title: true,
                            college: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
        });

        return NextResponse.json({ 
            message: 'Application submitted successfully',
            application: {
                id: application.id,
                projectTitle: application.project.title,
                projectCollege: application.project.college.name,
                status: application.status,
                appliedAt: application.appliedAt,
                accessReason: accessCheck.reason,
                planName: accessCheck.reason === 'paid_subscription' ? accessCheck.planName : null
            },
            warnings: warnings.length > 0 ? warnings : undefined
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error enrolling in project:', error.message);
        
        // Return appropriate error codes
        if (error.message.includes('not found')) {
            return NextResponse.json({ 
                message: error.message,
                code: 'NOT_FOUND'
            }, { status: 404 });
        }
        
        if (error.message.includes('closed') || 
            error.message.includes('deadline') || 
            error.message.includes('already applied') ||
            error.message.includes('maximum number')) {
            return NextResponse.json({ 
                message: error.message,
                code: 'BUSINESS_RULE_VIOLATION'
            }, { status: 400 });
        }

        if (error.message.includes('Access forbidden') || 
            error.message.includes('Authentication')) {
            return NextResponse.json({ 
                message: error.message,
                code: 'AUTHENTICATION_ERROR'
            }, { status: 401 });
        }

        return NextResponse.json({ 
            message: 'Internal server error. Please try again later.',
            code: 'INTERNAL_ERROR'
        }, { status: 500 });
    }
}