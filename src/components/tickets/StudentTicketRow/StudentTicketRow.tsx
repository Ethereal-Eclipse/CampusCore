"use client"

import { Ticket } from "../types"
import { StatusChip } from "../StatusChip"
import { StatusPill } from "../StatusPill"
import { ChevronRight } from "@/components/ui/Icons"

interface StudentTicketRowProps {
  ticket: Ticket
  onClick: () => void
}

export function StudentTicketRow({ ticket, onClick }: StudentTicketRowProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className="flex items-center justify-between gap-[16px] p-[16px_20px] rounded-[14px] bg-[var(--color-bg)] border border-[var(--color-line)] hover:border-[var(--color-navy)]/30 hover:bg-[color-mix(in_srgb,var(--color-card-ref)_60%,var(--color-bg))] transition-all duration-150 cursor-pointer active:scale-[0.995] group"
    >
      <div className="flex items-center gap-[14px] min-w-0">
        <StatusChip status={ticket.status} icon={ticket.icon} />

        <div className="min-w-0">
          <div className="flex items-center gap-[8px] flex-wrap">
            <h4 className="font-semibold text-[15px] text-[var(--color-ink)] leading-snug truncate">
              {ticket.title}
            </h4>
            <span className="text-[13px] text-[var(--color-mut)] font-normal">
              {ticket.id}
            </span>
          </div>

          <p className="text-[13px] text-[var(--color-mut)] mt-[2px] truncate">
            {ticket.category} · Opened {ticket.openedAt || `${ticket.age} ago`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[14px] shrink-0">
        <StatusPill status={ticket.status} />
        <ChevronRight className="w-[18px] h-[18px] text-[var(--color-mut)] group-hover:text-[var(--color-ink)] transition-colors" />
      </div>
    </div>
  )
}
