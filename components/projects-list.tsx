"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, IndianRupee, Search, SlidersHorizontal } from "lucide-react"
import { redirect } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement>  {
  id: string
  title: string
  description: string
  professorName: string
  deadline: string
  duration: string
  department: string
  stipend: number
  features: string[]
  closed: boolean
}

interface ProjectsListProps {
  projects: ProjectCardProps[]
}

const departments = [
  "All Departments",
  "Computer Science",
  "Electrical",
  "Mathematics and Computing",
  "Mechanical",
  "Civil",
  "Chemical",
  "Material",
]

const sortOptions = [
  { value: "deadline-new", label: "Deadline (Newest First)" },
  { value: "deadline-old", label: "Deadline (Oldest First)" },
  { value: "stipend-high", label: "Stipend (High to Low)" },
  { value: "stipend-low", label: "Stipend (Low to High)" },
  { value: "duration-long", label: "Duration (Longest First)" },
  { value: "duration-short", label: "Duration (Shortest First)" },
]

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [sortBy, setSortBy] = useState("deadline-new")

  const currentDate = new Date()

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === "All Departments" || project.department === selectedDepartment

      return matchesSearch && matchesDepartment
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "deadline-new":
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
        case "deadline-old":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case "stipend-high":
          return (b.stipend || 0) - (a.stipend || 0)
        case "stipend-low":
          return (a.stipend || 0) - (b.stipend || 0)
        case "duration-long":
          return Number.parseInt(b.duration) - Number.parseInt(a.duration)
        case "duration-short":
          return Number.parseInt(a.duration) - Number.parseInt(b.duration)
        default:
          return 0
      }
    })

  const openProjects = filteredProjects.filter(
    (project) => !project.closed && new Date(project.deadline) >= currentDate,
  )
  const closedProjects = filteredProjects.filter((project) => project.closed)
  const outdatedProjects = filteredProjects.filter(
    (project) => new Date(project.deadline) < currentDate && !project.closed,
  )

  return (
    <div className="w-full space-y-6">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-6 px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Projects</SheetTitle>
                  <SheetDescription>Filter projects by department</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Department</h4>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Open Projects */}
        <div className="space-y-6 px-4">
          <div className="grid gap-6">
            {openProjects.map((project) => (
              <ProjectCard key={project.id} {...project} className="bg-gradient-to-t from-teal-100 to-teal-50 shadow-md shadow-teal-100" />
            ))}
          </div>
        </div>

        {/* Outdated Projects */}
        {outdatedProjects.length > 0 && (
          <div className="space-y-6 px-4">
            <Separator />
            <h2 className="text-xl font-semibold">Outdated Projects</h2>
            <div className="grid gap-6">
              {outdatedProjects.map((project) => (
                <ProjectCard key={project.id} {...project} className="bg-gradient-to-t from-yellow-100 to-yellow-50 shadow-md shadow-yellow-100" />
              ))}
            </div>
          </div>
        )}

        {/* Closed Projects */}
        {closedProjects.length > 0 && (
          <div className="space-y-6">
            <Separator />
            <h2 className="text-xl font-semibold px-4">Closed Projects</h2>
            <div className="grid gap-6 px-4">
              {closedProjects.map((project) => (
                <ProjectCard key={project.id} {...project} className="bg-gradient-to-t from-blue-100 to-blue-50 shadow-md shadow-blue-100" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({
  id,
  title,
  description,
  professorName,
  deadline,
  duration,
  department,
  stipend,
  features,
  closed,
  className
}: ProjectCardProps) {
  const isOutdated = new Date(deadline) < new Date() && !closed

  return (
    <Card className={`flex h-full flex-col ${className}`}>
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription>
            {professorName} • {department}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className={`h-4 w-4 ${closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"}`} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className={`h-4 w-4 ${closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"}`} />
              <span>Due {new Date(deadline).toLocaleDateString()}</span>
            </div>
            {stipend > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <IndianRupee className={`h-4 w-4 ${closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"}`} />
                <span>₹{stipend.toLocaleString("en-IN")}/month</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="secondary" className={`${closed ? "bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white" : isOutdated ? "bg-transparent text-yellow-600 hover:bg-yellow-600 hover:text-white" : "bg-transparent text-teal-600 hover:bg-teal-600 hover:text-white"}`}>
                {feature}
              </Badge>
            ))}
            {features.length > 3 && <Badge variant="secondary" className={`${closed ? "bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white" : isOutdated ? "bg-transparent text-yellow-600 hover:bg-yellow-600 hover:text-white" : "bg-transparent text-teal-600 hover:bg-teal-600 hover:text-white"}`}>+{features.length - 3} more</Badge>}
          </div>
          <Button
            className={`w-full ${closed ? "bg-blue-600 text-white hover:bg-blue-700" : isOutdated ? "bg-yellow-600 text-white hover:bg-yellow-700" : "bg-teal-600 text-white hover:bg-teal-700"}`}
            variant="default"
            onClick={() => redirect(`/project/${id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

