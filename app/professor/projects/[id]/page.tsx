import { fetchProjectDetails } from "@/utils/project-id";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";

function ProjectDetails({ project }: { project: any }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
              <Badge variant={project.closed ? "secondary" : "default"}>
                {project.closed ? "Closed" : "Open"}
              </Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
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
                <p>{project.professor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {project.professor.department}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.professor.email}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              {project.features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
              <Link href={`/professor/projects/${project.id}/edit`} ><Button className="w-full" >Edit Project
              </Button></Link>
                
            <Link href={"/professor/dashboard"}><Button variant="outline" className="w-full" >
                Back to Dashboard
            </Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const {id : id} = await params;
  let project: any = null;
    try {
        const data = await fetchProjectDetails(id);
        project = data.project;
    } catch (error) {
        console.error("Error fetching project details:", error);
    }
    if (!project) {
      return (
          <main className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center">
                  <h1 className="text-3xl font-bold">Project Not Found</h1>
                  <p className="text-muted-foreground mt-2">The project you are looking for does not exist.</p>
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
