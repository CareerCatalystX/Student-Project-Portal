import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, School, GraduationCap } from "lucide-react";
import { z } from "zod";
import { UserProfile } from "@/types/api";

interface StudentProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserProfile | null;
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
            <User className="h-5 w-5 text-teal-600" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user.user?.name}</p>
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
        </div>

        {user.cvUrl ? (
          <div className="space-y-2">
            {(() => {
              const embedUrl = getGoogleDriveEmbedUrl(user.cvUrl!);
              return embedUrl ? (
                <div className="aspect-[4/3] w-full relative">
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border rounded"
                    title="Student CV"
                    allow="autoplay"
                  />
                </div>
              ) : (
                <div className="text-yellow-600 text-sm">
                  Invalid Google Drive URL format. Please ensure the CV is
                  shared with proper permissions.
                </div>
              );
            })()}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No CV uploaded yet.</p>
        )}

        <div className="space-y-4">
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
      </CardContent>
    </Card>
  );
}
