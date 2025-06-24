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
  closed: boolean
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadedProjectIds, setLoadedProjectIds] = useState<Set<string>>(new Set());

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
      router.push("/login");
      return;
    }

    const getProjects = async () => {
      try {
        const response = await fetch("/api/projects/list/closed?limit=10", {
          method: "GET",
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);
        const initialIds = new Set<string>(data.projects.map((p: Project) => p.id as string));
        setLoadedProjectIds(initialIds);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreProjects();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, nextCursor, loadedProjectIds]); // Add loadedProjectIds

  const loadMoreProjects = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const url = `/api/projects/list/closed?limit=10${nextCursor ? `&cursor=${nextCursor}` : ''}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to fetch more projects");

      const data = await response.json();

      // Filter out duplicates
      const uniqueNewProjects = filterDuplicateProjects(data.projects, loadedProjectIds);

      if (uniqueNewProjects.length > 0) {
        setProjects(prev => [...prev, ...uniqueNewProjects]);

        // Update loaded project IDs
        const newIds = new Set<string>([...loadedProjectIds, ...uniqueNewProjects.map(p => p.id as string)]);
        setLoadedProjectIds(newIds);
      }

      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Error loading more projects:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filterDuplicateProjects = (newProjects: Project[], existingIds: Set<string>) => {
    return newProjects.filter(project => !existingIds.has(project.id));
  };

  return (
    <div className="min-h-screen flex flex-col flex-grow bg-background max-w-screen overflow-x-hidden">
      <header className="border-b border-teal-100 bg-white shadow-sm shadow-teal-200 w-full">
        <div className="flex h-16 items-center justify-between w-full px-4">
          <div className="flex items-center">
            <Image src="/logo-master.png" alt="Logo" width={196} height={64} />
          </div>
          <div className="flex gap-4">
            <Button variant="default" onClick={() => router.push("/")} className="bg-teal-100 text-teal-900 hover:bg-teal-600 hover:text-white">
              Back
            </Button>
          </div>
        </div>
      </header>
      <main className="py-8 px-4 w-full">
        {loading ? (
          <div className={cn("flex mt-64 items-center justify-center bg-white")}>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : projects.length > 0 ? (
          <>
            <ProjectsList projects={projects} />
            {loadingMore && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
              </div>
            )}
          </>
        ) : (
          <NoProjects />
        )}
      </main>
    </div>
  );
}
