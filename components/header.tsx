"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const router = useRouter();

  return (
    <header className="border-b border-blue-100 bg-white shadow-sm shadow-blue-200 w-full z-50">
      <div className="flex h-16 items-center justify-between w-full px-6">
        {/* Logo or Title */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-blue-700">
            Projects Karo
          </h1>
          <p className="text-xs text-muted-foreground text-blue-500">
            Match. Collaborate. Build.
          </p>
        </div>

        {/* Desktop Navigation (Visible only on MD+) */}
        <nav className="hidden md:flex md:flex-row gap-4">
          {["Home", "Features", "Pricing", "About", "Contact Us"].map(
            (item) => (
              <p
                key={item}
                className="hover:underline hover:cursor-pointer font-light px-2 py-1"
                onClick={() => router.push(item === "Home" ? "/" : `/${item.toLowerCase()}`)}
              >
                {item}
              </p>
            )
          )}
        </nav>

        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white transition-all duration-200 w-4 h-16 flex items-center justify-center"
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
