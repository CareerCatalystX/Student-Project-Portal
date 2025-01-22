import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Inbox } from 'lucide-react'
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
        <CardTitle className="text-lg font-semibold text-white">Recent Applications</CardTitle>
        <CardDescription className="text-white/70">
          Track the status of your project applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-18 sm:py-11">
            <Inbox className="h-20 w-20 text-white" />
            <p className="text-white text-md sm:text-xl">No application yet</p>
          </div>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col space-y-2 rounded-lg border p-3 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium leading-none">
                      Project : {application.project?.title}
                    </h3>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))
          )}
          <Button variant="outline" className="w-full text-teal-600 hover:text-teal-600" asChild>
            <Link href="/project">Browse Projects</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

