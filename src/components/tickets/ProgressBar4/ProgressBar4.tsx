import { TicketStatus, statusConfig } from "../types"

interface ProgressBar4Props {
  status: TicketStatus
  hasAssignee?: boolean
  className?: string
}

export function ProgressBar4({
  status,
  hasAssignee = false,
  className = "",
}: ProgressBar4Props) {
  const config = statusConfig[status] || statusConfig.pending

  // Determine how many segments to fill (out of 4: Submitted, Assigned, In Progress, Resolved)
  let activeSegments = 1
  if (status === "resolved") {
    activeSegments = 4
  } else if (status === "in_progress" || status === "escalated") {
    activeSegments = 3
  } else if (hasAssignee) {
    activeSegments = 2
  } else {
    activeSegments = 1
  }

  return (
    <div className={`flex items-center gap-[6px] w-full max-w-[260px] ${className}`}>
      {[1, 2, 3, 4].map((segmentIndex) => {
        const isFilled = segmentIndex <= activeSegments
        return (
          <span
            key={segmentIndex}
            className={`h-[3px] flex-1 rounded-full transition-colors ${
              isFilled ? config.barClass : "bg-[var(--color-line)] opacity-40"
            }`}
          />
        )
      })}
    </div>
  )
}
