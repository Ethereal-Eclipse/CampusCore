"use client"

import { useState, useEffect } from "react"
import { useTickets } from "../TicketContext"
import { StatusPill } from "../StatusPill"
import { TicketDetails } from "../TicketDetails"
import { TicketTimeline } from "../TicketTimeline"
import { X } from "@/components/ui/Icons"

export function StudentTicketDialog() {
  const { selectedTicket, selectTicket, postTicketUpdate } = useTickets()
  const [comment, setComment] = useState("")

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

  if (!selectedTicket) return null

  const handleClose = () => {
    selectTicket(null)
  }

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    postTicketUpdate(selectedTicket.id, comment.trim(), "Student")
    setComment("")
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <article
        className="w-full max-w-[470px] max-h-[90vh] overflow-y-auto bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[28px] shadow-2xl text-[var(--color-ink)] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <header className="flex items-center justify-between gap-[12px] mb-[6px]">
          <span className="text-[13px] font-medium text-[var(--color-mut)]">
            Ticket {selectedTicket.id}
          </span>

          <div className="flex items-center gap-[10px]">
            <StatusPill status={selectedTicket.status} />
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close dialog"
              className="w-[28px] h-[28px] rounded-full grid place-items-center text-[var(--color-mut)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
            >
              <X className="w-[16px] h-[16px]" />
            </button>
          </div>
        </header>

        {/* Large Title */}
        <h3 className="text-[20px] font-bold text-[var(--color-ink)] mb-[10px] leading-snug">
          {selectedTicket.title}
        </h3>

        {/* Description Paragraph */}
        <p className="text-[14px] text-[var(--color-mut)] leading-relaxed mb-[16px]">
          {selectedTicket.description}
        </p>

        <div className="border-b border-[var(--color-line)] my-[8px]" />

        {/* Key-Value Block */}
        <TicketDetails
          ticket={selectedTicket}
          showAssignee={true}
          showExpectedReply={true}
        />

        <div className="border-b border-[var(--color-line)] my-[8px]" />

        {/* Vertical Timeline */}
        <TicketTimeline ticket={selectedTicket} />

        {/* Bottom Comment Input */}
        <form
          onSubmit={handleSendComment}
          className="flex items-center gap-[10px] pt-[14px] mt-[10px] border-t border-[var(--color-line)]"
        >
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Add a comment for the ${selectedTicket.department}`}
            className="flex-1 px-[14px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-mut)] outline-none focus:border-[var(--color-navy)] transition-colors"
          />
          <button
            type="submit"
            className="px-[18px] py-[10px] rounded-[10px] bg-[var(--color-card-ref)] border border-[var(--color-line)] hover:border-[var(--color-navy)] text-[13px] font-semibold text-[var(--color-ink)] transition-colors cursor-pointer shrink-0 active:scale-95"
          >
            Send
          </button>
        </form>
      </article>
    </div>
  )
}
