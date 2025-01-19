"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Function to check if the user is authenticated
async function isAuthenticated() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    const response = await fetch("/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (err) {
    console.error("Authentication check failed:", err);
    return false;
  }
}

// Function to fetch project details
async function fetchProject(id: string) {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }
  return res.json();
}

// Function to enroll in a project
async function enrollInProject(projectId: string) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const res = await fetch("/api/projects/enroll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to enroll");
  }
}

export default function ApplyPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthenticationAndFetchData = async () => {
      try {
        const isAuthenticate = await isAuthenticated();
        if (!isAuthenticate) {
          router.push("/student/login");
          return;
        }
        setAuthenticated(true);

        const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;
        if (!projectId) {
          throw new Error("Invalid project ID");
        }

        const projectData = await fetchProject(projectId);
        setProject(projectData.project);
      } catch (err: any) {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthenticationAndFetchData();
  }, [params?.id, router]);

  const handleEnrollment = async () => {
    try {
      if (!project?.id) {
        throw new Error("Project ID is not available");
      }

      await enrollInProject(project.id);
      router.push("/student/enrollment-success");
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setError(err.message || "Failed to enroll in the project.");
    }
  };

  if (loading || !authenticated) {
    return (
      <div className={cn("flex mt-64 items-center justify-center bg-white")}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push("/project")}>
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Project Application</CardTitle>
          <CardDescription>
            You are applying for the project: {project?.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Project Details</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {project?.description}
              </p>
              <div className="text-sm">
                <p>
                  <strong>Professor:</strong> {project?.professorName}
                </p>
                <p>
                  <strong>Department:</strong> {project?.professor?.department}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                By clicking "Apply", you confirm that you want to enroll in this project and agree to commit to its requirements and timeline.
              </p>
              {error && (
                <div className="text-red-500 mb-4 text-sm">{error}</div>
              )}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/project")}
                >
                  Cancel
                </Button>
                <Button onClick={handleEnrollment}>Apply for Project</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
