import { Ticket } from "@/components/ui/Icons"

export const instant = false

export default async function TicketsPage() {
  const dummyTickets = [
    {
      id: "#1042",
      title: "Wi-Fi Issue in Library",
      status: "In Progress",
      statusColor: "bg-[#e8f1ff] text-[#3b82f6]",
      date: "2h ago",
    },
    {
      id: "#1041",
      title: "Broken Projector in Room 402",
      status: "Resolved",
      statusColor: "bg-[#e4f9ee] text-[#10b981]",
      date: "1d ago",
    },
    {
      id: "#1040",
      title: "Water Cooler not working",
      status: "Pending",
      statusColor: "bg-[#fff6dc] text-[#f59e0b]",
      date: "2d ago",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex justify-between items-center bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div>
          <h2 className="text-[24px] font-bold text-[var(--color-navy)] mb-[4px]">
            Grievance Desk
          </h2>
          <p className="text-[var(--color-mut)] text-[14px]">
            Report issues and track their resolution.
          </p>
        </div>
        <button className="px-[20px] py-[10px] rounded-full bg-[var(--color-navy)] text-white font-semibold text-[14px] transition-all hover:-translate-y-[1px] shadow-sm">
          + Raise Issue
        </button>
      </div>

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div className="flex flex-col gap-[16px]">
          {dummyTickets.map((ticket, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-[16px] rounded-[14px] border border-[var(--color-line)] bg-[var(--color-bg)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-card-ref)_60%,var(--color-bg))]"
            >
              <div className="flex gap-[16px] items-center">
                <div className="w-[44px] h-[44px] rounded-[10px] bg-[var(--color-card-ref)] border border-[var(--color-line)] grid place-items-center text-[var(--color-mut)]">
                  <Ticket className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--color-ink)]">
                    {ticket.title}
                  </h4>
                  <p className="text-[var(--color-mut)] text-[13px]">
                    Ticket {ticket.id} • Opened {ticket.date}
                  </p>
                </div>
              </div>
              <div
                className={`px-[12px] py-[6px] rounded-full text-[12px] font-medium ${ticket.statusColor}`}
              >
                {ticket.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
