"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/professor/header";
import { ProfessorProfile } from "@/components/professor/professor-profile";
import { ProjectsList } from "@/components/professor/projects-list";
import { ProfessorProfileType } from "@/types/api-professor";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/professorDashboardContext";

export default function ProfessorDashboardPage() {
  const { profile, loading } = useAuth()
  const router = useRouter();

  if (loading) {
    return (
      <div className={cn("flex h-screen w-screen items-center justify-center bg-white")}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-700"></div>
      </div>
    );
  }

  if(!profile){
    router.push("/professor/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <div className="flex-1 space-y-4 p-2 lg:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-blue-700">Professor Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ProfessorProfile 
            className="col-span-2 lg:col-span-3 h-fit w-full bg-gradient-to-t from-white to-blue-50 shadow-md shadow-blue-100" 
            user={profile} 
          />
          <ProjectsList 
            className="col-span-2 lg:col-span-4 h-fit bg-gradient-to-t from-blue-500 to-blue-600" 
            projects={profile?.projects} 
          />
        </div>
      </div>
    </div>
  );
}