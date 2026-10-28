import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { TicketProvider } from "@/components/tickets/TicketContext"
import { TicketsViewManager } from "@/components/tickets/TicketsViewManager"

export const instant = false

export default async function TicketsPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin"

  return (
    <Suspense
      fallback={
        <div className="p-[32px] rounded-[18px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-center text-[var(--color-mut)]">
          Loading grievance desk...
        </div>
      }
    >
      <TicketProvider>
        <TicketsViewManager initialIsAdmin={isAdmin} />
      </TicketProvider>
    </Suspense>
  )
}
