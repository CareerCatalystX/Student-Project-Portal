import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, School, GraduationCap, Inbox, FileWarning, AlignLeft, Gauge, Wrench, BadgeCheck } from "lucide-react";
import { z } from "zod";
import { StudentProfile as StudentProfileType } from "@/types/profile";

interface StudentProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  user: StudentProfileType | null;
}

const cvSchema = z
  .string()
  .min(1, "CV link is required")
  .regex(
    /^https?:\/\/(?:www\.)?drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([-\w]{25,})(?:\/view|\/preview)?(?:\?.*)?$/,
    "Invalid Google Drive link"
  );

const getGoogleDriveEmbedUrl = (url: string): string | null => {
  const match = url.match(
    /^https?:\/\/(?:www\.)?drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([-\w]{25,})/
  );
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
};

export function StudentProfile({
  user,
  className,
  ...props
}: StudentProfileProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvUrl, setCvUrl] = useState(user?.cvUrl || "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;
      const result = cvSchema.safeParse(cvUrl);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }

      const response = await fetch("/api/auth/student/cvUpdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ cvUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to update CV URL");
      }

      // Reload the page to reflect changes
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false)
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen">
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
            <div className="flex-1 flex flex-col justify-between gap-4 h-full">
              <div className="flex-grow flex items-center justify-center">
                {user.cvUrl ? (
                  (() => {
                    const embedUrl = getGoogleDriveEmbedUrl(user.cvUrl!);
                    return embedUrl ? (
                      <div className="aspect-[4/3] h-full w-full relative">
                        <iframe
                          src={embedUrl}
                          className="absolute inset-0 w-full h-full border rounded"
                          title="Student CV"
                          allow="autoplay"
                        />
                      </div>
                    ) : (
                      <div className="text-yellow-600 text-sm">
                        Invalid Google Drive URL format. Please ensure the CV is shared with proper permissions.
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 py-18 sm:py-11">
                    <FileWarning className="h-20 w-20 text-gray-500" />
                    <p className="text-black text-md sm:text-xl">No CV uploaded yet.</p>
                  </div>
                )}
              </div>

              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={cvUrl}
                      onChange={(e) => setCvUrl(e.target.value)}
                      className="w-full border rounded p-2 text-sm"
                      placeholder="Enter Google Drive CV URL"
                    />
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        className="bg-teal-600 text-white hover:bg-teal-700 w-24"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex space-x-2 justify-center items-center">
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                          </div>
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setError("");
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-teal-600 text-white hover:bg-teal-700"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit CV URL
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
