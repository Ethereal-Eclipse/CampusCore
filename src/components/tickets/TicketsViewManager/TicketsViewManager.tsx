"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AdminManagementList } from "../AdminManagementList"
import { StudentGrievanceDesk } from "../StudentGrievanceDesk"
import { Shield, User } from "@/components/ui/Icons"

interface TicketsViewManagerProps {
  initialIsAdmin?: boolean
}

export function TicketsViewManager({
  initialIsAdmin = false,
}: TicketsViewManagerProps) {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const queryView = searchParams.get("view")
  const sessionRole = session?.user?.role

  // Determine effective view: query param > session role > initialIsAdmin
  const defaultToAdmin =
    queryView === "admin" ||
    (!queryView && (sessionRole === "admin" || initialIsAdmin))

  const [activeView, setActiveView] = useState<"admin" | "student">(
    defaultToAdmin ? "admin" : "student",
  )

  useEffect(() => {
    if (queryView === "admin") {
      setActiveView("admin")
    } else if (queryView === "student") {
      setActiveView("student")
    } else if (sessionRole === "admin") {
      setActiveView("admin")
    }
  }, [queryView, sessionRole])

  const handleSwitchView = (view: "admin" | "student") => {
    setActiveView(view)
    const params = new URLSearchParams(searchParams.toString())
    params.set("view", view)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Role / View switcher pill bar */}
      <div className="flex items-center justify-between gap-[12px] flex-wrap pb-[2px]">
        <div className="flex items-center gap-[6px] text-[13px] text-[var(--color-mut)] font-medium">
          <span>Viewing Mode:</span>
          <span className="font-semibold text-[var(--color-ink)]">
            {activeView === "admin" ? "Administrative Triage" : "Student Desk"}
          </span>
        </div>

        {/* View toggle */}
        <div className="flex items-center p-[3px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] font-medium shadow-xs">
          <button
            type="button"
            onClick={() => handleSwitchView("student")}
            className={`flex items-center gap-[6px] px-[14px] py-[6px] rounded-full transition-all cursor-pointer ${
              activeView === "student"
                ? "bg-[var(--color-card-ref)] text-[var(--color-ink)] shadow-xs font-semibold"
                : "text-[var(--color-mut)] hover:text-[var(--color-ink)]"
            }`}
          >
            <User className="w-[13px] h-[13px]" />
            <span>Student Desk</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchView("admin")}
            className={`flex items-center gap-[6px] px-[14px] py-[6px] rounded-full transition-all cursor-pointer ${
              activeView === "admin"
                ? "bg-[var(--color-card-ref)] text-[var(--color-ink)] shadow-xs font-semibold"
                : "text-[var(--color-mut)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Shield className="w-[13px] h-[13px] text-blue-500" />
            <span>Admin Management</span>
          </button>
        </div>
      </div>

      {/* Render selected view */}
      {activeView === "admin" ? (
        <AdminManagementList />
      ) : (
        <StudentGrievanceDesk />
      )}
    </div>
  )
}
