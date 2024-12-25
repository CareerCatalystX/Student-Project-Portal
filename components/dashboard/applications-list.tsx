import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from 'lucide-react'
import { Application } from "@/types/api"
import Link from "next/link"

interface ApplicationsListProps extends React.HTMLAttributes<HTMLDivElement> {
  applications?: Application[]
}

export function ApplicationsList({ applications = [], className, ...props }: ApplicationsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25"
      case "accepted":
        return "bg-green-500/15 text-green-700 hover:bg-green-500/25"
      case "rejected":
        return "bg-red-500/15 text-red-700 hover:bg-red-500/25"
      default:
        return "bg-gray-500/15 text-gray-700 hover:bg-gray-500/25"
    }
  }

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>
          Track the status of your project applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No applications yet
            </p>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col space-y-2 rounded-lg border p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium leading-none">
                      Project ID: {application.projectId}
                    </h3>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/projects">Browse Projects</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

