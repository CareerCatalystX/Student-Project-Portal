"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, IndianRupee, Search, SlidersHorizontal, Users, Award, FileText, Check } from "lucide-react"
import { redirect } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

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

interface ProjectsListProps {
  projects: Project[]
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
  const [selectedCollege, setSelectedCollege] = useState("All Colleges")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("deadline-new")
  const [filterLOR, setFilterLOR] = useState(false)
  const [filterCertificate, setFilterCertificate] = useState(false)

  const currentDate = new Date()

  // Dynamically generate colleges array from projects data
  const colleges = useMemo(() => {
    const uniqueColleges = Array.from(
      new Set(projects.map(project => project.college.name))
    ).sort()
    return ["All Colleges", ...uniqueColleges]
  }, [projects])

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(projects.map(project => project.category.name))
    ).sort()
    return ["All Categories", ...uniqueCategories]
  }, [projects])

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === "All Departments" ||
        project.professor.department === selectedDepartment ||
        project.department === selectedDepartment
      const matchesCollege = selectedCollege === "All Colleges" ||
        project.college.name === selectedCollege
      const matchesCategory = selectedCategory === "All Categories" ||
        project.category.name === selectedCategory
      const matchesLOR = !filterLOR || project.letterOfRecommendation
      const matchesCertificate = !filterCertificate || project.certification

      return matchesSearch && matchesDepartment && matchesCollege && matchesCategory && matchesLOR && matchesCertificate
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
              <SelectTrigger className="w-[210px]">
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
                  <SheetDescription>Filter projects by department, category, college, and benefits</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
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
                  <div className="space-y-2">
                    <h4 className="font-medium">Category</h4>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">College</h4>
                    <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem key={college} value={college}>
                            {college}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Benefits</h4>
                    <div className="space-y-2">
                      <Button
                        variant={filterLOR ? "default" : "outline"}
                        size="sm"
                        className={`w-full justify-start ${filterLOR
                          ? "bg-teal-600 text-white hover:bg-teal-700"
                          : "hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                          }`}
                        onClick={() => setFilterLOR(!filterLOR)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Letter of Recommendation
                        {filterLOR && <span className="ml-auto text-xs"><Check className="w-4 h-4 text-teal-100" /></span>}
                      </Button>
                      <Button
                        variant={filterCertificate ? "default" : "outline"}
                        size="sm"
                        className={`w-full justify-start ${filterCertificate
                          ? "bg-teal-600 text-white hover:bg-teal-700"
                          : "hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                          }`}
                        onClick={() => setFilterCertificate(!filterCertificate)}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Certificate
                        {filterCertificate && <span className="ml-auto text-xs"><Check className="w-4 h-4 text-teal-100" /></span>}
                      </Button>
                    </div>
                    {(filterLOR || filterCertificate) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setFilterLOR(false)
                          setFilterCertificate(false)
                        }}
                      >
                        Clear Benefits Filter
                      </Button>
                    )}
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
              <ProjectCard
                key={project.id}
                project={project}
                className="bg-gradient-to-t from-teal-100 to-teal-50 shadow-md shadow-teal-100"
              />
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  className="bg-gradient-to-t from-yellow-100 to-yellow-50 shadow-md shadow-yellow-100"
                />
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  className="bg-gradient-to-t from-blue-100 to-blue-50 shadow-md shadow-blue-100"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  className
}: {
  project: Project
  className?: string
}) {
  const isOutdated = new Date(project.deadline) < new Date() && !project.closed

  return (
    <Card className={`flex h-full flex-col ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <CardTitle className="line-clamp-2 flex-1 pb-2">{project.title}</CardTitle>
            <CardDescription>
              {project.professor.name} • {project.professor.department}
            </CardDescription>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {project.category.name}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {project.college.name}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {project.college.logo && (
              <Image
                src={project.college.logo}
                alt={`${project.college.name} logo`}
                className="object-contain rounded"
                width={64}
                height={64}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className={`h-4 w-4 ${project.closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"}`} />
              <span>{project.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className={`h-4 w-4 ${project.closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"}`} />
              <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
            </div>
            {project.stipend && project.stipend > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <IndianRupee className={`h-4 w-4 ${project.closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"}`} />
                <span>₹{project.stipend.toLocaleString("en-IN")}/month</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Users className={`h-4 w-4 ${project.closed ? "text-blue-600" : isOutdated ? "text-yellow-600" : "text-teal-600"}`} />
              <span>{project.numberOfStudentsNeeded} students needed</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.skills.slice(0, 3).map((skill) => (
                <Badge variant="secondary" key={skill.id} className={`text-xs ${project.closed ? "bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white" : isOutdated ? "bg-transparent text-yellow-600 hover:bg-yellow-600 hover:text-white" : "bg-transparent text-teal-600 hover:bg-teal-600 hover:text-white"}`}>
                  {skill.name}
                </Badge>
              ))}
              {project.skills.length > 3 && (
                <Badge variant="secondary" className={`text-xs ${project.closed ? "bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white" : isOutdated ? "bg-transparent text-yellow-600 hover:bg-yellow-600 hover:text-white" : "bg-transparent text-teal-600 hover:bg-teal-600 hover:text-white"}`}>
                  +{project.skills.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Benefits */}
          <div className="flex flex-wrap gap-2">
            {project.certification && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Award className="h-3 w-3" />
                Certificate
              </Badge>
            )}
            {project.letterOfRecommendation && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Letter of Recommendation
              </Badge>
            )}
          </div>

          <Button
            className={`w-full ${project.closed ? "bg-blue-600 text-white hover:bg-blue-700" : isOutdated ? "bg-yellow-600 text-white hover:bg-yellow-700" : "bg-teal-600 text-white hover:bg-teal-700"}`}
            variant="default"
            onClick={() => redirect(`/project/${project.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}