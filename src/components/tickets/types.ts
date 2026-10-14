export type TicketStatus = "pending" | "in_progress" | "resolved" | "escalated"

export interface TicketUpdate {
  id: string
  message: string
  timestamp: string
  type: "submitted" | "assigned" | "in_progress" | "resolved" | "note" | "escalated"
  author?: string
}

export interface StaffMember {
  id: string
  name: string
  department: string
  initials: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  category: string
  department: string
  status: TicketStatus
  raisedBy: {
    name: string
    email: string
    initials: string
  }
  assignedTo: StaffMember | null
  openedAt: string
  expectedReply?: string
  age: string
  ageHours: number
  icon?: "wifi" | "monitor" | "droplet" | "ticket" | "alert"
  updates: TicketUpdate[]
}

export interface StatusConfigEntry {
  label: string
  colorName: "amber" | "blue" | "emerald" | "red"
  pillClass: string
  chipClass: string
  barClass: string
  edgeClass: string
  iconName: "ticket" | "alert-triangle" | "clock" | "check"
  step: 1 | 2 | 3 | 4
}

export const statusConfig: Record<TicketStatus, StatusConfigEntry> = {
  pending: {
    label: "Pending",
    colorName: "amber",
    pillClass: "bg-amber-400/10 text-amber-400",
    chipClass: "bg-amber-400/10 text-amber-400",
    barClass: "bg-amber-400",
    edgeClass: "border-l-amber-400",
    iconName: "clock",
    step: 1,
  },
  in_progress: {
    label: "In progress",
    colorName: "blue",
    pillClass: "bg-blue-400/10 text-blue-400",
    chipClass: "bg-blue-400/10 text-blue-400",
    barClass: "bg-blue-400",
    edgeClass: "border-l-blue-400",
    iconName: "ticket",
    step: 3,
  },
  resolved: {
    label: "Resolved",
    colorName: "emerald",
    pillClass: "bg-emerald-400/10 text-emerald-400",
    chipClass: "bg-emerald-400/10 text-emerald-400",
    barClass: "bg-emerald-400",
    edgeClass: "border-l-emerald-400",
    iconName: "check",
    step: 4,
  },
  escalated: {
    label: "Escalated",
    colorName: "red",
    pillClass: "bg-red-400/10 text-red-400",
    chipClass: "bg-red-400/10 text-red-400",
    barClass: "bg-red-400",
    edgeClass: "border-l-red-400",
    iconName: "alert-triangle",
    step: 3,
  },
}
