"use client"

import Link from "next/link"
import { Bell } from "@/components/ui/Icons"
import { useNotifications } from "@/components/providers/NotificationProvider"

export function NotificationBell() {
  const { unreadCount, isPinging } = useNotifications()

  return (
    <Link
      href="/dashboard/notifications"
      className="w-[38px] h-[38px] rounded-full grid place-items-center relative border border-[var(--color-line)] bg-[var(--color-card-ref)] text-[var(--color-ink)] hover:border-[var(--color-navy)] hover:shadow-xs transition-all active:scale-95 cursor-pointer"
      aria-label={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : "Notifications"
      }
      title={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : "Notifications"
      }
    >
      <Bell
        className={`w-[18px] h-[18px] transition-transform ${isPinging ? "scale-110 text-blue-500" : ""}`}
      />

      {/* Ping radar animation when new ticket arrives */}
      {isPinging && (
        <span className="absolute -top-[2px] -right-[2px] w-[14px] h-[14px] rounded-full bg-red-500 animate-ping opacity-75 pointer-events-none" />
      )}

      {/* Badge Indicator */}
      {unreadCount > 0 && (
        <span className="absolute -top-[3px] -right-[3px] min-w-[18px] h-[18px] px-[4px] rounded-full bg-[#ef4444] text-white text-[10px] font-bold grid place-items-center border-2 border-[var(--color-card-ref)] leading-none shadow-xs">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  )
}
