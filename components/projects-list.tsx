import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, IndianRupee } from "lucide-react";
import { redirect } from "next/navigation";

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
  closed: boolean; // Added the closed field
}

interface ProjectsListProps {
  projects: ProjectCardProps[]; // Array of projects
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Separate open, closed, and outdated projects
  const currentDate = new Date();
  const openProjects = projects.filter((project) => !project.closed && new Date(project.deadline) >= currentDate);
  const closedProjects = projects.filter((project) => project.closed);
  const outdatedProjects = projects.filter((project) => new Date(project.deadline) < currentDate && !project.closed);

  // Filter open projects by search term
  const filteredOpenProjects = openProjects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search open projects by title..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Render Open Projects */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredOpenProjects.map(
          ({ id, title, description, professorName, deadline, duration, department, stipend, features }) => (
            <Card key={id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
                    <CardDescription className="mt-2">
                      {professorName} • {department}
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => redirect(`/project/${id}`)}>
                    View Details
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
          )
        )}
      </div>

      {/* Render Outdated Projects */}
      {outdatedProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Outdated Projects</h2>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {outdatedProjects.map(
              ({ id, title, description, professorName, deadline, duration, department, stipend, features }) => (
                <Card key={id} className="flex flex-col bg-yellow-100">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
                        <CardDescription className="mt-2">
                          {professorName} • {department}
                        </CardDescription>
                      </div>
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
              )
            )}
          </div>
        </div>
      )}

      {/* Render Closed Projects */}
      {closedProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Closed Projects</h2>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {closedProjects.map(
              ({ id, title, description, professorName, deadline, duration, department, stipend, features }) => (
                <Card key={id} className="flex flex-col bg-gray-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
                        <CardDescription className="mt-2">
                          {professorName} • {department}
                        </CardDescription>
                      </div>
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
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
