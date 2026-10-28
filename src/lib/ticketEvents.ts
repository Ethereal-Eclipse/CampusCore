type TicketListener = (ticket: any) => void

declare global {
  var __campuscore_ticket_listeners: Set<TicketListener> | undefined
}

const listeners: Set<TicketListener> =
  globalThis.__campuscore_ticket_listeners ||
  (globalThis.__campuscore_ticket_listeners = new Set<TicketListener>())

export function subscribeTickets(listener: TicketListener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function broadcastNewTicket(ticket: any) {
  for (const listener of listeners) {
    try {
      listener(ticket)
    } catch {
      // ignore individual listener errors
    }
  }
}
