"use client"
import { useEffect, useState } from "react";
import { ProjectsList } from "@/components/projects-list";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import NoProjects from "@/components/no_project";
import { AlertCircle } from "lucide-react";
import Hero from "@/components/home";
import GradientCircle from "@/components/gradientcircle";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  return (
    <main className="min-h-screen flex flex-col flex-grow bg-background">
      <GradientCircle
                position={{ top: '-15%', right: '35%' }}
                size={500}
                colors={['#60a5fa', '#3b82f6']}
                opacity={0.5}
                blur={80}
                zIndex={0}
            />
      <Header />
      <div className="w-full relative z-10">
        {loading ? (
                  <div className={cn("flex mt-64 items-center justify-center bg-white")}>
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-700"></div>
                  </div>
                ) : (
                  <Hero />
                )
          }
        
      </div>
    </main>
  );
}
