"use client"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Hero from "@/components/home";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);


  return (
    <AuroraBackground>
    <main className="min-h-screen flex flex-col flex-grow bg-background w-full">
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
    </AuroraBackground>
  );
}
