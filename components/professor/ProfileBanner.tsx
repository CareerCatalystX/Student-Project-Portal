// components/professor/ProfileBanner.tsx
"use client"
import { StickyBanner } from "@/components/ui/sticky-banner"
import { useAuth } from "@/contexts/professorDashboardContext"
import Link from "next/link"

export function ProfileBanner() {
  const { isUpdated } = useAuth()

  if (isUpdated) return null

  return (
    <StickyBanner hideOnScroll={true} className="bg-gradient-to-b from-teal-500 to-blue-600">
      <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
        A complete profile helps attract more students to your projects —{" "}
        <Link href={"/professor/update"} className="hover:underline">
          complete yours now!
        </Link>
      </p>
    </StickyBanner>
  )
}