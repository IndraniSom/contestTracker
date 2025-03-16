import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SimpleThemeToggle } from "@/components/simple-theme-toggle"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Contest Tracker",
  description: "Track coding contests from popular platforms",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
              <div className="container flex h-16 items-center justify-between py-4">
                <div className="flex items-center gap-2">
                  <a href="/" className="font-bold">
                    Contest Tracker
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <nav className="flex items-center gap-4">
                    <a href="/login" className="text-sm font-medium hover:underline">
                      Login
                    </a>
                    <a href="/signup" className="text-sm font-medium hover:underline">
                      Sign Up
                    </a>
                  </nav>
                  <SimpleThemeToggle />
                </div>
              </div>
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

