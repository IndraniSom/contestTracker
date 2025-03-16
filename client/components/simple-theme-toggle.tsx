"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="icon" className="w-9 h-9" />
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

