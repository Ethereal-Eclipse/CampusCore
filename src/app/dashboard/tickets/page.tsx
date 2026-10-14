import { ModuleHeader } from "@/components/layout/ModuleHeader"
import { TicketCard, TicketData } from "@/components/tickets/TicketCard"

export const instant = false

export default async function TicketsPage() {
  const dummyTickets: TicketData[] = [
    {
      id: "#1042",
      title: "Wi-Fi Issue in Library",
      category: "IT & Network",
      status: "In Progress",
      date: "2h ago",
    },
    {
      id: "#1041",
      title: "Broken Projector in Room 402",
      category: "Classroom Maintenance",
      status: "Resolved",
      date: "1d ago",
    },
    {
      id: "#1040",
      title: "Water Cooler not working",
      category: "Facilities",
      status: "Pending",
      date: "2d ago",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Grievance Desk"
        description="Report issues and track their resolution in real-time."
        actionButtonText="+ Raise Issue"
      />

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div className="flex flex-col gap-[14px]">
          {dummyTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  )
}
