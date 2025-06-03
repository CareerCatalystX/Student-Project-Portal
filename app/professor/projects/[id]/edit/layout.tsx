"use client" 
import { Toaster } from "@/components/ui/sonner" 
import { ProjectDataProvider } from "@/contexts/categorySkillsContext"; 
 
export default function RootLayout({ children }: Readonly<{ 
    children: React.ReactNode; 
}>) { 
    return ( 
        <div className="overflow-x-hidden"> 
            <main><ProjectDataProvider>{children}</ProjectDataProvider></main> 
            <Toaster richColors position="top-right" theme="light" /> 
        </div> 
    ) 
}