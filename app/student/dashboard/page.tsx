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
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data.user)
      } catch (err: any) {
        router.push("/student/login")
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className={cn("flex h-screen items-center justify-center bg-white")}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-black"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={profile} />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <StudentProfile className="col-span-4" user={profile} />
          <ApplicationsList className="col-span-3" applications={profile?.applications} />
        </div>
      </div>
    </div>
  )
}

