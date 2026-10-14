import { Bell, Alert } from "@/components/ui/Icons"
import { ModuleHeader } from "@/components/layout/ModuleHeader"
import {
  NotificationItem,
  NotificationData,
} from "@/components/dashboard/NotificationItem"

export const instant = false

export default async function NotificationsPage() {
  const dummyNotifs: NotificationData[] = [
    {
      title: "Ticket #1041 Resolved",
      desc: "Your grievance has been resolved by the admin.",
      time: "1h ago",
      read: false,
      icon: <Alert className="w-5 h-5" />,
      color: "bg-[#e4f9ee] text-[#10b981]",
    },
    {
      title: "New Event: Tech Club Meetup",
      desc: "Join us for the weekly tech club meetup at 2 PM.",
      time: "5h ago",
      read: false,
      icon: <Bell className="w-5 h-5" />,
      color: "bg-[#e8f1ff] text-[#3b82f6]",
    },
    {
      title: "Library Book Due",
      desc: 'Your book "Introduction to Algorithms" is due tomorrow.',
      time: "1d ago",
      read: true,
      icon: <Alert className="w-5 h-5" />,
      color: "bg-[#ffecee] text-[#ef4444]",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Notifications"
        description="Stay updated with your campus alerts and announcements."
        actionButtonText="Mark all as read"
      />

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div className="flex flex-col gap-[14px]">
          {dummyNotifs.map((notif, i) => (
            <NotificationItem key={i} notification={notif} />
          ))}
        </div>
      </div>
    </div>
  )
}
