import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, IndianRupee } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  professorName: string;
  deadline: string;
  duration: string;
  department: string;
  stipend: string;
  features: string[];
}

interface ProjectsListProps {
  projects: ProjectCardProps[]; // Array of projects
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <div className="grid w-full gap-6 md:grid-cols-1 lg:grid-cols-2">
      {projects.map(({ id, title, description, professorName, deadline, duration, department, stipend, features }) => (
        <Card key={id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
                <CardDescription className="mt-2">
                  {professorName} • {department}
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={`/project/${id}`}>View Details</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
              </div>
              {stipend && (
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="h-4 w-4" />
                  <span>Stipend: ₹{stipend}/month</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {features.map((feature) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
