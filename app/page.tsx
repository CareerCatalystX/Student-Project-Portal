import { ProjectsList } from "@/components/projects-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fetchProjects } from "@/utils/fetcher";

export default async function Home() {
  let projects: any[] = [];
    try {
        const data = await fetchProjects();
        projects = data.projects;
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b w-screen">
        <div className="container flex h-16 items-center justify-between px-4 w-screen">
          <h1 className="text-2xl font-bold">Project Display</h1>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/student/dashboard">Student Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/professor/dashboard">Professor Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container px-4 py-8 w-full">
      {projects.length > 0 ? (
        <ProjectsList projects={projects} />
      ) : (
        <p>No projects available.</p>
      )}
      </main>
    </div>
  )
}