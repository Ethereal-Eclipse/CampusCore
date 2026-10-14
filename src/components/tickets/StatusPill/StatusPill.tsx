import { TicketStatus, statusConfig } from "../types"

interface StatusPillProps {
  status: TicketStatus
  className?: string
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <span
      className={`inline-flex items-center justify-center px-[10px] py-[3px] rounded-full text-[12px] font-medium tracking-tight ${config.pillClass} ${className}`}
    >
      {config.label}
    </span>
  )
}
