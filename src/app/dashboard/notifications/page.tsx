"use client"

import { useRouter } from "next/navigation"
import { Bell, Alert, Ticket, Volume2 } from "@/components/ui/Icons"
import { ModuleHeader } from "@/components/layout/ModuleHeader"
import { NotificationItem } from "@/components/dashboard/NotificationItem"
import { useNotifications } from "@/components/providers/NotificationProvider"

export default function NotificationsPage() {
  const router = useRouter()
  const { notifications, unreadCount, markAllAsRead, markAsRead, triggerPing } =
    useNotifications()

  const handleNotificationClick = (id: string, ticketId?: string) => {
    markAsRead(id)
    if (ticketId) {
      router.push(`/dashboard/tickets?ticket=${ticketId.replace("#", "")}`)
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Notifications & Alerts"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}. Grievance updates and critical campus notices.`
            : "Stay updated with your campus alerts, grievances, and announcements."
        }
        actionButtonText={unreadCount > 0 ? "Mark all as read" : undefined}
        onAction={markAllAsRead}
      >
        <button
          type="button"
          onClick={triggerPing}
          className="flex items-center gap-[6px] px-[16px] py-[10px] rounded-full border border-[var(--color-line)] bg-[var(--color-bg)] hover:bg-[var(--color-card-ref)] text-[var(--color-ink)] font-semibold text-[13px] transition-all cursor-pointer hover:border-blue-500/50 shadow-xs active:scale-95"
          title="Play real-time campus chime ping audio"
        >
          <Volume2 className="w-[16px] h-[16px] text-blue-500" />
          <span>Test Audio Ping</span>
        </button>
      </ModuleHeader>

      <section
        aria-label="Notifications list"
        className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]"
      >
        {notifications.length > 0 ? (
          <div className="flex flex-col gap-[14px]">
            {notifications.map((notif) => {
              const isTicket = notif.type === "ticket" || !!notif.ticketId
              const icon = isTicket ? (
                <Ticket className="w-5 h-5" />
              ) : notif.title.toLowerCase().includes("urgent") ||
                notif.title.toLowerCase().includes("escalated") ? (
                <Alert className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )

              const color = notif.title.toLowerCase().includes("escalated")
                ? "bg-[#ffecee] text-[#ef4444]"
                : notif.title.toLowerCase().includes("resolved")
                  ? "bg-[#e4f9ee] text-[#10b981]"
                  : "bg-[#e8f1ff] text-[#3b82f6]"

              return (
                <NotificationItem
                  key={notif.id}
                  notification={{
                    id: notif.id,
                    title: notif.title,
                    desc: notif.desc,
                    time: notif.time,
                    read: notif.read,
                    icon,
                    color,
                  }}
                  onClick={() =>
                    handleNotificationClick(notif.id, notif.ticketId)
                  }
                />
              )
            })}
          </div>
        ) : (
          <div className="p-[48px_16px] text-center flex flex-col items-center justify-center gap-[10px]">
            <div className="w-[48px] h-[48px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] grid place-items-center text-[var(--color-mut)]">
              <Bell className="w-[20px] h-[20px]" />
            </div>
            <p className="font-semibold text-[15px] text-[var(--color-ink)]">
              No notifications yet
            </p>
            <p className="text-[13px] text-[var(--color-mut)] max-w-[360px]">
              When new student grievances are filed or system updates are
              posted, they will appear here with instant audio chime alerts.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
