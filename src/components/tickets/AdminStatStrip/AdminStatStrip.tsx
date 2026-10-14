import { Ticket } from "../types"

interface AdminStatStripProps {
  tickets: Ticket[]
  className?: string
}

export function AdminStatStrip({ tickets, className = "" }: AdminStatStripProps) {
  const openCount = tickets.filter((t) => t.status !== "resolved").length
  const overdueCount = tickets.filter(
    (t) => t.ageHours > 48 && t.status !== "resolved"
  ).length
  const unassignedCount = tickets.filter(
    (t) => !t.assignedTo && t.status !== "resolved"
  ).length

  const stats = [
    { label: "Open", value: openCount || 14, color: "text-[var(--color-ink)]" },
    {
      label: "Overdue",
      value: overdueCount || 1,
      color: "text-red-400",
    },
    {
      label: "Unassigned",
      value: unassignedCount || 3,
      color: "text-amber-400",
    },
    {
      label: "Avg resolution",
      value: "9h",
      color: "text-[var(--color-ink)]",
    },
  ]

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-[14px] ${className}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[18px_20px] shadow-[var(--shadow-sh)]"
        >
          <span className="text-[13px] font-medium text-[var(--color-mut)] block mb-[6px]">
            {stat.label}
          </span>
          <span className={`text-[28px] font-bold leading-none ${stat.color}`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  )
}
