import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { User, Mail, School, GraduationCap, FileText } from 'lucide-react'
import { UserProfile } from "@/types/api"

interface StudentProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserProfile | null
}

export function StudentProfile({ user, className, ...props }: StudentProfileProps) {
  if (!user) return null

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Student Profile</CardTitle>
        <CardDescription>
          View and manage your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">
                {user.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <School className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">College</p>
              <p className="text-sm text-muted-foreground">
                {user.college}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Academic Details</p>
              <p className="text-sm text-muted-foreground">
                {user.year} • {user.branch}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="w-full" asChild>
            <a href={user.cvUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-4 w-4" />
              View CV
            </a>
          </Button>
          <Button className="w-full">
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

