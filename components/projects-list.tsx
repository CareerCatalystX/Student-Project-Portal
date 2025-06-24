"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  IndianRupee,
  Search,
  SlidersHorizontal,
  Users,
  Award,
  FileText,
  Check,
  ExternalLink,
  MapPin,
  GraduationCap,
} from "lucide-react"
import { redirect } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    const uniqueColleges = Array.from(new Set(projects.map((project) => project.college.name))).sort()
    return ["All Colleges", ...uniqueColleges]
  }, [projects])

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(projects.map((project) => project.category.name))).sort()
    return ["All Categories", ...uniqueCategories]
  }, [projects])

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        project.professor.department === selectedDepartment ||
        project.department === selectedDepartment
      const matchesCollege = selectedCollege === "All Colleges" || project.college.name === selectedCollege
      const matchesCategory = selectedCategory === "All Categories" || project.category.name === selectedCategory
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

  const handleClosedRedirect = () => {
    window.open("/projects/closed", "_blank")
  }

  const handleOverdueRedirect = () => {
    window.open("/projects/overdue", "_blank")
  }

  return (
    <div className="w-full space-y-6">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 px-4">
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
                        <SelectValue placeholder="Select category" />
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
                        className={`w-full justify-start ${
                          filterLOR
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                        }`}
                        onClick={() => setFilterLOR(!filterLOR)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Letter of Recommendation
                        {filterLOR && (
                          <span className="ml-auto text-xs">
                            <Check className="w-4 h-4 text-teal-100" />
                          </span>
                        )}
                      </Button>
                      <Button
                        variant={filterCertificate ? "default" : "outline"}
                        size="sm"
                        className={`w-full justify-start ${
                          filterCertificate
                            ? "bg-teal-600 text-white hover:bg-teal-700"
                            : "hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                        }`}
                        onClick={() => setFilterCertificate(!filterCertificate)}
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Certificate
                        {filterCertificate && (
                          <span className="ml-auto text-xs">
                            <Check className="w-4 h-4 text-teal-100" />
                          </span>
                        )}
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
                    <div className="space-y-3">
                      <h4 className="font-medium">Project Status</h4>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                          onClick={handleClosedRedirect}
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Closed Projects
                          </div>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300"
                          onClick={handleOverdueRedirect}
                        >
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Overdue Projects
                          </div>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Open Projects */}
        <div className="space-y-6 px-4">
          <div className="grid gap-4">
            {openProjects.map((project) => (
              <ProjectCard key={project.id} project={project} status="open" />
            ))}
          </div>
        </div>

        {/* Outdated Projects */}
        {outdatedProjects.length > 0 && (
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-amber-700">Overdue Projects</h2>
            <div className="grid gap-4">
              {outdatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} status="overdue" />
              ))}
            </div>
          </div>
        )}

        {/* Closed Projects */}
        {closedProjects.length > 0 && (
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-slate-700">Closed Projects</h2>
            <div className="grid gap-4">
              {closedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} status="closed" />
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
  status = "open",
}: {
  project: Project
  status?: "open" | "closed" | "overdue"
}) {
  const statusConfig = {
    open: {
      cardClass:
        "border-teal-200 bg-gradient-to-br from-teal-50/50 to-white hover:shadow-lg hover:shadow-teal-100/50 transition-all duration-200",
      iconColor: "text-teal-600",
      badgeClass: "border-teal-200 text-teal-700 bg-teal-50",
      buttonClass: "bg-teal-600 hover:bg-teal-700 text-white",
    },
    overdue: {
      cardClass:
        "border-amber-200 bg-gradient-to-br from-amber-50/50 to-white hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-200",
      iconColor: "text-amber-600",
      badgeClass: "border-amber-200 text-amber-700 bg-amber-50",
      buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    closed: {
      cardClass:
        "border-slate-200 bg-gradient-to-br from-slate-50/50 to-white hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-200",
      iconColor: "text-slate-600",
      badgeClass: "border-slate-200 text-slate-700 bg-slate-50",
      buttonClass: "bg-slate-600 hover:bg-slate-700 text-white",
    },
  }

  const config = statusConfig[status]

  return (
    <Card
      className={`${config.cardClass} border-l-4 ${status === "open" ? "border-l-teal-500" : status === "overdue" ? "border-l-amber-500" : "border-l-slate-500"}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={`${config.badgeClass} text-xs font-medium`}>
                {project.category.name}
              </Badge>
              {status === "overdue" && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
              {status === "closed" && (
                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                  Closed
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">{project.title}</CardTitle>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">{project.professor.name}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{project.college.name}</span>
              </div>
            </div>
          </div>
          {project.college.logo && (
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage src={project.college.logo || "/placeholder.svg"} alt={project.college.name} />
              <AvatarFallback className="text-xs font-semibold bg-teal-100 text-teal-700">
                {project.college.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>

        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${config.iconColor}`} />
            <span className="font-medium">{project.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className={`h-4 w-4 ${config.iconColor}`} />
            <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
          </div>
          {project.stipend && project.stipend > 0 && (
            <div className="flex items-center gap-2">
              <IndianRupee className={`h-4 w-4 ${config.iconColor}`} />
              <span className="font-medium">₹{project.stipend.toLocaleString("en-IN")}/mo</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className={`h-4 w-4 ${config.iconColor}`} />
            <span>{project.numberOfStudentsNeeded} needed</span>
          </div>
        </div>

        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.skills.slice(0, 4).map((skill) => (
              <Badge
                key={skill.id}
                variant="outline"
                className={`text-xs px-2 py-0.5 ${config.badgeClass} border-dashed`}
              >
                {skill.name}
              </Badge>
            ))}
            {project.skills.length > 4 && (
              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${config.badgeClass} border-dashed`}>
                +{project.skills.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Benefits and Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {project.certification && (
              <div className={`flex items-center gap-1 text-xs ${config.iconColor}`}>
                <Award className="h-3.5 w-3.5" />
                <span>Certificate</span>
              </div>
            )}
            {project.letterOfRecommendation && (
              <div className={`flex items-center gap-1 text-xs ${config.iconColor}`}>
                <FileText className="h-3.5 w-3.5" />
                <span>LOR</span>
              </div>
            )}
          </div>
          <Button
            size="sm"
            className={`${config.buttonClass} px-4 py-2 text-sm font-medium`}
            onClick={() => redirect(`/projects/${project.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
