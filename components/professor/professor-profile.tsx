import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { User, Mail, Building2, Calendar } from 'lucide-react'
import type { ProfessorProfile } from "@/types/api-professor"

interface ProfessorProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: ProfessorProfile | null
}

export function ProfessorProfile({ user, className, ...props }: ProfessorProfileCardProps) {
  if (!user) return null

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Professor Profile</CardTitle>
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
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Department</p>
              <p className="text-sm text-muted-foreground">
                {user.department}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <Button className="w-full">
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}

