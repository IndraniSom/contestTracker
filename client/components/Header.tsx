"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { logout } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SimpleThemeToggle } from "@/components/simple-theme-toggle"
import { Trophy, Menu, X, LogOut, User, Settings, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const { user, setUser } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.email) return "CT"
    return user.email
      .split("@")[0]
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4 px-3 md:px-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold transition-colors hover:text-primary">
            <Trophy className="h-5 w-5" />
            <span className="inline-block">CodeTracker</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                        alt={user.email}
                      />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                     
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>My Contests</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <SimpleThemeToggle />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <SimpleThemeToggle />
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <SimpleThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    <span className="font-bold">CodeTracker</span>
                  </div>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <div className="flex flex-col gap-4 py-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2 border rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                            alt={user.email}
                          />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.email}</span>
                          
                        </div>
                      </div>
                      <nav className="flex flex-col space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Trophy className="h-4 w-4" />
                          My Contests
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <Link
                          href="/notifications"
                          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Bell className="h-4 w-4" />
                          Notifications
                        </Link>
                      </nav>
                      <div className="mt-auto pt-4">
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            handleLogout()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 px-4">
                      <Button asChild className="w-full">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

