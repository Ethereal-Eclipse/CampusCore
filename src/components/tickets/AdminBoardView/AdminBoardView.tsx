"use client"

import { useState } from "react"
import { useTickets } from "../TicketContext"
import { Ticket } from "../types"
import { isTicketEscalated, getTicketSlaInfo } from "../sla"
import { AlertTriangle, Clock, Check } from "@/components/ui/Icons"

export function AdminBoardView() {
  const { tickets, selectedTicketId, selectTicket, markResolved, acknowledgeAndDispatch } =
    useTickets()

  const [filterMode, setFilterMode] = useState<"all" | "escalated">("all")

  // Use SLA math to compute dynamic escalation (unresolved and > 48h or flagged)
  const escalatedTickets = tickets.filter(isTicketEscalated)
  const primaryEscalated = escalatedTickets[0]

  const displayedTickets = filterMode === "escalated" ? escalatedTickets : tickets

  const pendingTickets = displayedTickets.filter(
    (t) => t.status === "pending" || t.status === "escalated"
  )
  const inProgressTickets = displayedTickets.filter((t) => t.status === "in_progress")
  const resolvedTickets = displayedTickets.filter((t) => t.status === "resolved")

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Top Banner and Filter Pills matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[14px]">
        <h3 className="text-[20px] font-bold text-[var(--color-ink)]">
          Master issue board
        </h3>

        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-[16px] py-[6px] rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
              filterMode === "all"
                ? "bg-[var(--color-bg)] border border-[var(--color-navy)] text-[var(--color-ink)] font-semibold"
                : "border border-[var(--color-line)] text-[var(--color-mut)] hover:text-[var(--color-ink)]"
            }`}
          >
            All tickets ({tickets.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("escalated")}
            className={`px-[16px] py-[6px] rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
              filterMode === "escalated"
                ? "bg-red-500/20 border border-red-500 text-red-400 font-semibold"
                : "border border-red-500/30 text-red-400/80 hover:text-red-400 hover:border-red-500/50"
            }`}
          >
            Escalated ({escalatedTickets.length})
          </button>
        </div>
      </div>

      {/* Escalation Alert Banner */}
      {primaryEscalated && (
        <div className="p-[14px_18px] rounded-[14px] bg-red-950/40 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-[14px] text-red-300">
          <div className="flex items-start sm:items-center gap-[12px]">
            <AlertTriangle className="w-[20px] h-[20px] text-red-400 shrink-0 mt-[2px] sm:mt-0" />
            <div>
              <p className="text-[14px] font-bold text-red-200">
                Ticket {primaryEscalated.id} unresolved for over 48 hours ({primaryEscalated.ageHours}h elapsed)
              </p>
              <p className="text-[12px] text-red-300/80">
                Senior administrator has been notified. Automatic SLA escalation active.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => acknowledgeAndDispatch(primaryEscalated.id)}
            className="px-[16px] py-[8px] rounded-xl bg-[#f87171] hover:bg-[#ef4444] text-black font-semibold text-[13px] transition-colors cursor-pointer shrink-0 active:scale-95 shadow-sm"
          >
            Acknowledge and dispatch
          </button>
        </div>
      )}

      {/* 3 Columns: Pending, In progress, Resolved */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
        {/* Column 1: Pending */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between px-[4px]">
            <span className="px-[10px] py-[3px] rounded-full bg-amber-400/10 text-amber-400 text-[12px] font-semibold">
              Pending
            </span>
            <span className="text-[13px] text-[var(--color-mut)] font-medium">
              {pendingTickets.length}
            </span>
          </div>

          <div className="flex flex-col gap-[12px]">
            {pendingTickets.map((ticket) => (
              <BoardCard
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicketId === ticket.id}
                onSelect={() => selectTicket(ticket.id)}
                onResolve={() => markResolved(ticket.id)}
              />
            ))}
          </div>
        </div>

        {/* Column 2: In progress */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between px-[4px]">
            <span className="px-[10px] py-[3px] rounded-full bg-blue-400/10 text-blue-400 text-[12px] font-semibold">
              In progress
            </span>
            <span className="text-[13px] text-[var(--color-mut)] font-medium">
              {inProgressTickets.length}
            </span>
          </div>

          <div className="flex flex-col gap-[12px]">
            {inProgressTickets.map((ticket) => (
              <BoardCard
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicketId === ticket.id}
                onSelect={() => selectTicket(ticket.id)}
                onResolve={() => markResolved(ticket.id)}
              />
            ))}
          </div>
        </div>

        {/* Column 3: Resolved */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between px-[4px]">
            <span className="px-[10px] py-[3px] rounded-full bg-emerald-400/10 text-emerald-400 text-[12px] font-semibold">
              Resolved
            </span>
            <span className="text-[13px] text-[var(--color-mut)] font-medium">
              {resolvedTickets.length}
            </span>
          </div>

          <div className="flex flex-col gap-[12px]">
            {resolvedTickets.map((ticket) => (
              <BoardCard
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicketId === ticket.id}
                onSelect={() => selectTicket(ticket.id)}
                onResolve={() => markResolved(ticket.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BoardCard({
  ticket,
  isSelected,
  onSelect,
  onResolve,
}: {
  ticket: Ticket
  isSelected: boolean
  onSelect: () => void
  onResolve: () => void
}) {
  const slaInfo = getTicketSlaInfo(ticket)
  const isEscalated = slaInfo.isEscalated
  const isResolved = slaInfo.isResolved

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={`p-[16px] rounded-[16px] border transition-all duration-150 cursor-pointer active:scale-[0.99] flex flex-col justify-between gap-[14px] ${
        isEscalated
          ? "border-red-500/40 bg-red-950/20 hover:bg-red-950/30 shadow-xs"
          : isSelected
            ? "border-[var(--color-navy)] bg-[color-mix(in_srgb,var(--color-card-ref)_85%,var(--color-bg))] shadow-sm"
            : "border-[var(--color-line)] bg-[var(--color-bg)] hover:bg-[color-mix(in_srgb,var(--color-card-ref)_65%,var(--color-bg))] hover:border-[var(--color-navy)]/30"
      }`}
    >
      <div>
        {/* Top Badges if Escalated/Overdue */}
        {isEscalated && (
          <div className="flex items-center justify-between gap-[8px] mb-[10px]">
            <span className="px-[10px] py-[3px] rounded-full bg-red-500/20 text-red-400 text-[11px] font-bold inline-flex items-center gap-[4px] border border-red-500/30">
              <AlertTriangle className="w-[12px] h-[12px]" />
              {slaInfo.badgeLabel}
            </span>
            <span className="text-[12px] font-semibold text-red-400">
              {ticket.ageHours}h open
            </span>
          </div>
        )}

        {/* Title */}
        <h4 className="font-semibold text-[15px] text-[var(--color-ink)] leading-snug">
          {ticket.title}
        </h4>

        {/* Subtitle */}
        <p className="text-[13px] text-[var(--color-mut)] mt-[4px]">
          {ticket.id} · {ticket.raisedBy.name}
        </p>

        {/* Dynamic SLA / Time Status */}
        <div
          className={`flex items-center gap-[6px] text-[12px] mt-[8px] font-medium ${
            isEscalated
              ? "text-red-400"
              : isResolved
                ? "text-emerald-400"
                : "text-[var(--color-mut)]"
          }`}
        >
          {isResolved ? (
            <Check className="w-[14px] h-[14px] text-emerald-400" />
          ) : isEscalated ? (
            <AlertTriangle className="w-[13px] h-[13px] text-red-400" />
          ) : (
            <Clock className="w-[13px] h-[13px]" />
          )}
          <span>{slaInfo.timeLabel}</span>
        </div>
      </div>

      {/* Action Button: Mark resolved (only if not already resolved) */}
      {!isResolved && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onResolve()
          }}
          className="w-full py-[8px] rounded-[10px] border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 text-[13px] font-semibold transition-all cursor-pointer active:scale-95 text-center mt-[4px]"
        >
          Mark resolved
        </button>
      )}
    </div>
  )
}
