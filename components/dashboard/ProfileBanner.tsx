// components/professor/ProfileBanner.tsx
"use client"
import { StickyBanner } from "@/components/ui/sticky-banner"
import { useAuth } from "@/contexts/dashboardContext"
import Link from "next/link"

export function ProfileBanner() {
  const { isUpdated } = useAuth()

  if (isUpdated) return null

  return (
    <StickyBanner hideOnScroll={true} className="bg-gradient-to-b from-teal-500 to-blue-600">
      <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
        A complete profile increases your chances of selection —{" "}
        <Link href={"/update"} className="hover:underline">update yours now!</Link>
      </p>
    </StickyBanner>
  )
}