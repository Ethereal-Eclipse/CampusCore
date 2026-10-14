"use client"

import { signOut } from "next-auth/react"
import { Out } from "@/components/ui/Icons"

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full text-left p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors cursor-pointer"
    >
      <Out className="w-[18px] h-[18px]" /> Log out
    </button>
  )
}
