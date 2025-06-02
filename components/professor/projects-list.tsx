import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProfessorProject } from "@/types/api-professor"
import Link from "next/link"

interface ProjectsListProps extends React.HTMLAttributes<HTMLDivElement> {
  projects?: ProfessorProject[]
}

export function ProjectsList({ projects = [], className, ...props }: ProjectsListProps) {
  const activeProjects = projects.filter(project => !project.closed)
  const closedProjects = projects.filter(project => project.closed)
  const isOutdated = (activeProjects:any) =>
    activeProjects && new Date(activeProjects.deadline) < new Date() && !activeProjects.closed;


  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Your Projects</CardTitle>
        <CardDescription className="text-white/70">
          Manage your active and closed projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 flex flex-col">
          <div className="space-y-4 grow">
            <h3 className="text-lg font-semibold text-white">Active Projects</h3>
            {activeProjects.length === 0 ? (
              <p className="text-sm text-white/70">No active projects</p>
            ) : (
              activeProjects
              .sort((a, b) =>{
                if (isOutdated(a) && !isOutdated(b)) return 1; 
                if (!isOutdated(a) && isOutdated(b)) return -1; 
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime(); 
              })
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Closed Projects</h3>
            {closedProjects.length === 0 ? (
              <p className="text-sm text-white/70">No closed projects</p>
            ) : (
              closedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>


          <Button asChild className="w-full bg-white text-blue-500 hover:bg-blue-50">
            <Link href="/professor/create">Create New Project</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectCard({ project }: { project: ProfessorProject }) {
  const isOutdated = project && new Date(project?.deadline) < new Date() && !project?.closed;
  return (
    <div className="rounded-lg border p-4  bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{project.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
        <Badge variant={project.closed ? "secondary" : "default"} className={`${
                  project.closed
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : isOutdated ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}>
          {project.closed ? "Closed" : isOutdated ? "Overdue" : "Active"}
        </Badge>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/professor/projects/${project.id}`}>
            View Details
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/professor/projects/${project.id}/applications`}>
            View Applications
          </Link>
        </Button>
      </div>
    </div>
  )
}

