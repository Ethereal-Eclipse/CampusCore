import { Bell, Alert } from "@/components/ui/Icons"

export const instant = false

export default async function NotificationsPage() {
  const dummyNotifs = [
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
      <div className="flex justify-between items-center bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div>
          <h2 className="text-[24px] font-bold text-[var(--color-navy)] mb-[4px]">
            Notifications
          </h2>
          <p className="text-[var(--color-mut)] text-[14px]">
            Stay updated with your campus alerts.
          </p>
        </div>
        <button className="px-[16px] py-[8px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[var(--color-mut)] font-medium text-[13px] hover:text-[var(--color-ink)] transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div className="flex flex-col gap-[16px]">
          {dummyNotifs.map((notif, i) => (
            <div
              key={i}
              className={`flex gap-[16px] p-[16px] rounded-[14px] border border-[var(--color-line)] ${notif.read ? "bg-[var(--color-bg)] opacity-70" : "bg-[color-mix(in_srgb,var(--color-card-ref)_80%,var(--color-blue-ref))]"}`}
            >
              <div
                className={`w-[40px] h-[40px] rounded-full grid place-items-center flex-shrink-0 ${notif.color}`}
              >
                {notif.icon}
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-ink)] text-[15px]">
                  {notif.title}
                </h4>
                <p className="text-[var(--color-mut)] text-[13px] mt-[2px]">
                  {notif.desc}
                </p>
                <p className="text-[var(--color-mut)] text-[11px] mt-[6px]">
                  {notif.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
