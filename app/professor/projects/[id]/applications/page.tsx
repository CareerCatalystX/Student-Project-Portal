'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Loader2, Inbox, SlidersHorizontal, Check, Filter } from "lucide-react";

interface ApplicationStudent {
  name: string;
  email: string;
  branch: string;
  cvUrl?: string;
  user: {
    name: string;
    email: string
  }
}

interface ApplicationProject {
  title: string;
}

interface Application {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
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

  const res = await fetch(`/api/projects/${projectId}/applications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials:'include'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch applications');
  }
  return res.json();
}

async function updateApplicationStatus(applicationId: string, status: 'ACCEPTED' | 'REJECTED') {
  const res = await fetch(`/api/applications/${applicationId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
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
  const [processing, setProcessing] = useState<{ [key: string]: 'ACCEPTED' | 'REJECTED' | null }>({});
  
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [filterWithCV, setFilterWithCV] = useState<boolean>(false);
  const [filterWithoutCV, setFilterWithoutCV] = useState<boolean>(false);
  
  const router = useRouter();

  useEffect(() => {
    const getApplications = async () => {
      try {
        const data = await fetchApplications(projectId);
        setApplications(data.applications);
      } catch (error) {
        router.push("/professor/dashboard")
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

  // Get unique branches for filter
  const branches = useMemo(() => {
    const uniqueBranches = Array.from(new Set(applications.map(app => app.student.branch)));
    return uniqueBranches.sort();
  }, [applications]);

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(applications.map(app => app.status)));
    return uniqueStatuses.sort();
  }, [applications]);

  // Filter applications based on selected filters
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Status filter
      if (selectedStatus !== 'all' && app.status !== selectedStatus) {
        return false;
      }

      // Branch filter
      if (selectedBranch !== 'all' && app.student.branch !== selectedBranch) {
        return false;
      }

      // CV filters
      const hasCV = Boolean(app.student.cvUrl && app.student.cvUrl.trim() !== '');
      if (filterWithCV && !hasCV) {
        return false;
      }
      if (filterWithoutCV && hasCV) {
        return false;
      }

      return true;
    });
  }, [applications, selectedStatus, selectedBranch, filterWithCV, filterWithoutCV]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25";
      case "ACCEPTED":
        return "bg-green-500/15 text-green-700 hover:bg-green-500/25";
      case "REJECTED":
        return "bg-red-500/15 text-red-700 hover:bg-red-500/25";
      default:
        return "bg-gray-500/15 text-gray-700 hover:bg-gray-500/25";
    }
  };

  const handleStatusUpdate = async (applicationId: string, status: 'ACCEPTED' | 'REJECTED') => {
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

  const clearAllFilters = () => {
    setSelectedStatus('all');
    setSelectedBranch('all');
    setFilterWithCV(false);
    setFilterWithoutCV(false);
  };

  const hasActiveFilters = selectedStatus !== 'all' || selectedBranch !== 'all' || filterWithCV || filterWithoutCV;

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
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <SlidersHorizontal className="h-4 w-4" />
                    {hasActiveFilters && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></div>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Applications</SheetTitle>
                    <SheetDescription>Filter applications by status, branch, and CV availability</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Status</h4>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Branch</h4>
                      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Branches</SelectItem>
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">CV Availability</h4>
                      <div className="space-y-2">
                        <Button
                          variant={filterWithCV ? "default" : "outline"}
                          size="sm"
                          className={`w-full justify-start ${filterWithCV
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                            }`}
                          onClick={() => {
                            setFilterWithCV(!filterWithCV);
                            if (filterWithoutCV) setFilterWithoutCV(false);
                          }}
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          With CV
                          {filterWithCV && <span className="ml-auto text-xs"><Check className="w-4 h-4 text-blue-100" /></span>}
                        </Button>
                        <Button
                          variant={filterWithoutCV ? "default" : "outline"}
                          size="sm"
                          className={`w-full justify-start ${filterWithoutCV
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                            }`}
                          onClick={() => {
                            setFilterWithoutCV(!filterWithoutCV);
                            if (filterWithCV) setFilterWithCV(false);
                          }}
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Without CV
                          {filterWithoutCV && <span className="ml-auto text-xs"><Check className="w-4 h-4 text-blue-100" /></span>}
                        </Button>
                      </div>
                      {(filterWithCV || filterWithoutCV) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setFilterWithCV(false);
                            setFilterWithoutCV(false);
                          }}
                        >
                          Clear CV Filter
                        </Button>
                      )}
                    </div>

                    {hasActiveFilters && (
                      <div className="pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-muted-foreground hover:text-foreground"
                          onClick={clearAllFilters}
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
                {filteredApplications.length} of {applications.length} Applications
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-6 sm:py-10">
              <Inbox className="h-16 w-16 text-gray-500" />
              <p className="text-gray-600 text-md sm:text-xl">
                {applications.length === 0 
                  ? "No one has applied for this project yet." 
                  : "No applications match your current filters."
                }
              </p>
              {hasActiveFilters && applications.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearAllFilters}
                  className="text-sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg sm:text-xl font-semibold truncate">
                          {application.student?.user?.name}
                        </h3>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600">
                        <strong>Email:</strong> {application.student?.user?.email}
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

                    {application.status === 'PENDING' && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
                          onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}
                          disabled={processing[application.id] === 'ACCEPTED' || processing[application.id] === 'REJECTED'}
                        >
                          {processing[application.id] === 'ACCEPTED' ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                          onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                          disabled={processing[application.id] === 'ACCEPTED' || processing[application.id] === 'REJECTED'}
                        >
                          {processing[application.id] === 'REJECTED' ? (
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