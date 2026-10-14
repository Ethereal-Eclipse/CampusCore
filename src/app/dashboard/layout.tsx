import Link from "next/link"
import {
  Grid,
  Ticket,
  Book,
  Cart,
  Cal,
  Search,
  Bell,
  User,
  Set,
  Out,
  Shield,
} from "@/components/ui/Icons"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { LogoutButton } from "@/components/layout/LogoutButton"
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
        <nav className="p-[20px_16px] grid gap-[4px]">
          <Link
            href="/dashboard"
            className="p-[10px_14px] rounded-[10px] text-[15px] font-medium flex items-center gap-[12px] bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-navy2)] text-white"
          >
            <Grid className="w-[18px] h-[18px]" /> Dashboard
          </Link>
          <Link
            href="/dashboard/tickets"
            className="p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors"
          >
            <Ticket className="w-[18px] h-[18px]" /> Tickets
          </Link>
          <Link
            href="/dashboard/vault"
            className="p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors"
          >
            <Book className="w-[18px] h-[18px]" /> Academic Vault
          </Link>
          <Link
            href="/dashboard/marketplace"
            className="p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors"
          >
            <Cart className="w-[18px] h-[18px]" /> Marketplace
          </Link>
          <Link
            href="/dashboard/calendar"
            className="p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors"
          >
            <Cal className="w-[18px] h-[18px]" /> Calendar
          </Link>
          <Link
            href="/dashboard/lost-found"
            className="p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors"
          >
            <Search className="w-[18px] h-[18px]" /> Lost &amp; Found
          </Link>
          <Link
            href="/dashboard/notifications"
            className="p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" /> Notifications
            <span className="ml-auto bg-[#ef4444] text-white rounded-full min-w-[22px] text-center text-[11px] py-[2px]">
              3
            </span>
          </Link>

          <small className="p-[14px_14px_6px] text-[var(--color-mut)] text-[12px] tracking-[0.5px] font-semibold">
            MANAGEMENT
          </small>
          <Link
            href="/dashboard/admin"
            className="p-[10px_14px] rounded-[10px] text-[#7c3aed] text-[15px] font-semibold flex items-center gap-[12px] hover:bg-[#7c3aed]/10 transition-colors"
          >
            <Shield className="w-[18px] h-[18px]" /> Admin Console
            <span className="ml-auto bg-[#7c3aed] text-white rounded-full px-[8px] text-center text-[10px] py-[2px]">
              {session.user?.role === "admin" ? "ADMIN" : "PREVIEW"}
            </span>
          </Link>

          <small className="p-[14px_14px_6px] text-[var(--color-mut)] text-[12px] tracking-[0.5px] font-semibold">
            ACCOUNT
          </small>
          <Link
            href="/dashboard/profile"
            className="p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors"
          >
            <User className="w-[18px] h-[18px]" /> Profile
          </Link>
          <Link
            href="/dashboard/settings"
            className="p-[10px_14px] rounded-[10px] text-[var(--color-mut)] text-[15px] font-medium flex items-center gap-[12px] hover:bg-[var(--color-bu)] transition-colors"
          >
            <Set className="w-[18px] h-[18px]" /> Settings
          </Link>
          <LogoutButton />
        </nav>
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
          <button
            className="w-[38px] h-[38px] rounded-full grid place-items-center relative border border-[var(--color-line)] bg-[var(--color-card-ref)] text-[var(--color-ink)] after:content-[''] after:absolute after:top-[8px] after:right-[9px] after:w-[7px] after:h-[7px] after:rounded-full after:bg-[#ef4444]"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <div className="hidden md:flex gap-[10px] items-center pl-[16px] border-l border-[var(--color-line)]">
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
          </div>
        </div>
        <div className="max-w-[1180px] mx-auto p-[20px_16px] md:p-[32px_32px_48px] grid gap-[26px]">
          {children}
        </div>
      </main>
    </div>
  )
}
