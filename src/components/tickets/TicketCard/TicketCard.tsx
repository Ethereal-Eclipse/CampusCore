"use client"

import { Ticket, AlertTriangle, CheckCircle } from "@/components/ui/Icons"

export interface TicketData {
  id: string
  title: string
  category?: string
  student?: string
  date?: string
  age?: string
  status: "Pending" | "In Progress" | "Escalated" | "Resolved" | string
  escalated?: boolean
}

interface TicketCardProps {
  ticket: TicketData
  isAdmin?: boolean
  onResolve?: (id: string) => void
  onClick?: () => void
}

export function TicketStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-[#fff6dc] text-[#f59e0b] border-[#fde68a]",
    "In Progress": "bg-[#e8f1ff] text-[#3b82f6] border-[#bfdbfe]",
    Escalated: "bg-[#f97316] text-white border-[#ea580c]",
    Resolved: "bg-[#e4f9ee] text-[#10b981] border-[#a7f3d0]",
  }

  const currentStyle =
    styles[status] || "bg-[var(--color-bg)] text-[var(--color-mut)]"

  return (
    <span
      className={`px-[12px] py-[5px] rounded-full text-[12px] font-semibold border ${currentStyle} inline-flex items-center gap-[6px]`}
    >
      {status === "Resolved" && <CheckCircle className="w-[12px] h-[12px]" />}
      {status === "Escalated" && (
        <AlertTriangle className="w-[12px] h-[12px]" />
      )}
      {status}
    </span>
  )
}

export function TicketCard({
  ticket,
  isAdmin = false,
  onResolve,
  onClick,
}: TicketCardProps) {
  return (
    <article
      onClick={onClick}
      className={`flex flex-col md:flex-row justify-between md:items-center gap-[14px] p-[16px_20px] rounded-[14px] border transition-all duration-200 cursor-pointer hover:shadow-[0_4px_16px_rgba(30,58,138,0.06)] hover:-translate-y-[1px] group ${
        ticket.escalated
          ? "border-[#f97316]/40 bg-[#f97316]/5 hover:bg-[#f97316]/10"
          : "border-[var(--color-line)] bg-[var(--color-bg)] hover:bg-[color-mix(in_srgb,var(--color-card-ref)_70%,var(--color-bg))] hover:border-[var(--color-navy)]/30"
      }`}
    >
      <div className="flex gap-[16px] items-start">
        <div
          className={`w-[44px] h-[44px] rounded-[12px] grid place-items-center shrink-0 mt-[2px] transition-transform duration-200 group-hover:scale-105 ${
            ticket.escalated
              ? "bg-[#f97316]/10 text-[#ea580c]"
              : ticket.status === "Resolved"
                ? "bg-[#10b981]/10 text-[#10b981]"
                : "bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[var(--color-navy)]"
          }`}
        >
          {ticket.escalated ? (
            <AlertTriangle className="w-[20px] h-[20px]" />
          ) : (
            <Ticket className="w-[20px] h-[20px]" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-[10px] mb-[4px]">
            <h4 className="font-semibold text-[15px] text-[var(--color-ink)]">
              {ticket.title}
            </h4>
            <span className="text-[12px] font-medium text-[var(--color-mut)]">
              {ticket.id}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-[8px] text-[13px] text-[var(--color-mut)]">
            {ticket.student && <span>Student: {ticket.student} •</span>}
            {ticket.category && <span>{ticket.category} •</span>}
            <span>Opened {ticket.date || ticket.age}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[10px] self-end md:self-auto shrink-0">
        <TicketStatusBadge status={ticket.status} />

        {isAdmin && ticket.status !== "Resolved" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onResolve?.(ticket.id)
            }}
            className="px-[14px] py-[6px] rounded-full bg-[var(--color-card-ref)] border border-[#10b981] text-[#10b981] font-semibold text-[12px] hover:bg-[#10b981] hover:text-white transition-all cursor-pointer active:scale-95"
          >
            Mark Resolved
          </button>
        )}
      </div>
    </article>
  )
}
