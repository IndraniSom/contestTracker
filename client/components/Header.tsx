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
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">CodeTracker</span>
                  </div>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <div className="flex flex-col gap-6 p-4 overflow-y-auto">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                            alt={user.email}
                          />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium truncate max-w-[180px]">{user.email}</span>
                          <span className="text-xs text-muted-foreground">Logged in</span>
                        </div>
                      </div>
                      <nav className="flex flex-col space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm rounded-md hover:bg-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4 text-primary" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-sm rounded-md hover:bg-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Trophy className="h-4 w-4 text-primary" />
                          <span>My Contests</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm rounded-md hover:bg-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 text-primary" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          href="/notifications"
                          className="flex items-center gap-3 px-4 py-3 text-sm rounded-md hover:bg-accent transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Bell className="h-4 w-4 text-primary" />
                          <span>Notifications</span>
                        </Link>
                      </nav>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 py-4">
                      <h3 className="text-lg font-medium mb-2">Welcome to CodeTracker</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Sign in to track your coding contests and progress.
                      </p>
                      <Button asChild size="lg" className="w-full">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="w-full">
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
                {user && (
                  <div className="mt-auto p-4 border-t">
                    <Button
                      variant="destructive"
                      size="lg"
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
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

