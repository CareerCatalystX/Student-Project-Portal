import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, IndianRupee, ArrowLeft, User, Building2, GraduationCap } from 'lucide-react'
import Link from "next/link"
// import { StudentApplicationForm } from "@/components/student-application-form"

interface ProjectDetailsProps {
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

export default function ProjectPage({
    id,
    title,
    description,
    professorName,
    deadline,
    duration,
    department,
    stipend,
    features,
}: ProjectDetailsProps) {
  return (
    <div className="min-h-screen bg-background w-screen">
      <header className="border-b">
        <div className="container px-4 py-4">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="mt-2 flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{professorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{department}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container grid gap-6 px-4 py-8 md:grid-cols-3 w-screen">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
                  {features.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
                  {features.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Duration: {duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
              </div>
              {stipend && (
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span>Stipend: ₹{stipend}/month</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>Department: {department}</span>
              </div>
              <div className="pt-2">
                <div className="mb-2 text-sm font-medium">Required Skills:</div>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button asChild className="w-full">
                <Link href={`/student/apply/${id}`}>Apply for this Project</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Application</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentApplicationForm projectId={params.id} />
            </CardContent>
          </Card>
        </div> */}
      </main>
    </div>
  )
}

