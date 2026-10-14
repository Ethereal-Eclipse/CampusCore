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

      {ticket.location && (
        <>
          <span className="text-[var(--color-mut)]">Location</span>
          <span className="text-[var(--color-ink)] font-medium">
            {ticket.location}
          </span>
        </>
      )}

      {ticket.priority && (
        <>
          <span className="text-[var(--color-mut)]">Priority</span>
          <span className="capitalize font-semibold text-[12px]">
            <span
              className={`px-[8px] py-[2px] rounded-full inline-block ${
                ticket.priority === "critical" || ticket.priority === "high"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : ticket.priority === "medium"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {ticket.priority}
            </span>
          </span>
        </>
      )}

      {ticket.contactPhone && (
        <>
          <span className="text-[var(--color-mut)]">Contact</span>
          <span className="text-[var(--color-ink)] font-medium">
            {ticket.contactPhone}
          </span>
        </>
      )}

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
