'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Loader2, Inbox } from "lucide-react";

interface ApplicationStudent {
  name: string;
  email: string;
  branch: string;
  cvUrl?: string;
}

interface ApplicationProject {
  title: string;
}

interface Application {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  student: ApplicationStudent;
  project: ApplicationProject;
}

const getGoogleDriveEmbedUrl = (url: string): string | undefined => {
  const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0];
  if (!fileId) return undefined;
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

async function fetchApplications(projectId: string | undefined) {
  if (!projectId) return { applications: [] };

  const token = localStorage.getItem("authToken");
  const res = await fetch(`/api/projects/${projectId}/applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch applications');
  }
  return res.json();
}

async function updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected') {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`/api/applications/${applicationId}/status`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error('Failed to update application status');
  }

  return res.json();
}

export default function ApplicationsPage() {
  const params = useParams();
  const projectId = typeof params?.id === 'string' ? params.id : undefined;
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<{ [key: string]: 'accepted' | 'rejected' | null }>({});
  const router = useRouter();

  useEffect(() => {
    const getApplications = async () => {
      try {
        const data = await fetchApplications(projectId);
        setApplications(data.applications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      getApplications();
    } else {
      setLoading(false);
    }
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25";
      case "accepted":
        return "bg-green-500/15 text-green-700 hover:bg-green-500/25";
      case "rejected":
        return "bg-red-500/15 text-red-700 hover:bg-red-500/25";
      default:
        return "bg-gray-500/15 text-gray-700 hover:bg-gray-500/25";
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: 'accepted' | 'rejected') => {
    setProcessing(prev => ({ ...prev, [applicationId]: status }));

    try {
      await updateApplicationStatus(applicationId, status);

      setApplications(prev =>
        prev.map(app => (app.id === applicationId ? { ...app, status } : app))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setProcessing(prev => {
        const newProcessing = { ...prev };
        delete newProcessing[applicationId];
        return newProcessing;
      });
    }
  };

  if (loading) {
    return (
      <div className={cn("flex w-screen h-screen items-center justify-center bg-white")}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 bg-gradient-to-t from-blue-500 to-blue-600">
      <Card className="max-w-7xl mx-auto">
        <CardHeader className="relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-2xl">Project Applications</CardTitle>
              <CardDescription className="text-xs sm:text-base mt-1">
                {applications[0]?.project?.title || 'Project Details'}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="absolute top-7 right-6 bg-blue-600 text-white hover:bg-blue-700">
              {applications.length} Applications
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-6 sm:py-10">
              <Inbox className="h-16 w-16 text-gray-500" />
              <p className="text-gray-600 text-md sm:text-xl">No one has applied for this project yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.map((application) => (
                <Card key={application.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg sm:text-xl font-semibold truncate">
                          {application.student.name}
                        </h3>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600">
                        <strong>Email:</strong> {application.student.email}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600">
                        <strong>Branch:</strong> {application.student.branch}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-sm sm:text-base">CV:</strong>
                      {application.student.cvUrl ? (
                        <div className="space-y-2">
                          {(() => {
                            const embedUrl = getGoogleDriveEmbedUrl(application.student.cvUrl!);
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
                                Invalid Google Drive URL format. Please ensure the CV is shared with proper permissions.
                              </div>
                            );
                          })()}
                          <a
                            href={application.student.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm inline-block"
                          >
                            Open CV in new tab
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No CV available</span>
                      )}
                    </div>

                    {application.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
                          onClick={() => handleStatusUpdate(application.id, 'accepted')}
                          disabled={processing[application.id] === 'accepted' || processing[application.id] === 'rejected'}
                        >
                          {processing[application.id] === 'accepted' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                          onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          disabled={processing[application.id] === 'accepted' || processing[application.id] === 'rejected'}
                        >
                          {processing[application.id] === 'rejected' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => router.push('/professor/dashboard')}
              className="text-sm sm:text-base"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
