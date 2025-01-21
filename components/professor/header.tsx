"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, User,CircleUserRound, FileText, LogOut, Plus } from 'lucide-react'
import { ProfessorProfile } from "@/types/api-professor"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  user: ProfessorProfile | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    localStorage.removeItem("authToken")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <div>
            <Link href="/professor/dashboard" >
            <h1 className="text-xl font-semibold tracking-tight text-blue-700">
              Project Display
            </h1>
            </Link>
            <p className="text-xs text-muted-foreground text-blue-500">
              IIT Jammu Project Portal
            </p>
          </div>

          <nav className="items-center space-x-6 text-sm font-medium hidden lg:flex ml-6 text-blue-700 ">
            <Link href="/professor/applications" className="transition-colors hover:text-blue-800">
              Applications
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
        <Button className="bg-gradient-to-t from-blue-500 to-blue-600">
          <Link href="/professor/create" className="flex items-center space-x-1 text-xs sm:text-sm">
            <Plus className="sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Create Project</span>
          </Link>
        </Button>


          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-blue-100"
                >
                  <User className="text-blue-700" size={40} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
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
