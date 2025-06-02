"use client"
import { Toaster } from "@/components/ui/sonner"
import { ProfileBanner } from "@/components/professor/ProfileBanner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="overflow-x-hidden">
            <ProfileBanner />
            <main>{children}</main>
            <Toaster richColors position="top-right" theme="light" />
        </div>
    )
}