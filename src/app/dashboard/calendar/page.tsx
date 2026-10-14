import { Cal } from "@/components/ui/Icons"

export const instant = false

export default async function CalendarPage() {
  const dummyEvents = [
    {
      title: "Data Structures Lab",
      time: "10:00 AM - 12:00 PM",
      type: "Academic",
      color: "#3b82f6",
      bg: "#e8f1ff",
    },
    {
      title: "Tech Club Meetup",
      time: "2:00 PM - 3:30 PM",
      type: "Extracurricular",
      color: "#a855f7",
      bg: "#f5ebff",
    },
    {
      title: "Project Submission Deadline",
      time: "11:59 PM",
      type: "Deadline",
      color: "#ef4444",
      bg: "#ffecee",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <h2 className="text-[24px] font-bold text-[var(--color-navy)] mb-[4px]">
          Campus Calendar
        </h2>
        <p className="text-[var(--color-mut)] text-[14px]">
          Keep track of classes, deadlines, and events.
        </p>
      </div>

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <h3 className="font-bold text-[18px] mb-[16px] flex items-center gap-2">
          <Cal className="w-5 h-5 text-[var(--color-mut)]" /> Today
        </h3>
        <div className="flex flex-col gap-[12px]">
          {dummyEvents.map((ev, i) => (
            <div
              key={i}
              className="relative p-[16px] rounded-[14px] border border-[var(--color-line)] border-l-[4px] flex justify-between items-center overflow-hidden"
              style={{ borderLeftColor: ev.color }}
            >
              <div
                className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05]"
                style={{ backgroundColor: ev.bg }}
              ></div>

              <div className="relative z-10">
                <h4 className="font-semibold text-[var(--color-ink)] text-[15px]">
                  {ev.title}
                </h4>
                <p className="text-[var(--color-mut)] text-[13px]">{ev.time}</p>
              </div>
              <span
                className="relative z-10 px-[12px] py-[4px] rounded-full bg-[var(--color-card-ref)] text-[12px] font-medium border border-[var(--color-line)]"
                style={{ color: ev.color }}
              >
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
