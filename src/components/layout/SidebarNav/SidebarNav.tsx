"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "@/components/ui/Icons"
import { LogoutButton } from "@/components/layout/LogoutButton"
import { useNotifications } from "@/components/providers/NotificationProvider"

interface SidebarNavProps {
  userRole?: string
}

export function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname()
  const { unreadCount, isPinging } = useNotifications()

  const mainLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Grid,
      exact: true,
    },
    {
      href: "/dashboard/tickets",
      label: "Tickets",
      icon: Ticket,
      exact: false,
    },
    {
      href: "/dashboard/vault",
      label: "Academic Vault",
      icon: Book,
      exact: false,
    },
    {
      href: "/dashboard/marketplace",
      label: "Marketplace",
      icon: Cart,
      exact: false,
    },
    {
      href: "/dashboard/calendar",
      label: "Calendar",
      icon: Cal,
      exact: false,
    },
    {
      href: "/dashboard/lost-found",
      label: "Lost & Found",
      icon: Search,
      exact: false,
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
      exact: false,
      badge: unreadCount > 0 ? String(unreadCount) : undefined,
    },
  ]

  const accountLinks = [
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: User,
      exact: false,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Set,
      exact: false,
    },
  ]

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="p-[20px_16px] grid gap-[4px]">
      {mainLinks.map((item) => {
        const Icon = item.icon
        const active = isLinkActive(item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`p-[10px_14px] rounded-[10px] text-[15px] font-medium flex items-center gap-[12px] transition-all relative ${
              active
                ? "bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-navy2)] text-white shadow-xs font-semibold"
                : "text-[var(--color-mut)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bu)]"
            }`}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className="relative ml-auto flex items-center">
                {isPinging && (
                  <span className="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75" />
                )}
                <span className="relative bg-[#ef4444] text-white rounded-full min-w-[22px] text-center text-[11px] py-[2px] px-[6px] font-bold">
                  {item.badge}
                </span>
              </span>
            )}
          </Link>
        )
      })}

      <small className="p-[14px_14px_6px] text-[var(--color-mut)] text-[12px] tracking-[0.5px] font-semibold">
        ACCOUNT
      </small>

      {accountLinks.map((item) => {
        const Icon = item.icon
        const active = isLinkActive(item.href, item.exact)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`p-[10px_14px] rounded-[10px] text-[15px] font-medium flex items-center gap-[12px] transition-all ${
              active
                ? "bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-navy2)] text-white shadow-xs font-semibold"
                : "text-[var(--color-mut)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bu)]"
            }`}
          >
            <Icon className="w-[18px] h-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}

      <LogoutButton />
    </nav>
  )
}
