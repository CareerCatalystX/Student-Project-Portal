"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, User, FileText, LogOut, Plus, SquarePlus } from 'lucide-react'
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
        router.push("/");
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
        <div className="mr-4 flex items-center">
          <Link href={"/"}>
            <div className="flex items-center">
              <Image src="/logo-master.png" alt="Logo" width={196} height={64} />
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-teal-100"
                >
                  <User className="text-teal-700" size={40} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { router.push("/update") }} className="bg-teal-50 text-teal-600 hover:!bg-teal-100 hover:!text-teal-600">
                  <SquarePlus className="mr-2 h-4 w-4" />
                  <span>Update Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="bg-red-50 text-red-600 hover:!bg-red-100 hover:!text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

