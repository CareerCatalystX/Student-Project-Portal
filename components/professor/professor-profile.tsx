import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  User, 
  Mail, 
  Building2, 
  GraduationCap, 
  Award, 
  BookOpen, 
  MapPin, 
  Clock, 
  FileText, 
  ExternalLink,
  UserCheck
} from 'lucide-react'
import type { ProfessorProfileType } from "@/types/api-professor"

interface ProfessorProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: ProfessorProfileType | null
}

export function ProfessorProfile({ user, className, ...props }: ProfessorProfileCardProps) {
  if (!user) return null

  // Helper function to check if a field has value
  const hasValue = (value: any): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim() !== ""
    return Boolean(value)
  }

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Professor Profile</CardTitle>
        <CardDescription>
          View and manage your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-blue-600" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">
                {user.user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Mail className="h-5 w-5 text-blue-600" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {user.user.email}
              </p>
            </div>
          </div>

          {hasValue(user.department) && (
            <div className="flex items-center space-x-4">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">
                  {user.department}
                </p>
              </div>
            </div>
          )}

          {hasValue(user.designation) && (
            <div className="flex items-center space-x-4">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Designation</p>
                <p className="text-sm text-muted-foreground">
                  {user.designation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Academic Information */}
        {(hasValue(user.qualification) || hasValue(user.researchAreas)) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
            
            {hasValue(user.qualification) && (
              <div className="flex items-center space-x-4">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Qualification</p>
                  <p className="text-sm text-muted-foreground">
                    {user.qualification}
                  </p>
                </div>
              </div>
            )}

            {hasValue(user.researchAreas) && (
              <div className="flex items-start space-x-4">
                <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Research Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(user.researchAreas) ? (
                      user.researchAreas.map((area, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
                        >
                          {typeof area === 'string' ? area : area.name || area}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                        {user.researchAreas}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Office Information */}
        {(hasValue(user.officeLocation) || hasValue(user.officeHours)) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Office Information</h3>
            
            {hasValue(user.officeLocation) && (
              <div className="flex items-center space-x-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Office Location</p>
                  <p className="text-sm text-muted-foreground">
                    {user.officeLocation}
                  </p>
                </div>
              </div>
            )}

            {hasValue(user.officeHours) && (
              <div className="flex items-center space-x-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Office Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {user.officeHours}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Information */}
        {hasValue(user.bio) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Biography</h3>
            <div className="flex items-start space-x-4">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Bio</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Publications */}
        {hasValue(user.publications) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Publications</h3>
            <div className="flex items-start space-x-4">
              <Award className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Publications</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {user.publications}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Website */}
        {hasValue(user.websiteUrl) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Website</h3>
            <div className="flex items-center space-x-4">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Personal Website</p>
                <a 
                  href={user.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {user.websiteUrl}
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}