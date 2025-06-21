"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { StudentProfile } from "@/components/dashboard/student-profile"
import { ApplicationsList } from "@/components/dashboard/applications-list"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/dashboardContext"

export default function DashboardPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  if (loading || !profile) {
    if (!profile && !loading) {
      router.push("/login");
    }
    
    return (
      <div className={cn("flex h-screen w-screen items-center justify-center bg-white")}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-700"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <div className="flex-1 space-y-4 p-2 lg:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-teal-700">Student Dashboard</h2>
        </div>
        <div className="grid gap-4">
          <StudentProfile 
            className="" 
            user={profile} 
          />
          <ApplicationsList 
            className="= h-fit bg-gradient-to-t from-teal-500 to-teal-600" 
            applications={profile?.applications} 
          />
        </div>
      </div>
    </div>
  )
}