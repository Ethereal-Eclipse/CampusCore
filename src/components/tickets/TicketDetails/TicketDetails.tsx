import { Ticket } from "../types"

interface TicketDetailsProps {
  ticket: Ticket
  showAssignee?: boolean
  showAge?: boolean
  showExpectedReply?: boolean
  className?: string
}

export function TicketDetails({
  ticket,
  showAssignee = true,
  showAge = false,
  showExpectedReply = true,
  className = "",
}: TicketDetailsProps) {
  const isOverdue = ticket.ageHours > 48

  return (
    <div
      className={`grid grid-cols-[130px_1fr] gap-y-[12px] text-[13px] leading-relaxed py-[14px] ${className}`}
    >
      <span className="text-[var(--color-mut)]">Department</span>
      <span className="text-[var(--color-ink)] font-medium">
        {ticket.department}
      </span>

      <span className="text-[var(--color-mut)]">Category</span>
      <span className="text-[var(--color-ink)] font-medium">
        {ticket.category}
      </span>

      {showAssignee && (
        <>
          <span className="text-[var(--color-mut)]">Assigned to</span>
          <div className="flex items-center gap-[8px]">
            {ticket.assignedTo ? (
              <>
                <span className="w-[20px] h-[20px] rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {ticket.assignedTo.initials}
                </span>
                <span className="text-[var(--color-ink)] font-medium">
                  {ticket.assignedTo.name}
                </span>
              </>
            ) : (
              <span className="text-amber-400 font-medium">
                Not assigned yet
              </span>
            )}
          </div>
        </>
      )}

      <span className="text-[var(--color-mut)]">Opened</span>
      <span className="text-[var(--color-ink)] font-medium">
        {ticket.openedAt}
      </span>

      {showExpectedReply && ticket.expectedReply && (
        <>
          <span className="text-[var(--color-mut)]">Expected reply</span>
          <span className="text-[var(--color-ink)] font-medium">
            {ticket.expectedReply}
          </span>
        </>
      )}

      {showAge && (
        <>
          <span className="text-[var(--color-mut)]">Age</span>
          <span
            className={`font-semibold ${
              isOverdue ? "text-red-400" : "text-[var(--color-ink)]"
            }`}
          >
            {ticket.age}
          </span>
        </>
      )}
    </div>
  )
}
