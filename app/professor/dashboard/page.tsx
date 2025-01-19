"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/professor/header";
import { ProfessorProfile } from "@/components/professor/professor-profile";
import { ProjectsList } from "@/components/professor/projects-list";
import { ProfessorProfile as ProfessorProfileType } from "@/types/api-professor";
import { cn } from "@/lib/utils";

export default function ProfessorDashboardPage() {
  const [profile, setProfile] = useState<ProfessorProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/professor/login");
        return;
      }

      try {
        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          router.push("/professor/login");
          return;
        }

        const data = await response.json();
        setProfile(data.user);
      } catch {
        router.push("/professor/login");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (loading || !profile) {
    return (
      <div className={cn("flex h-screen w-screen items-center justify-center bg-white")}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <div className="flex-1 space-y-4 p-2 lg:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Professor Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ProfessorProfile 
            className="col-span-2 lg:col-span-3 h-fit w-full" 
            user={profile} 
          />
          <ProjectsList 
            className="col-span-2 lg:col-span-4" 
            projects={profile?.projects} 
          />
        </div>
      </div>
    </div>
  );
}