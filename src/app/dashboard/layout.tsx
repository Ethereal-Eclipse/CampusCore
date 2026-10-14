import Link from "next/link"
import {
  Grid,
  Search,
  Bell,
} from "@/components/ui/Icons"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { BfCacheGuard } from "@/components/layout/BfCacheGuard"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const instant = false

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[255px_1fr] min-h-screen text-[var(--color-ink)] bg-[var(--color-bg)]">
      <BfCacheGuard />
      <aside className="hidden md:flex flex-col bg-[var(--color-card-ref)] border-r border-[var(--color-line)] sticky top-0 h-screen">
        <Link
          href="/"
          className="flex items-center gap-[10px] font-bold text-[20px] p-[22px_24px] border-b border-[var(--color-line)]"
        >
          <i className="w-[34px] h-[34px] rounded-[10px] bg-[var(--color-navy)] text-white grid place-items-center not-italic">
            <Grid className="w-[18px] h-[18px]" />
          </i>
          CampusCore
        </Link>
        <SidebarNav userRole={session.user?.role} />
        <img
          className="m-auto mx-[16px] mb-[18px] rounded-[14px] shadow-[var(--shadow-sh)] block w-[calc(100%-32px)]"
          src="/assets/promo.png"
          alt="Better Campus. Together. Explore. Connect. Grow."
        />
      </aside>

      <main className="min-w-0">
        <div className="h-[64px] border-b border-[var(--color-line)] bg-[var(--color-card-ref)] flex items-center gap-[14px] px-[16px] md:px-[28px]">
          <label className="flex items-center gap-[10px] flex-1 max-w-[450px] p-[10px_16px] rounded-full bg-[var(--color-bg)] text-[var(--color-mut)] text-[14px]">
            <Search className="w-[18px] h-[18px]" />
            <input
              type="search"
              placeholder="Search anything... (Ctrl+K)"
              className="border-0 bg-transparent outline-none flex-1 text-[var(--color-ink)]"
            />
          </label>
          <span className="flex-1"></span>
          <ThemeToggle className="w-[38px] h-[38px] rounded-full grid place-items-center relative border border-[var(--color-line)] bg-[var(--color-card-ref)] text-[var(--color-ink)]" />
          <Link
            href="/dashboard/notifications"
            className="w-[38px] h-[38px] rounded-full grid place-items-center relative border border-[var(--color-line)] bg-[var(--color-card-ref)] text-[var(--color-ink)] hover:border-[var(--color-navy)] hover:shadow-xs transition-all active:scale-95 cursor-pointer after:content-[''] after:absolute after:top-[8px] after:right-[9px] after:w-[7px] after:h-[7px] after:rounded-full after:bg-[#ef4444]"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
          </Link>
          <Link
            href="/dashboard/profile"
            className="hidden md:flex gap-[10px] items-center pl-[16px] border-l border-[var(--color-line)] hover:opacity-85 transition-opacity cursor-pointer"
          >
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-[38px] h-[38px] rounded-full object-cover border border-[var(--color-line)]"
              />
            ) : (
              <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[var(--color-navy)] to-[#a855f7] text-white grid place-items-center font-bold">
                {session.user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <b className="text-[14px] leading-[1.3] block text-[var(--color-ink)]">
                {session.user?.name}
              </b>
              <small className="text-[var(--color-mut)] block text-[12px] leading-[1.3]">
                {session.user?.role === "admin" ? "Administrator" : "Student"}
              </small>
            </div>
          </Link>
        </div>
        <div className="max-w-[1180px] mx-auto p-[20px_16px] md:p-[32px_32px_48px] grid gap-[26px]">
          {children}
        </div>
      </main>
    </div>
  )
}
