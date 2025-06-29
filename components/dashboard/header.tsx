"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, User, FileText, LogOut, Plus, SquarePlus, IndianRupee } from 'lucide-react'
import { StudentProfile } from "@/types/profile"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface DashboardHeaderProps {
  user: StudentProfile | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Logout failed');
        router.push("/");
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push("/");
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center gap-4">
          <Link href={"/"}>
            <div className="flex items-center">
              <Image src="/logo-master.png" alt="Logo" width={196} height={64} />
            </div>
          </Link>
          <Link href={"/projects"}>
            <p className="hover:cursor-pointer font-light text-sm px-2 py-1 bg-gradient-to-r from-teal-900 via-teal-600 to-teal-900 bg-clip-text text-transparent">Projects</p>
          </Link>
          <Link href={"/purchase"}>
            <p className="hover:cursor-pointer font-light text-sm px-2 py-1 bg-gradient-to-r from-teal-900 via-teal-600 to-teal-900 bg-clip-text text-transparent">Plans</p>
          </Link>
          <Link href={"/subscriptions"}>
            <p className="hover:cursor-pointer font-light text-sm px-2 py-1 bg-gradient-to-r from-teal-900 via-teal-600 to-teal-900 bg-clip-text text-transparent">Subscriptions</p>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-teal-100 bg-transparent"
                >
                  <User className="text-teal-700" size={40} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none mb-1">{user.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { router.push("/update") }} className=" text-teal-600 hover:!bg-teal-100 hover:!text-teal-600 mb-2">
                  <SquarePlus className="mr-2 h-4 w-4" />
                  <span>Update Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { router.push("/purchase") }} className=" text-blue-600 hover:!bg-blue-100 hover:!text-blue-600">
                  <IndianRupee className="mr-2 h-4 w-4" />
                  <span>Buy a Plan</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:!bg-red-100 hover:!text-red-600 mt-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header >
  )
}

