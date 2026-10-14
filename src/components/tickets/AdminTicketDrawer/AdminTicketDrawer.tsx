"use client"

import { useState, useMemo, useEffect } from "react"
import { useTickets } from "../TicketContext"
import { TicketStatus } from "../types"
import { StatusPill } from "../StatusPill"
import { TicketDetails } from "../TicketDetails"
import { TicketTimeline } from "../TicketTimeline"
import { X, AlertTriangle } from "@/components/ui/Icons"
import { isTicketEscalated } from "../sla"

export function AdminTicketDrawer() {
  const {
    selectedTicket,
    selectTicket,
    staff,
    updateTicketStatus,
    updateTicketAssignee,
    postTicketUpdate,
    markResolved,
    acknowledgeAndDispatch,
  } = useTickets()

  const [updateMessage, setUpdateMessage] = useState("")
  const [postError, setPostError] = useState("")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Escape") {
        e.preventDefault()
        e.stopPropagation()
        selectTicket(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [selectTicket])

  const sortedStaff = useMemo(() => {
    if (!selectedTicket) return staff
    return [...staff].sort((a, b) => {
      const aMatches =
        a.department.toLowerCase() === selectedTicket.department.toLowerCase()
      const bMatches =
        b.department.toLowerCase() === selectedTicket.department.toLowerCase()
      if (aMatches && !bMatches) return -1
      if (!aMatches && bMatches) return 1
      return a.name.localeCompare(b.name)
    })
  }, [staff, selectedTicket])

  if (!selectedTicket) return null

  const handleClose = () => {
    selectTicket(null)
  }

  const handlePostUpdate = () => {
    if (!updateMessage.trim()) {
      setPostError("Update message cannot be empty.")
      return
    }
    postTicketUpdate(selectedTicket.id, updateMessage.trim(), "Admin")
    setUpdateMessage("")
    setPostError("")
  }

  const handleAssigneeChange = (staffId: string) => {
    if (!staffId || staffId === "unassigned") {
      updateTicketAssignee(selectedTicket.id, null)
    } else {
      const found = staff.find((s) => s.id === staffId) || null
      updateTicketAssignee(selectedTicket.id, found)
    }
  }

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicketStatus(selectedTicket.id, newStatus)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <aside
        aria-label="Ticket details drawer"
        className="w-full max-w-[620px] h-full flex flex-col bg-[var(--color-card-ref)] border-l border-[var(--color-line)] shadow-2xl text-[var(--color-ink)] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header: Ticket #id, title, status pill, close button */}
        <header className="p-[20px_24px] border-b border-[var(--color-line)] shrink-0">
          <div className="flex items-center justify-between gap-[12px] mb-[6px]">
            <span className="text-[13px] font-medium text-[var(--color-mut)]">
              Ticket {selectedTicket.id}
            </span>

            <div className="flex items-center gap-[10px]">
              <StatusPill status={selectedTicket.status} />
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close drawer"
                className="w-[28px] h-[28px] rounded-full grid place-items-center text-[var(--color-mut)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
              >
                <X className="w-[16px] h-[16px]" />
              </button>
            </div>
          </div>

          <h3 className="text-[20px] font-bold text-[var(--color-ink)] leading-snug">
            {selectedTicket.title}
          </h3>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-[20px_24px] flex flex-col gap-[18px]">
          {/* 2. Escalation notice (when ticket is escalated or SLA breached) */}
          {isTicketEscalated(selectedTicket) && (
            <div className="p-[14px_16px] rounded-[12px] bg-red-500/10 border border-red-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] text-red-400">
              <div className="flex items-center gap-[10px]">
                <AlertTriangle className="w-[20px] h-[20px] shrink-0" />
                <div>
                  <p className="text-[13px] font-bold leading-tight">
                    Unresolved for over 48 hours
                  </p>
                  <p className="text-[12px] text-red-300/80 mt-[2px]">
                    Requires immediate administrative dispatch.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => acknowledgeAndDispatch(selectedTicket.id)}
                className="px-[14px] py-[6px] rounded-full bg-red-500 hover:bg-red-400 text-black text-[12px] font-bold transition-colors cursor-pointer shrink-0 active:scale-95 shadow-sm"
              >
                Acknowledge and dispatch
              </button>
            </div>
          )}

          {/* 3. Description paragraph */}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--color-mut)] uppercase tracking-wider mb-[4px]">
              Issue Description
            </h4>
            <p className="text-[14px] text-[var(--color-ink)]/90 leading-relaxed">
              {selectedTicket.description}
            </p>
          </div>

          <div className="border-b border-[var(--color-line)]" />

          {/* 4. Details block (shared): Department, Category, Opened, Age (red past 48h) */}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--color-mut)] uppercase tracking-wider mb-[2px]">
              Ticket Details
            </h4>
            <TicketDetails
              ticket={selectedTicket}
              showAssignee={false}
              showAge={true}
              showExpectedReply={false}
            />
          </div>

          <div className="border-b border-[var(--color-line)]" />

          {/* 5. Raised by: avatar initials, name, email */}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--color-mut)] uppercase tracking-wider mb-[8px]">
              Raised By
            </h4>
            <div className="flex items-center gap-[12px] p-[10px_14px] rounded-[12px] bg-[var(--color-bg)] border border-[var(--color-line)]">
              <span className="w-[36px] h-[36px] rounded-full bg-[var(--color-navy)] text-white font-bold text-[14px] flex items-center justify-center shrink-0">
                {selectedTicket.raisedBy.initials}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[var(--color-ink)] truncate leading-tight">
                  {selectedTicket.raisedBy.name}
                </p>
                <p className="text-[12px] text-[var(--color-mut)] truncate">
                  {selectedTicket.raisedBy.email}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-[var(--color-line)]" />

          {/* 6. Manage section: Assigned to & Status */}
          <div className="flex flex-col gap-[12px]">
            <h4 className="text-[12px] font-semibold text-[var(--color-mut)] uppercase tracking-wider">
              Management &amp; Triage
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
              {/* Assigned to Select */}
              <div>
                <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
                  Assigned to
                </label>
                <select
                  value={selectedTicket.assignedTo?.id || "unassigned"}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className={`w-full px-[12px] py-[8px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] outline-none focus:border-[var(--color-navy)] transition-colors ${
                    !selectedTicket.assignedTo
                      ? "text-amber-400 font-semibold"
                      : "text-[var(--color-ink)] font-medium"
                  }`}
                >
                  <option value="unassigned" className="text-amber-400">
                    Unassigned
                  </option>
                  {sortedStaff.map((staffMember) => (
                    <option
                      key={staffMember.id}
                      value={staffMember.id}
                      className="text-[var(--color-ink)]"
                    >
                      {staffMember.name} ({staffMember.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
                  Status
                </label>
                <select
                  value={
                    selectedTicket.status === "escalated"
                      ? "in_progress"
                      : selectedTicket.status
                  }
                  onChange={(e) =>
                    handleStatusChange(e.target.value as TicketStatus)
                  }
                  className="w-full px-[12px] py-[8px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] font-medium outline-none focus:border-[var(--color-navy)] transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-b border-[var(--color-line)]" />

          {/* 7. Timeline (shared): Submitted, Assigned, In progress, Resolved */}
          <TicketTimeline ticket={selectedTicket} />
        </div>

        {/* 8. Sticky Footer: Textarea + Post update button + Mark resolved button */}
        <div className="sticky bottom-0 bg-[var(--color-card-ref)] border-t border-[var(--color-line)] p-[16px_24px] flex flex-col gap-[10px] shadow-lg shrink-0">
          <textarea
            rows={2}
            placeholder="Post an update for the student"
            value={updateMessage}
            onChange={(e) => {
              setUpdateMessage(e.target.value)
              if (postError) setPostError("")
            }}
            className="w-full px-[12px] py-[8px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-mut)] outline-none focus:border-[var(--color-navy)] transition-colors resize-none"
          />

          {postError && (
            <p className="text-[12px] text-red-400 font-medium">{postError}</p>
          )}

          <div className="flex items-center justify-between gap-[10px]">
            <button
              type="button"
              onClick={handlePostUpdate}
              className="px-[16px] py-[8px] rounded-[10px] bg-[var(--color-navy)] hover:opacity-90 text-white text-[13px] font-semibold transition-opacity cursor-pointer active:scale-95 shadow-sm"
            >
              Post update
            </button>

            <button
              type="button"
              onClick={() => markResolved(selectedTicket.id)}
              className="px-[16px] py-[8px] rounded-[10px] border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 text-[13px] font-semibold transition-colors cursor-pointer active:scale-95"
            >
              Mark resolved
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
