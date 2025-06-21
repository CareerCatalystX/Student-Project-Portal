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
import { AlertTriangle, Clock, Lock } from "lucide-react";
import { toast } from "sonner";



// Function to check if the user is authenticated
async function isAuthenticated() {
  try {
    const response = await fetch("/api/auth/profile/student", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
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

export default function ApplyPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthenticationAndFetchData = async () => {
      try {
        const isAuthenticate = await isAuthenticated();
        if (!isAuthenticate) {
          router.push("/login");
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
        router.push("student/dashboard")
      } finally {
        setLoading(false);
      }
    };

    checkAuthenticationAndFetchData();
  }, [params?.id, router]);

  async function handleEnrollment() {
    try {
      setIsApplying(true);
      if (!project?.id) {
        throw new Error("Project ID is not available");
      }

      const enrollProjectPromise = async () => {
        const res = await fetch("/api/projects/enroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ projectId: project.id }),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to enroll");
        }
        return res.json();
      };

      toast.promise(enrollProjectPromise(), {
        loading: "Enrolling in project...",
        success: () => {
          router.push("/enrollment-success");
          setIsApplying(false);
          return "Project updated successfully.";
        },
        error: (err) => {
          setIsApplying(false);
          return err?.message;
        },
      });
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setIsApplying(false);
      setError(err.message || "Failed to enroll in the project.");
    }
  }

  const isOutdated = project && new Date(project?.deadline) < new Date() && !project?.closed;

  if (loading || !authenticated) {
    return (
      <div className={cn("flex w-screen h-screen items-center justify-center bg-white")}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-screen min-h-screen flex items-center py-8 px-4 ${project?.closed ? "bg-gradient-to-b from-blue-600 to-blue-500 shadow-md shadow-blue-50" : isOutdated ? "bg-gradient-to-b from-yellow-600 to-yellow-500 shadow-md shadow-yellow-50" : "bg-gradient-to-b from-teal-600 to-teal-500 shadow-md shadow-teal-50"}`}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className={`${project?.closed ? "text-blue-600" : isOutdated ? "text-yello-600" : "text-teal-600"} text-lg`}>Error</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              {project?.closed ? (
                <>
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span>This project is closed and no longer accepting applications.</span>
                </>
              ) : isOutdated ? (
                <>
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span>This project is outdated and no longer open for applications.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>{error}</span>
                </>
              )}
            </CardDescription>

          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push("/projects")}>
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-screen min-h-screen py-8 px-4 ${project?.closed ? "bg-gradient-to-b from-blue-600 to-blue-500 shadow-md shadow-blue-50" : isOutdated ? " bg-gradient-to-b from-yellow-600 to-yellow-500 shadow-md shadow-yellow-50" : "bg-gradient-to-b from-teal-600 to-teal-500 shadow-md shadow-teal-50"}`}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className={`${project?.closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"} text-lg`}>Project Application</CardTitle>
          <CardDescription>
            You are applying for the project: <span
              className={`font-semibold ${project?.closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"}`}
            >
              {project?.title}
            </span>

          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`${project?.closed ? "border-blue-300" : isOutdated ? "border-yellow-300" : "border-teal-300"} border rounded-lg p-4`}>
              <h3 className={`${project?.closed ? "text-blue-600" : isOutdated ? "text-yellow-700" : "text-teal-700"} font-medium mb-2`}>Project Details</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {project?.description}
              </p>
              <div className="text-sm">
                <p>
                  <strong className={`${project?.closed ? "text-blue-600" : isOutdated ? "text-yellow-700" : "text-teal-700"}`}>Professor:</strong> {project?.professor?.user?.name}
                </p>
                <p>
                  <strong className={`${project?.closed ? "text-blue-600" : isOutdated ? "text-yellow-700" : "text-teal-700"}`}>Department:</strong> {project?.department}
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
                  onClick={() => router.push("/projects")}
                  className="bg-red-300 text-red-700 hover:text-white hover:bg-red-600"
                >
                  Cancel
                </Button>
                <Button onClick={handleEnrollment} className={`${project?.closed ? "bg-blue-300 text-blue-700 hover:text-white hover:bg-blue-600" : isOutdated ? "bg-yellow-300 text-yellow-700 hover:text-white hover:bg-yellow-600" : "bg-teal-300 text-teal-700 hover:text-white hover:bg-teal-600"}`} disabled={isApplying}>{isApplying ? "Applying for Project..." : "Apply for Project"}</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
