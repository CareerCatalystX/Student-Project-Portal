"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, X, Check, ChevronDown, Search } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useProjectData } from "@/contexts/categorySkillsContext"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { toast } from "sonner"

const DEPARTMENTS = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil",
  "Chemical",
  "Material",
  "Mathematics and Computing"
]

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.object({
    number: z.number().min(1, "Duration must be at least 1"),
    unit: z.enum(["Month(s)", "Year(s)"]),
  }).refine(
    (data) => {
      if (data.unit === "Year(s)" && data.number > 0 && data.number <= 5) return true;
      if (data.unit === "Month(s)" && data.number > 0 && data.number <= 60) return true;
      return false;
    },
    {
      message: "Duration must be between 1-60 months or 1-5 years",
    }
  ),
  stipend: z.number().min(0, "Stipend must be a positive number").optional(),
  deadline: z.string().min(1, "Deadline is required"),
  department: z.string().min(1, "Department is required"),
  categoryName: z.string().min(1, "Category is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  numberOfStudentsNeeded: z.number().min(1, "At least one student is required"),
  preferredStudentDepartments: z
    .array(z.string())
    .min(1, "Select at least one preferred department"),
  certification: z.boolean(),
  letterOfRecommendation: z.boolean(),
})

type ProjectFormData = z.infer<typeof projectFormSchema>

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [skillSearch, setSkillSearch] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { categories = [], skills = [], loading, error: dataError } = useProjectData()



  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: { number: 1, unit: "Month(s)" },
      stipend: undefined,
      deadline: "",
      skills: [],
      department: "",
      categoryName: "",
      numberOfStudentsNeeded: 1,
      preferredStudentDepartments: [],
      certification: false,
      letterOfRecommendation: false,
    },
  })

  const selectedSkills = form.watch("skills") || []

  const addSkill = (skillName: string, field: any) => {
    const currentSkills = field.value || []
    if (skillName.trim() && !currentSkills.includes(skillName.trim())) {
      field.onChange([...currentSkills, skillName.trim()])
    }
  }

  const removeSkill = (skillName: string) => {
    form.setValue("skills", selectedSkills.filter((s) => s !== skillName))
  }

  const addCustomSkill = () => {
    if (skillSearch.trim() && !selectedSkills.includes(skillSearch.trim())) {
      form.setValue("skills", [...selectedSkills, skillSearch.trim()])
      setSkillSearch("")
      setSkillsOpen(false)
    }
  }

  async function onSubmit(data: ProjectFormData) {
    setIsSubmitting(true)
    setError(null)

    const createProjectPromise = async () => {
      const formattedData = {
        ...data,
        deadline: new Date(data.deadline),
        duration: `${data.duration.number} ${data.duration.unit}`, // Concatenate with space
      }
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create project")
      }

      return response.json();
    }
    toast.promise(createProjectPromise(), {
      loading: "Creating new project...",
      success: () => {
        router.push("/professor/dashboard")
        setIsSubmitting(false)
        return "New project created successfully.";
      },
      error: (err) => {
        setError(err.message)
        setIsSubmitting(false)
        return "Project creation failed: " + error;
      },
    });
  }

  if (loading) {
    return (
      <div className={cn("flex h-screen w-screen items-center justify-center bg-white")}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">Create New Project</CardTitle>
          <CardDescription className="text-blue-600/80">
            Create a new project for students to apply to. Fill in all the required details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project"
                        {...field}
                        className="min-h-[100px] border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-600">Duration</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            type="number"
                            max={field.value.unit === "Year(s)" ? "5" : "60"}
                            placeholder="Duration"
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              field.onChange({
                                ...field.value,
                                number: value,
                              });
                            }}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50 w-24"
                            required
                          />
                        </FormControl>

                        <Select
                          value={field.value.unit}
                          onValueChange={(value: "Month(s)" | "Year(s)") => {
                            field.onChange({
                              number: field.value.number,
                              unit: value,
                            });
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Month(s)">Month(s)</SelectItem>
                            <SelectItem value="Year(s)">Year(s)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormDescription className="text-blue-600/80">
                        {field.value.unit === "Year(s)" ? "Maximum 5 years" : "Maximum 60 months"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stipend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-600">Stipend (₹/month)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                          placeholder="Enter amount"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? 0 : parseFloat(e.target.value)
                            field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Application Deadline</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={new Date().toISOString().split("T")[0]}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-600">Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50">
                            <SelectValue placeholder="Select your department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-600">Project Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50">
                            <SelectValue placeholder="Select project category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Required Skills</FormLabel>
                    <FormDescription className="text-blue-600/80">
                      Select existing skills or add new ones by typing and pressing Enter.
                    </FormDescription>

                    <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between border-blue-200 bg-blue-50/50 hover:bg-blue-100"
                          >
                            <span className="flex items-center gap-2">
                              <Search className="h-4 w-4" />
                              Search or add skills...
                            </span>
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-full p-2 bg-white border border-blue-200 rounded-md shadow-md transition-all duration-200 ease-in-out">
                        <Command className="max-h-60 overflow-hidden">
                          <CommandInput
                            placeholder="Search skills..."
                            value={skillSearch}
                            onValueChange={setSkillSearch}
                          />
                          <div className="max-h-40 overflow-y-auto">
                            <CommandEmpty className="p-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-500 mb-2">No skills found.</p>
                                {skillSearch && (
                                  <Button
                                    size="sm"
                                    onClick={addCustomSkill}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add "{skillSearch}"
                                  </Button>
                                )}
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {skills
                                .filter(skill =>
                                  skill.name.toLowerCase().includes(skillSearch.toLowerCase())
                                )
                                .map((skill) => (
                                  <CommandItem
                                    key={skill.id}
                                    onSelect={() => {
                                      addSkill(skill.name, field)
                                      setSkillsOpen(false)
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${selectedSkills.includes(skill.name)
                                        ? "opacity-100"
                                        : "opacity-0"
                                        }`}
                                    />
                                    {skill.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </div>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value?.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 relative py-1 px-6"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="absolute -top-1 -right-1 bg-blue-700 text-white rounded-full p-0.5 text-xs leading-none"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredStudentDepartments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600">Preferred Student Departments</FormLabel>
                    <FormDescription className="text-blue-600/80">
                      Select departments that students should be from.
                    </FormDescription>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between border-blue-200 bg-blue-50/50 hover:bg-blue-100"
                          >
                            {field.value?.length
                              ? `${field.value.length} department${field.value.length > 1 ? "s" : ""} selected`
                              : "Select departments"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent align="start" className="w-full p-2 bg-white border border-blue-200 rounded-md shadow-md">
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {DEPARTMENTS.map((department) => {
                            const isSelected = field.value?.includes(department)

                            return (
                              <div
                                key={department}
                                onClick={() => {
                                  const currentValue = field.value || []
                                  field.onChange(
                                    isSelected
                                      ? currentValue.filter((d) => d !== department)
                                      : [...currentValue, department]
                                  )
                                }}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 cursor-pointer"
                              >
                                <Checkbox checked={isSelected} className="text-blue-600 border-blue-300 data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-600" />
                                <span className="text-gray-700">{department}</span>
                              </div>
                            )
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="certification"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-blue-200 p-3 shadow-sm bg-blue-50/50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-blue-600">Certification</FormLabel>
                        <FormDescription className="text-blue-600/80">
                          Provide certification upon completion
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-blue-600" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="letterOfRecommendation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-blue-200 p-3 shadow-sm bg-blue-50/50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-blue-600">Letter of Recommendation</FormLabel>
                        <FormDescription className="text-blue-600/80">Provide LOR upon completion</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-blue-600" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="bg-white hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors flex justify-center items-center w-36"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Project..." : "Create Project"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}