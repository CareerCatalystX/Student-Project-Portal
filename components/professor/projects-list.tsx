import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, IndianRupee } from 'lucide-react'
import { Project } from "@/types/api-professor"
import Link from "next/link"

interface ProjectsListProps extends React.HTMLAttributes<HTMLDivElement> {
  projects?: Project[]
}

export function ProjectsList({ projects = [], className, ...props }: ProjectsListProps) {
  const activeProjects = projects.filter(project => !project.closed)
  const closedProjects = projects.filter(project => project.closed)

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Your Projects</CardTitle>
        <CardDescription>
          Manage your active and closed projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            {activeProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active projects</p>
            ) : (
              activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Closed Projects</h3>
            {closedProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No closed projects</p>
            ) : (
              closedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </div>

          <Button asChild className="w-full">
            <Link href="/professor/create">Create New Project</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{project.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
        <Badge variant={project.closed ? "secondary" : "default"}>
          {project.closed ? "Closed" : "Active"}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{project.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
          <span>₹{project.stipend}/month</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.features.map((feature, index) => (
          <Badge key={index} variant="secondary">
            {feature}
          </Badge>
        ))}
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

