import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, School, GraduationCap, AlignLeft, Gauge, Wrench, BadgeCheck } from "lucide-react"
import type { StudentProfile as StudentProfileType } from "@/types/profile"
import CVDisplay from "./cvDisplay"

interface StudentProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  user: StudentProfileType | null
}

export function StudentProfile({ user, className, ...props }: StudentProfileProps) {
  if (!user) return null

  return (
    <div className="h-fit">
      <Card className="bg-gradient-to-t from-white to-teal-50 shadow-md shadow-teal-50" {...props}>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Student Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Profile Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-teal-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Name</p>
                      <p className="text-sm text-gray-600 truncate">{user.user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600 truncate">{user.user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <AlignLeft className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Bio</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-teal-200 pb-2">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <School className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">College</p>
                      <p className="text-sm text-gray-600">{user.user?.college.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Academic Details</p>
                      <p className="text-sm text-gray-600">
                        {user.year} • {user.branch}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Gauge className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">GPA</p>
                      <p className="text-sm text-gray-600">{user.gpa}</p>
                    </div>
                  </div>

                  {user.user?.subscriptions?.[0] && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <BadgeCheck className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">Subscription</p>
                        <p className="text-sm text-gray-600">{user.user.subscriptions[0].plan.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-teal-200 pb-2">
                  Skills & Expertise
                </h3>
                <div className="flex items-start space-x-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: CV Section - Takes 1 column on large screens */}
            <div className="mt-12 lg:mt-0 lg:col-span-1">
              <CVDisplay user={user} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
