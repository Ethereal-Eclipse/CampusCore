type TicketListener = (ticket: any) => void

const listeners = new Set<TicketListener>()

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
