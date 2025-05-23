"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, X, Check, ChevronDown } from 'lucide-react'

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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

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
  features: z.array(z.string()).min(1, "At least one feature is required"),
  department: z.string().min(1, "Department is required"),
  milestones: z.array(z.string().min(1, "Milestones is required")),
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
  const [featureInput, setFeatureInput] = useState("")
  const [milestoneInput, setMilestoneInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: { number: 1, unit: "Month(s)" },
      stipend: undefined,
      deadline: "",
      features: [],
      department: "",
      milestones: [],
      numberOfStudentsNeeded: 1,
      preferredStudentDepartments: [],
      certification: false,
      letterOfRecommendation: false,
    },
  })

  const { setValue, watch } = form
  const features = watch("features")

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setValue("features", [...features, featureInput.trim()])
      setFeatureInput("")
    }
  }

  const removeFeature = (feature: string) => {
    setValue(
      "features",
      features.filter((f) => f !== feature)
    )
  }

  const milestones = watch("milestones")

  const addMilestone = () => {
    if (milestoneInput.trim() && !milestones.includes(milestoneInput.trim())) {
      setValue("milestones", [...milestones, milestoneInput.trim()])
      setMilestoneInput("")
    }
  }

  const removeMilestone = (milestone: string) => {
    setValue(
      "milestones",
      milestones.filter((m) => m !== milestone),
    )
  }

  async function onSubmit(data: ProjectFormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        router.push("/professor/login")
        throw new Error("Authentication token not found")
      }

      // Create a new object with the duration concatenated as a string
      const formattedData = {
        ...data,
        duration: `${data.duration.number} ${data.duration.unit}`, // Concatenate with space
      }

      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create project")
      }

      router.push("/professor/dashboard")
    } catch (err: any) {
      router.push("/professor/dashboard")
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
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
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Mathematics and Computing">Mathematics and Computing</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Chemical">Chemical</SelectItem>
                        <SelectItem value="Material">Material</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
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
                      <Checkbox checked={isSelected} className="text-blue-600 border-blue-300" />
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
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              

              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                  {isSubmitting ? (
                    <div className="flex space-x-2 justify-center items-center">
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}