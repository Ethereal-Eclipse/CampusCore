import { Ticket, TicketStatus } from "./types"

export const SLA_HOURS_LIMIT = 48

export function isTicketEscalated(ticket: {
  status: TicketStatus
  ageHours: number
}): boolean {
  if (ticket.status === "resolved") return false
  return ticket.status === "escalated" || ticket.ageHours > SLA_HOURS_LIMIT
}

export function getTicketSlaInfo(ticket: {
  status: TicketStatus
  ageHours: number
  age: string
}) {
  const isResolved = ticket.status === "resolved"
  const isEscalated = isTicketEscalated(ticket)
  const isOverdue = !isResolved && ticket.ageHours > SLA_HOURS_LIMIT
  const overdueHours = Math.max(0, ticket.ageHours - SLA_HOURS_LIMIT)
  const remainingHours = Math.max(0, SLA_HOURS_LIMIT - ticket.ageHours)

  let timeLabel = ""
  if (isResolved) {
    timeLabel = `Closed ${ticket.age} ago`
  } else if (isOverdue) {
    timeLabel = `${ticket.ageHours}h elapsed · ${overdueHours}h overdue`
  } else {
    timeLabel = `${ticket.ageHours}h elapsed · ${remainingHours}h remaining`
  }

  let badgeLabel = ""
  if (isResolved) {
    badgeLabel = "Resolved"
  } else if (isOverdue) {
    badgeLabel = `Overdue (+${overdueHours}h)`
  } else {
    badgeLabel = `${remainingHours}h left`
  }

  return {
    isResolved,
    isEscalated,
    isOverdue,
    overdueHours,
    remainingHours,
    timeLabel,
    badgeLabel,
  }
}
