// components/Header.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <header className="border-b border-blue-100 bg-white shadow-sm shadow-blue-200 w-full">
      <div className="flex h-16 items-center justify-between w-full px-6">
        {/* Logo or Title */}
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-blue-700">
              Project Display
            </h1>
            <p className="text-xs text-muted-foreground text-blue-500">
              IIT Jammu Project Portal
            </p>
          </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Button
            variant="outline"
            onClick={() => router.push("/student/dashboard")}
            className="hover:bg-gray-100 hover:text-gray-900"
          >
            Student Dashboard
          </Button>
          <Button
            onClick={() => router.push("/professor/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Professor Dashboard
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full  hover:bg-blue-100 active:bg-blue-300 transition-all duration-200"
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6 text-blue-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-50">
              
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold text-gray-800">
                  Dashboard
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 pt-6">
                <Button
                  variant="outline"
                  className="w-full hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => router.push("/student/dashboard")}
                >
                  Student Dashboard
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => router.push("/professor/dashboard")}
                >
                  Professor Dashboard
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
