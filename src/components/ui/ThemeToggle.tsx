"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={className}
      aria-label="Toggle theme"
    >
      <Sun className="h-[18px] w-[18px] hidden dark:block" />
      <Moon className="h-[18px] w-[18px] block dark:hidden" />
    </button>
  )
}
