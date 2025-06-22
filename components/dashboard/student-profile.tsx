import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, School, GraduationCap, AlignLeft, Gauge, Wrench, BadgeCheck } from "lucide-react";
import { StudentProfile as StudentProfileType } from "@/types/profile";
import CVDisplay from "./cvDisplay";

interface StudentProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  user: StudentProfileType | null;
}


export function StudentProfile({
  user,
  className,
  ...props
}: StudentProfileProps) {

  if (!user) return null;

  return (
    <div className="h-fit">
      <Card className="bg-gradient-to-t from-white to-teal-50 shadow-md shadow-teal-50 h-full flex flex-col" {...props}>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
          <CardDescription>View and manage your profile information</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-col md:flex-row md:h-full gap-6">
            {/* Left: Profile Info */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-teal-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{user.user?.name}</p>
                  </div>
                </div>
                {/* Bio */}
                <div className="flex items-center space-x-4">
                  <AlignLeft className="h-5 w-5 text-teal-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Bio</p>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                </div>
                {/* GPA */}
                <div className="flex items-center space-x-4">
                  <Gauge className="h-5 w-5 text-teal-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">GPA</p>
                    <p className="text-sm text-muted-foreground">{user.gpa}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-teal-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <School className="h-5 w-5 text-teal-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">College</p>
                    <p className="text-sm text-muted-foreground">{user.user?.college.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <GraduationCap className="h-5 w-5 text-teal-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Academic Details</p>
                    <p className="text-sm text-muted-foreground">
                      {user.year} • {user.branch}
                    </p>
                  </div>
                </div>
                {/* Skills */}
                <div className="flex items-start space-x-4">
                  <Wrench className="h-5 w-5 text-teal-600" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-md"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Subscription */}
                {user.user?.subscriptions?.[0] && (
                  <div className="flex items-center space-x-4">
                    <BadgeCheck className="h-5 w-5 text-teal-600" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Subscription</p>
                      <p className="text-sm text-muted-foreground">
                        {user.user.subscriptions[0].plan.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: CV Section */}
            <CVDisplay user={user} />
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
