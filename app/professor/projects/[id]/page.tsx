import { fetchProjectDetails } from "@/utils/project-id";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import CloseProjectDialog from "@/components/professor/closeDialog";

function ProjectDetails({ project }: { project: any }) {
  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-t from-blue-500 to-blue-600">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl lg:text-2xl mb-2">{project.title}</CardTitle>
              <Badge
                variant={project.closed ? "secondary" : "default"}
                className={`${project.closed
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                {project.closed ? "Closed" : "Open"}
              </Badge>

            </div>
            <div className="text-right text-xs lg:text-sm text-muted-foreground">
              <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
              <p>Stipend: ₹{project.stipend || "N/A"}/month</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          {/* Professor Information */}
          <div>
            <h3 className="font-semibold mb-2">Professor</h3>
            <div className="flex items-center space-x-4">
              <div>
                <p>{project.professor?.user?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {project.professor?.department}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.professor?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration and Students */}
            <div>
              <h3 className="font-semibold mb-2">Project Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{project.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students Needed:</span>
                  <span>{project.numberOfStudentsNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span>{project.department}</span>
                </div>
                {project.category && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{project.category.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold mb-2">What You Get</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${project.certification ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm ${project.certification ? 'text-green-700' : 'text-muted-foreground'}`}>
                    Certification
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${project.letterOfRecommendation ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm ${project.letterOfRecommendation ? 'text-green-700' : 'text-muted-foreground'}`}>
                    Letter of Recommendation
                  </span>
                </div>
                {project.stipend && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-blue-700">₹{project.stipend}/month stipend</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Required Skills */}
          {project.skills && project.skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skillObj: any, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {skillObj.skill?.name || skillObj.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Student Departments */}
          {project.preferredStudentDepartments && project.preferredStudentDepartments.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Preferred Student Departments</h3>
              <div className="flex flex-wrap gap-2">
                {project.preferredStudentDepartments.map((dept: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Professor Information */}
          <div>
            <h3 className="font-semibold mb-2">Professor</h3>
            <div className="flex items-center space-x-4">
              <div>
                <p>{project.professor?.user?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {project.professor.department}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.professor?.user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-3">
            <Link href={`/professor/projects/${project.id}/edit`}>
              <Button className="w-full bg-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white">
                Edit Project
              </Button>
            </Link>
            {!project.closed && (
              <CloseProjectDialog projectId={project.id} />
            )}
            <Link href="/professor/dashboard">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div >
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project: any = null;
  try {
    const data = await fetchProjectDetails(id);
    project = data.project;
  } catch (error) {
    console.error("Error fetching project details:", error);
    redirect('/professor/dashboard');
  }
  if (!project) {
    return (
      <main className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Project Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The project you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }
  return (
    <Suspense fallback={<div className="text-center py-8"></div>}>
      <ProjectDetails project={project} />
    </Suspense>
  );
}