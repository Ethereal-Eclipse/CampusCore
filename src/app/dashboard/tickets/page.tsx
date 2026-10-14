import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { TicketProvider } from "@/components/tickets/TicketContext"
import { StudentGrievanceDesk } from "@/components/tickets/StudentGrievanceDesk"
import { AdminManagementList } from "@/components/tickets/AdminManagementList"

export const instant = false

export default async function TicketsPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin"

  return (
    <Suspense
      fallback={
        <div className="p-[32px] rounded-[18px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-center text-[var(--color-mut)]">
          Loading {isAdmin ? "administrative tickets" : "grievance desk"}...
        </div>
      }
    >
      <TicketProvider>
        {isAdmin ? <AdminManagementList /> : <StudentGrievanceDesk />}
      </TicketProvider>
    </Suspense>
  )
}
