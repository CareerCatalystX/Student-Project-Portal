"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const router = useRouter();

  return (
    <header className="backdrop-blur-xl border-b border-blue-100 shadow-[10px_0_15px_rgba(37,99,235,0.6),20px_0_20px_rgba(128,0,128,0.5),30px_0_25px_rgba(37,99,235,0.4)] w-full z-50">
      <div className="flex h-16 items-center justify-between w-full px-6">
        {/* Logo or Title */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 bg-clip-text text-transparent">
                Career CatalystX
              </h1>
              <p className="text-xs bg-gradient-to-r from-purple-950 via-purple-700 to-purple-950 bg-clip-text text-transparent text-center">
                Match. Collaborate. Build.
              </p>
            </div>

            {/* Desktop Navigation (Visible only on MD+) */}
            <nav className="hidden md:flex md:flex-row gap-4">
              {["Home", "Features", "Pricing", "About", "Contact Us"].map(
                (item) => (
                  <p
                    key={item}
                    className="hover:cursor-pointer font-light px-2 py-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 bg-clip-text text-transparent"
                    onClick={() => router.push(item === "Home" ? "/" : `/${item.toLowerCase()}`)}
                  >
                    {item}
                  </p>
                )
              )}
            </nav>
          </div>
          <div className="hidden md:flex">
            <Button variant="ghost" className="bg-gradient-to-r from-blue-950 via-blue-700 to-blue-950 bg-clip-text text-transparent hover:text-transparent" onClick={() => {router.push("/login")}}>Log in</Button>
            <Button variant="default" className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-blue-700 hover:to-blue-500" onClick={() => {router.push("/signup")}}>Sign up</Button>
          </div>
        </div>

        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full transition-all duration-200 w-4 h-16 flex items-center justify-center"
              aria-label="Open Menu"
            >
              <Menu className="text-blue-700" style={{ width: "24px", height: "24px" }} />
            </Button>

            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] shadow-md bg-white">
              <SheetHeader>
                <SheetTitle className="text-blue-700">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4 items-center">
                {["Home", "Features", "Pricing", "About", "Contact Us"].map(
                  (item) => (
                    <p
                      key={item}
                      className="hover:underline hover:cursor-pointer font-light px-2 py-1 text-black"
                      onClick={() => router.push(item === "Home" ? "/" : `/${item.toLowerCase()}`)}
                    >
                      {item}
                    </p>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
