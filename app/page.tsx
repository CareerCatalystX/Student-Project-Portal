"use client"
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/home";
import { Typewriter } from "@/components/ui/typewriter";
import Eight from "@/components/animata/bento-grid/eight";
import Image from "next/image";

function TimeDisplay() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTime(currentTime);
  }, []);

  return <>{time} · Today</>;
}

function IosOgShellCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xs md:max-w-xl md:min-w-80 mx-auto flex flex-col mt-36 md:mt-0 md:justify-center min-h-screen rounded-lg px-px pb-px shadow-inner-shadow">
      <div className="p-4 flex flex-col md:px-5 bg-black rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-black">
        <div className="mb-2 text-sm md:text-neutral-500 text-neutral-500">
          iMessage
        </div>
        <div className="mb-3 text-xs md:text-sm text-neutral-500">
          <TimeDisplay />
        </div>
        <div className="ml-auto px-4 py-2 text-white bg-blue-500 rounded-2xl">
          <span>Hey!</span>
        </div>
        <div className="text-xs pr-1 text-neutral-500 text-end">
          Delivered
        </div>
        <div className="mr-auto px-4 py-2 mb-3 text-white bg-neutral-700 rounded-2xl">
          <span>Where am I ?</span>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const texts = [
    "Bruh, this go crazy."
  ]
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      {loading ? (
        <IosOgShellCard>
          <div className="ml-auto px-4 py-2 mb-3 text-white bg-blue-500 rounded-2xl">
            <div className="text-sm md:text-base font-semibold text-base-900 truncate">
              <Typewriter texts={texts} delay={0} baseText="" />
            </div>
          </div>
        </IosOgShellCard>
      ) : (
        <main className="min-h-screen flex flex-col flex-grow bg-background w-full relative">
          <div className="relative z-10">
            <Header />
          </div>
          
          <div className="w-full relative z-10">
            {/* Background Image */}
            <div className="absolute min-h-screen inset-0 z-0">
              <Image
                src="/bgHome.jpg"
                alt="Background"
                fill
                className="object-cover"
                priority
                quality={90}
              />
            </div>
            
            {/* Hero Content */}
            <div className="relative z-10">
              <Hero />
            </div>
          </div>
          
          <div className="relative z-10 py-12 mx-12 max-h-fit">
            <div className="bg-white-200/50 backdrop-blur-xl rounded-2xl shadow-xl shadow-white-300/30 border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl animate-pulse"></div>
              
              <div className="relative z-10 py-12 px-24">
                <Eight />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}