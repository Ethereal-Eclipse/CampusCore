"use client"

import { useState } from "react"
import { useTickets } from "../TicketContext"
import { StudentTicketRow } from "../StudentTicketRow"
import { StudentTicketDialog } from "../StudentTicketDialog"
import { RaiseTicketModal } from "../RaiseTicketModal"
import { Plus } from "@/components/ui/Icons"

export function StudentGrievanceDesk() {
  const { tickets, selectTicket, isLoading } = useTickets()
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Header matching Image 3 */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[24px_28px] shadow-[var(--shadow-sh)]">
        <div>
          <h1 className="text-[24px] font-bold text-[var(--color-ink)] tracking-tight">
            Grievance desk
          </h1>
          <p className="text-[14px] text-[var(--color-mut)] mt-[4px]">
            Report issues and track their resolution in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRaiseModalOpen(true)}
          className="inline-flex items-center justify-center gap-[8px] px-[20px] py-[11px] rounded-[12px] bg-blue-600 hover:bg-blue-500 text-white text-[14px] font-semibold shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-[16px] h-[16px]" />
          Raise issue
        </button>
      </header>

      {/* Ticket Rows list matching Image 3 */}
      <section
        aria-label="Campus grievances list"
        className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[20px] shadow-[var(--shadow-sh)]"
      >
        <div className="flex flex-col gap-[12px]">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[76px] rounded-[14px] bg-[var(--color-bg)] border border-[var(--color-line)] animate-pulse"
              />
            ))
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => (
              <StudentTicketRow
                key={ticket.id}
                ticket={ticket}
                onClick={() => selectTicket(ticket.id)}
              />
            ))
          ) : (
            <div className="p-[36px] text-center text-[var(--color-mut)] text-[14px]">
              No grievance tickets found. Click &quot;Raise issue&quot; above to
              report one.
            </div>
          )}
        </div>
      </section>

      {/* Detail Pop-up (Image 2) */}
      <StudentTicketDialog />

      {/* Raise Issue Modal */}
      <RaiseTicketModal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
      />
    </div>
  )
}
