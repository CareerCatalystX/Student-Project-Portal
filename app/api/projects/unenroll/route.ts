// /app/api/projects/unenroll/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to authenticate student (consistent with enroll route)
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
            collegeId: decoded.collegeId,
            name: decoded.name
        };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

// Check if unenrollment is allowed based on application status and project state
async function validateUnenrollment(applicationId: string, studentId: string) {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            project: {
                select: {
                    id: true,
                    title: true,
                    deadline: true,
                    closed: true,
                    college: {
                        select: {
                            name: true
                        }
                    },
                    professor: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            },
            student: {
                include: {
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

    if (!application) {
        throw new Error('Application not found');
    }

    // Verify ownership
    if (application.studentId !== studentId) {
        throw new Error('Unauthorized: You can only withdraw your own applications');
    }

    // Check if application status allows withdrawal
    const nonWithdrawableStatuses = ['ACCEPTED'];
    if (nonWithdrawableStatuses.includes(application.status)) {
        throw new Error(`Cannot withdraw application with status: ${application.status}. Please contact the professor directly.`);
    }

    // Check if project has started (deadline passed) - stricter rules apply
    const now = new Date();
    const deadline = new Date(application.project.deadline);
    const hasDeadlinePassed = now > deadline;

    // If deadline has passed and application is shortlisted, require confirmation
    if (hasDeadlinePassed && application.status === 'SHORTLISTED') {
        throw new Error('Cannot withdraw from shortlisted applications after the deadline. Please contact the professor directly.');
    }

    // Calculate time until deadline for warnings
    const timeUntilDeadline = deadline.getTime() - now.getTime();
    const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60);

    const warnings = [];
    
    // Warn if withdrawing close to deadline
    if (hoursUntilDeadline > 0 && hoursUntilDeadline < 24) {
        warnings.push(`Withdrawing close to deadline (${Math.round(hoursUntilDeadline)} hours remaining)`);
    }

    // Warn if application was under review
    if (application.status === 'SHORTLISTED') {
        warnings.push('You were shortlisted for this project');
    }

    return {
        application,
        warnings,
        canWithdraw: true
    };
}

// Send notification to professor (optional - can be implemented later)
async function notifyProfessor(application: any, studentName: string, reason?: string) {
    // This is a placeholder for future email/notification implementation
    console.log(`Student ${studentName} withdrew from project "${application.project.title}"`);
    console.log(`Professor to notify: ${application.project.professor.user.email}`);
    if (reason) {
        console.log(`Reason: ${reason}`);
    }
    
    // TODO: Implement actual notification system
    // - Email notification to professor
    // - In-app notification
    // - Update application with withdrawal reason
}

export async function POST(req: NextRequest) {
    try {
        const student = await authenticateStudent(req);
        const body = await req.json();
        const { projectId, applicationId, reason, confirmWithdrawal } = body;

        // Input validation
        if (!projectId && !applicationId) {
            return NextResponse.json({ 
                message: 'Either Project ID or Application ID is required',
                code: 'MISSING_IDENTIFIER'
            }, { status: 400 });
        }

        if (projectId && typeof projectId !== 'string') {
            return NextResponse.json({ 
                message: 'Invalid project ID format',
                code: 'INVALID_PROJECT_ID'
            }, { status: 400 });
        }

        if (applicationId && typeof applicationId !== 'string') {
            return NextResponse.json({ 
                message: 'Invalid application ID format',
                code: 'INVALID_APPLICATION_ID'
            }, { status: 400 });
        }

        // Validate reason if provided
        if (reason && (typeof reason !== 'string' || reason.length > 500)) {
            return NextResponse.json({ 
                message: 'Withdrawal reason must be a string with maximum 500 characters',
                code: 'INVALID_REASON'
            }, { status: 400 });
        }

        let targetApplication;

        // Find application by projectId or applicationId
        if (applicationId) {
            targetApplication = await prisma.application.findUnique({
                where: { id: applicationId },
                include: {
                    project: {
                        select: {
                            id: true,
                            title: true,
                            deadline: true,
                            closed: true
                        }
                    }
                }
            });
        } else {
            // Find by projectId and studentId
            targetApplication = await prisma.application.findFirst({
                where: {
                    projectId,
                    studentId: student.studentId,
                },
                include: {
                    project: {
                        select: {
                            id: true,
                            title: true,
                            deadline: true,
                            closed: true
                        }
                    }
                }
            });
        }

        if (!targetApplication) {
            return NextResponse.json({ 
                message: 'You are not enrolled in this project or application not found',
                code: 'APPLICATION_NOT_FOUND'
            }, { status: 404 });
        }

        // Validate withdrawal eligibility
        const validation = await validateUnenrollment(targetApplication.id, student.studentId);

        // Check for risky withdrawals that need confirmation
        const needsConfirmation = validation.warnings.length > 0 || 
                                 targetApplication.status === 'SHORTLISTED';

        if (needsConfirmation && !confirmWithdrawal) {
            return NextResponse.json({
                message: 'Withdrawal confirmation required',
                code: 'CONFIRMATION_REQUIRED',
                warnings: validation.warnings,
                applicationStatus: targetApplication.status,
                projectTitle: targetApplication.project.title,
                requiresConfirmation: true
            }, { status: 409 }); // 409 Conflict - needs user action
        }

        // Perform withdrawal in transaction
        const withdrawalResult = await prisma.$transaction(async (tx) => {
            // Double-check application still exists and belongs to student
            const currentApplication = await tx.application.findUnique({
                where: { id: targetApplication.id },
                select: { 
                    id: true, 
                    studentId: true, 
                    status: true,
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

            if (!currentApplication) {
                throw new Error('Application was already withdrawn or not found');
            }

            if (currentApplication.studentId !== student.studentId) {
                throw new Error('Unauthorized access to application');
            }

            // Store withdrawal information before deletion
            const withdrawalRecord = {
                applicationId: currentApplication.id,
                projectTitle: currentApplication.project.title,
                projectCollege: currentApplication.project.college.name,
                status: currentApplication.status,
                withdrawnAt: new Date(),
                reason: reason?.trim() || null
            };

            // Delete the application
            await tx.application.delete({
                where: { id: targetApplication.id }
            });

            return withdrawalRecord;
        });

        // Notify professor about withdrawal (async, don't wait)
        if (validation.application) {
            setImmediate(() => {
                notifyProfessor(validation.application, student.name, reason);
            });
        }

        return NextResponse.json({ 
            message: 'Successfully withdrew from the project',
            withdrawal: {
                projectTitle: withdrawalResult.projectTitle,
                projectCollege: withdrawalResult.projectCollege,
                previousStatus: withdrawalResult.status,
                withdrawnAt: withdrawalResult.withdrawnAt,
                reason: withdrawalResult.reason
            },
            warnings: validation.warnings.length > 0 ? validation.warnings : undefined
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error withdrawing from project:', error.message);
        
        // Return appropriate error codes
        if (error.message.includes('not found')) {
            return NextResponse.json({ 
                message: error.message,
                code: 'NOT_FOUND'
            }, { status: 404 });
        }
        
        if (error.message.includes('Cannot withdraw') || 
            error.message.includes('Unauthorized')) {
            return NextResponse.json({ 
                message: error.message,
                code: 'WITHDRAWAL_NOT_ALLOWED'
            }, { status: 403 });
        }

        if (error.message.includes('Authentication') || 
            error.message.includes('Access forbidden')) {
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