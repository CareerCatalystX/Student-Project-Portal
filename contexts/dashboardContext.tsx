"use client"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { StudentProfile } from "@/types/profile" // or wherever you store the types

interface AuthContextType {
  profile: StudentProfile | null
  loading: boolean
  isUpdated: boolean
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>; 
  refetchProfile: () => Promise<void>
  refreshProfile: () => void
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  isUpdated: true,
  setIsUpdated: () => {},
  refetchProfile: async () => {},
  refreshProfile: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdated, setIsUpdated] = useState(true)
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const router = useRouter()
  const hasInitialized = useRef(false)

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile/student", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        router.push("/login")
        return
      }

      const data = await response.json()
      setProfile(data.student)
      setIsUpdated(data.student.isUpdated)
      hasInitialized.current = true
      setShouldRefetch(false)
    } catch (err) {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = () => {
    setShouldRefetch(true)
  }

  useEffect(() => {
      // Fetch if not initialized OR if refresh is requested
      if (!hasInitialized.current || shouldRefetch) {
        fetchProfile()
      }
    }, [shouldRefetch])

  return (
    <AuthContext.Provider value={{ profile, loading, isUpdated, setIsUpdated, refetchProfile: fetchProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)