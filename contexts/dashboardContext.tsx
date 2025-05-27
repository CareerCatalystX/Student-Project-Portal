"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentProfile } from "@/types/profile" // or wherever you store the types

interface AuthContextType {
  profile: StudentProfile | null
  loading: boolean
  isUpdated: boolean
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>; 
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  isUpdated: true,
  setIsUpdated: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdated, setIsUpdated] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/profile/student", {
          method: "GET",
          credentials: "include", // Use cookies
        })

        if (!response.ok) {
          router.push("/student/login")
          return
        }

        const data = await response.json()
        setProfile(data.student)
        setIsUpdated(data.student.isUpdated)
      } catch (err) {
        router.push("/student/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  return (
    <AuthContext.Provider value={{ profile, loading, isUpdated, setIsUpdated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)