"use client";
import { useEffect, useState } from "react";
import { ProjectsList } from "@/components/projects-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import NoProjects from "@/components/no_project";
import Image from "next/image";


interface Project {
  id: string
  title: string
  description: string
  duration: string
  stipend?: number
  deadline: string
  department: string
  professorName: string
  numberOfStudentsNeeded: number
  preferredStudentDepartments: string[]
  certification: boolean
  letterOfRecommendation: boolean
  createdAt: string
  college: {
    id: string
    name: string
    logo: string | null
  }
  professor: {
    name: string
    department: string
  }
  skills?: Array<{
    id: string
    name: string
  }>
  category: {
    id: string
    name: string
  }
  applicationCount: number
  closed?: boolean
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to check if the user is authenticated
  async function isAuthenticated() {
    const response = await fetch("/api/auth/profile/student", {
      method: "GET",
      credentials: "include"
    })

    return response.ok ? true : false;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login page if the token is not valid
      router.push("/sudent/login");
      return;
    }

    const getProjects = async () => {
      try {
        const response = await fetch("/api/projects/list", {
          method: "GET",
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col flex-grow bg-background max-w-screen overflow-x-hidden">
      <header className="border-b border-teal-100 bg-white shadow-sm shadow-teal-200 w-full">
        <div className="flex h-16 items-center justify-between w-full px-4">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={64} height={64} />
            <div className="pb-1">
              <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 bg-clip-text text-transparent">
                CareerCatalystX
              </h1>
              <p className="text-xs bg-gradient-to-r from-purple-950 via-purple-700 to-purple-950 bg-clip-text text-transparent text-center">
                Match. Collaborate. Build.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="default" onClick={() => router.push("/student/dashboard")} className="bg-teal-100 text-teal-900 hover:bg-teal-600 hover:text-white">
              Back
            </Button>
          </div>
        </div>
      </header>
      <main className="py-8 px-4 w-full">
        {loading ? (
          <div className={cn("flex mt-64 items-center justify-center bg-white")}>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : projects.length > 0 ? (
          <ProjectsList projects={projects} />
        ) : (
          <NoProjects />
        )}
      </main>
    </div>
  );
}
