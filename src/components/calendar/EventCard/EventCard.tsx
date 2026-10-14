import { Cal, Pin } from "@/components/ui/Icons"

export interface EventData {
  id?: string
  title: string
  time: string
  type: string
  color?: string
  bg?: string
  textColor?: string
  location?: string
}

interface EventCardProps {
  event: EventData
}

export function EventCard({ event }: EventCardProps) {
  const typeColors: Record<
    string,
    { border: string; bg: string; text: string }
  > = {
    Academic: { border: "#3b82f6", bg: "#e8f1ff", text: "text-[#3b82f6]" },
    Extracurricular: {
      border: "#a855f7",
      bg: "#f5ebff",
      text: "text-[#a855f7]",
    },
    Deadline: { border: "#ef4444", bg: "#ffecee", text: "text-[#ef4444]" },
    Exam: { border: "#f59e0b", bg: "#fff6dc", text: "text-[#f59e0b]" },
  }

  const theme = typeColors[event.type] || {
    border: event.color || "#3b82f6",
    bg: event.bg || "#e8f1ff",
    text: event.textColor || "text-[#3b82f6]",
  }

  return (
    <article
      className="relative p-[16px] rounded-[14px] border border-[var(--color-line)] border-l-[4px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px] overflow-hidden transition-all duration-200 hover:shadow-[0_4px_16px_rgba(30,58,138,0.06)] hover:-translate-y-[1px] hover:border-y-[var(--color-navy)]/30 hover:border-r-[var(--color-navy)]/30 cursor-pointer group"
      style={{ borderLeftColor: theme.border }}
    >
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05] pointer-events-none transition-opacity group-hover:opacity-[0.22]"
        style={{ backgroundColor: theme.bg }}
      />

      <div className="relative z-10">
        <h4 className="font-semibold text-[15px] text-[var(--color-ink)] mb-[3px]">
          {event.title}
        </h4>
        <div className="flex flex-wrap items-center gap-[10px] text-[13px] text-[var(--color-mut)]">
          <span className="flex items-center gap-[5px]">
            <Cal className="w-[14px] h-[14px]" />
            {event.time}
          </span>
          {event.location && (
            <span className="flex items-center gap-[4px]">
              • <Pin className="w-[13px] h-[13px]" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      <span
        className={`relative z-10 px-[12px] py-[4px] rounded-full text-[12px] font-semibold bg-[var(--color-card-ref)] border border-[var(--color-line)] ${theme.text} self-end sm:self-auto shrink-0 shadow-xs`}
      >
        {event.type}
      </span>
    </article>
  )
}
