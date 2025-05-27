"use client";
import { Toaster } from "@/components/ui/sonner";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { AuthProvider, useAuth } from "@/contexts/dashboardContext";
import Link from "next/link";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isUpdated } = useAuth();

    return (
        <div className="overflow-x-hidden">
            {!isUpdated ? (
                <StickyBanner hideOnScroll={true} className="bg-gradient-to-b from-teal-500 to-blue-600">
                    <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
                        A complete profile increases your chances of selection —{" "}
                        <Link href={"/student/update"} className="hover:underline">update yours now!</Link>
                    </p>
                </StickyBanner>
            ) : null}
            <main>{children}</main>
            <Toaster richColors position="top-right" theme="light" />
        </div>
    );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
    );
}
