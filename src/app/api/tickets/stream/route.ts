import { subscribeTickets } from "@/lib/ticketEvents"

export async function GET() {
  let unsubscribe: (() => void) | null = null

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode("event: connected\ndata: ok\n\n"))

      unsubscribe = subscribeTickets((ticket) => {
        try {
          const payload = `event: new-ticket\ndata: ${JSON.stringify(ticket)}\n\n`
          controller.enqueue(encoder.encode(payload))
        } catch {
          // Stream error or client disconnect
        }
      })
    },
    cancel() {
      if (unsubscribe) {
        unsubscribe()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
