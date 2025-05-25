"use client"
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Hero from "@/components/home";
import { Typewriter } from "@/components/ui/typewriter";
import Eight from "@/components/animata/bento-grid/eight";

function IosOgShellCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xs md:max-w-xl md:min-w-80 mx-auto flex flex-col mt-36 md:mt-0 md:justify-center min-h-screen rounded-lg px-px pb-px shadow-inner-shadow">
      <div className="p-4 flex flex-col md:px-5 bg-black rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-black">
        <div className="mb-2 text-sm md:text-neutral-500 text-neutral-500">
          iMessage
        </div>
        <div className="mb-3 text-xs md:text-sm text-neutral-500">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Today
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
        <main className="min-h-screen flex flex-col flex-grow bg-background w-full">
          <Header />
          <div className="w-full relative z-10">
            <Hero />
          </div>
          <Eight />
        </main>
      )}
    </>
  );
}