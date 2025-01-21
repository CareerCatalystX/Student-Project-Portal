"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { StudentProfile } from "@/components/dashboard/student-profile"
import { ApplicationsList } from "@/components/dashboard/applications-list"
import { UserProfile } from "@/types/api"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("authToken")
      if (!token) {
        router.push("/student/login")
        return
      }

      try {
        const response = await fetch("/api/auth/profile/student", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          router.push("/student/login")
          return
        }

        const data = await response.json()
        setProfile(data.student)
      } catch {
        router.push("/student/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading || !profile) {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <StudentProfile 
            className="col-span-2 lg:col-span-3 h-fit w-full bg-gradient-to-t from-white to-teal-50 shadow-md shadow-teal-50" 
            user={profile} 
          />
          <ApplicationsList 
            className="col-span-2 lg:col-span-4 bg-gradient-to-t from-teal-500 to-teal-600" 
            applications={profile?.applications} 
          />
        </div>
      </div>
    </div>
  )
}