"use client" 
import { Toaster } from "@/components/ui/sonner" 
import { AuthProvider } from "@/contexts/professorDashboardContext"; 
 
export default function RootLayout({ children }: Readonly<{ 
    children: React.ReactNode; 
}>) { 
    return ( 
        <div className="overflow-x-hidden"> 
            <main><AuthProvider>{children}</AuthProvider></main> 
            <Toaster richColors position="top-right" theme="light" /> 
        </div> 
    ) 
}