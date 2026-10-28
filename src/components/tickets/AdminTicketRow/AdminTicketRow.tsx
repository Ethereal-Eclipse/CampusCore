"use client"

import { Ticket, statusConfig } from "../types"
import { StatusChip } from "../StatusChip"
import { StatusPill } from "../StatusPill"
import { ProgressBar4 } from "../ProgressBar4"
import { isTicketEscalated, getTicketSlaInfo } from "../sla"

interface AdminTicketRowProps {
  ticket: Ticket
  isSelected?: boolean
  onClick: () => void
}

export function AdminTicketRow({
  ticket,
  isSelected = false,
  onClick,
}: AdminTicketRowProps) {
  const config = statusConfig[ticket.status] || statusConfig.pending
  const slaInfo = getTicketSlaInfo(ticket)
  const isEscalated = slaInfo.isEscalated
  const isOverdue = slaInfo.isOverdue

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className={`relative flex flex-col md:flex-row md:items-center justify-between gap-[16px] p-[16px_20px] rounded-[14px] border border-l-[4px] transition-all duration-150 cursor-pointer active:scale-[0.995] ${
        isEscalated ? "border-l-red-500" : config.edgeClass
      } ${
        isSelected
          ? "bg-[color-mix(in_srgb,var(--color-card-ref)_80%,var(--color-bg))] border-[var(--color-navy)]/40 shadow-xs"
          : isEscalated
            ? "bg-red-500/10 dark:bg-red-950/25 border-red-500/25 dark:border-red-500/30 hover:bg-red-500/15 dark:hover:bg-red-950/35"
            : "bg-[var(--color-bg)] border-[var(--color-line)] hover:bg-[color-mix(in_srgb,var(--color-card-ref)_60%,var(--color-bg))] hover:border-[var(--color-navy)]/30"
      }`}
    >
      {/* Issue Column */}
      <div className="flex items-start gap-[14px] flex-1 min-w-0">
        <StatusChip
          status={isEscalated ? "escalated" : ticket.status}
          icon={isEscalated ? "alert" : ticket.icon}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[8px] flex-wrap">
            <h4 className="font-semibold text-[15px] text-[var(--color-ink)] leading-snug truncate">
              {ticket.title}
            </h4>
            <span className="text-[13px] text-[var(--color-mut)] font-normal">
              {ticket.id}
            </span>
          </div>

          <p className="text-[13px] text-[var(--color-mut)] mt-[2px] truncate">
            {ticket.raisedBy.name} · {ticket.department}
          </p>

          <div className="mt-[8px]">
            <ProgressBar4
              status={isEscalated ? "escalated" : ticket.status}
              hasAssignee={Boolean(ticket.assignedTo)}
            />
          </div>
        </div>
      </div>

      {/* Middle & Right columns: Assigned To, Time/SLA, Status */}
      <div className="flex items-center justify-between md:justify-end gap-[24px] shrink-0 pt-[8px] md:pt-0 border-t md:border-t-0 border-[var(--color-line)]">
        {/* Assigned to */}
        <div className="w-[130px] flex items-center gap-[8px]">
          {ticket.assignedTo ? (
            <>
              <span className="w-[24px] h-[24px] rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {ticket.assignedTo.initials}
              </span>
              <span className="text-[13px] font-medium text-[var(--color-ink)] truncate">
                {ticket.assignedTo.name}
              </span>
            </>
          ) : (
            <span className="text-[13px] font-medium text-amber-600 dark:text-amber-400">
              Unassigned
            </span>
          )}
        </div>

        {/* Time / SLA */}
        <div className="w-[85px] text-right md:text-left">
          <span
            className={`text-[13px] font-medium block truncate ${
              isOverdue
                ? "text-red-600 dark:text-red-400 font-bold"
                : slaInfo.isResolved
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-[var(--color-mut)]"
            }`}
            title={slaInfo.timeLabel}
          >
            {isOverdue
              ? `${ticket.ageHours}h (+${slaInfo.overdueHours}h)`
              : ticket.age}
          </span>
        </div>

        {/* Status Pill */}
        <div className="w-[95px] flex justify-end">
          <StatusPill status={isEscalated ? "escalated" : ticket.status} />
        </div>
      </div>
    </article>
  )
}
