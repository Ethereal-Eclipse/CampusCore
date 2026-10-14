import { Suspense } from "react"
import { TicketProvider } from "@/components/tickets/TicketContext"
import { StudentGrievanceDesk } from "@/components/tickets/StudentGrievanceDesk"

export const instant = false

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-[32px] rounded-[18px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-center text-[var(--color-mut)]">
          Loading grievance desk...
        </div>
      }
    >
      <TicketProvider>
        <StudentGrievanceDesk />
      </TicketProvider>
    </Suspense>
  )
}
