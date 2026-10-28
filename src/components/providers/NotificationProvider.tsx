"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react"
import { useSession } from "next-auth/react"

export interface CampusNotification {
  id: string
  title: string
  desc: string
  time: string
  read: boolean
  type?: "ticket" | "event" | "system"
  ticketId?: string
}

interface NotificationContextType {
  notifications: CampusNotification[]
  unreadCount: number
  isPinging: boolean
  addNotification: (
    notif: Omit<CampusNotification, "id" | "time" | "read">,
  ) => void
  markAllAsRead: () => void
  markAsRead: (id: string) => void
  triggerPing: () => void
}

let sharedAudioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!sharedAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx()
    }
  }
  return sharedAudioCtx
}

export function playPingSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  const resumeAndPlay = () => {
    try {
      const now = ctx.currentTime

      // Tone 1: 880 Hz (A5 chime)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = "sine"
      osc1.frequency.setValueAtTime(880, now)
      gain1.gain.setValueAtTime(0.25, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.35)

      // Tone 2: 1318.5 Hz (E6 sparkle)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = "sine"
      osc2.frequency.setValueAtTime(1318.5, now + 0.08)
      gain2.gain.setValueAtTime(0.28, now + 0.08)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.08)
      osc2.stop(now + 0.45)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  if (ctx.state === "suspended") {
    ctx
      .resume()
      .then(resumeAndPlay)
      .catch(() => {})
  } else {
    resumeAndPlay()
  }
}

const defaultNotifications: CampusNotification[] = [
  {
    id: "notif-1",
    title: "Escalated Ticket #1044",
    desc: "Wi-Fi AP offline in Lab 3 has breached the 48h SLA threshold and requires admin dispatch.",
    time: "2h ago",
    read: false,
    type: "ticket",
    ticketId: "#1044",
  },
  {
    id: "notif-2",
    title: "Unassigned Ticket #1040",
    desc: "Facilities water cooler leak issue pending staff assignment.",
    time: "5h ago",
    read: false,
    type: "ticket",
    ticketId: "#1040",
  },
  {
    id: "notif-3",
    title: "Ticket #1041 Resolved",
    desc: "Broken projector in Room 402 marked resolved by maintenance staff.",
    time: "1d ago",
    read: true,
    type: "ticket",
    ticketId: "#1041",
  },
]

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const userRole = session?.user?.role
  const userEmail = session?.user?.email?.toLowerCase().trim()
  const isAdmin =
    userRole === "admin" ||
    userEmail === "admin@glbitm.ac.in" ||
    userEmail === "sharmanaman1809@gmail.com"

  const [notifications, setNotifications] =
    useState<CampusNotification[]>(defaultNotifications)
  const [isPinging, setIsPinging] = useState(false)
  const knownTicketIdsRef = useRef<Set<string>>(new Set())
  const hasInitializedTicketsRef = useRef(false)

  const triggerPing = useCallback(() => {
    if (isAdmin) {
      playPingSound()
    }
    setIsPinging(true)
    setTimeout(() => {
      setIsPinging(false)
    }, 2500)
  }, [isAdmin])

  // Auto-unlock audio on user interaction or window focus
  useEffect(() => {
    const unlockAudio = () => {
      const ctx = getAudioContext()
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {})
      }
    }
    window.addEventListener("click", unlockAudio, { once: true, passive: true })
    window.addEventListener("keydown", unlockAudio, {
      once: true,
      passive: true,
    })
    window.addEventListener("pointerdown", unlockAudio, {
      once: true,
      passive: true,
    })
    window.addEventListener("focus", unlockAudio, { passive: true })
    return () => {
      window.removeEventListener("click", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
      window.removeEventListener("pointerdown", unlockAudio)
      window.removeEventListener("focus", unlockAudio)
    }
  }, [])

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("campuscore_notifications")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed)
        }
      }
    } catch {
      // ignore
    }

    // 1. Listen for local custom new-ticket event
    const handleNewTicketEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        id: string
        title: string
        department: string
        priority?: string
      }>
      if (customEvent.detail) {
        const t = customEvent.detail
        if (!knownTicketIdsRef.current.has(t.id)) {
          knownTicketIdsRef.current.add(t.id)
        }
        const newNotif: CampusNotification = {
          id: `notif-${Date.now()}`,
          title: `New Grievance: ${t.id}`,
          desc: `${t.title} (${t.department}) - Priority: ${t.priority || "routine"}`,
          time: "Just now",
          read: false,
          type: "ticket",
          ticketId: t.id,
        }

        setNotifications((prev) => {
          const updated = [newNotif, ...prev]
          try {
            localStorage.setItem(
              "campuscore_notifications",
              JSON.stringify(updated),
            )
          } catch {
            // ignore
          }
          return updated
        })

        triggerPing()
      }
    }

    // 2. Cross-tab BroadcastChannel for instant real-time notification across tabs
    let broadcastChannel: BroadcastChannel | null = null
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        broadcastChannel = new BroadcastChannel("campuscore_events")
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === "new-ticket" && event.data?.ticket) {
            const t = event.data.ticket
            if (!knownTicketIdsRef.current.has(t.id)) {
              knownTicketIdsRef.current.add(t.id)
              const newNotif: CampusNotification = {
                id: `notif-${Date.now()}`,
                title: `New Grievance: ${t.id}`,
                desc: `${t.title} (${t.department}) - Priority: ${t.priority || "routine"}`,
                time: "Just now",
                read: false,
                type: "ticket",
                ticketId: t.id,
              }

              setNotifications((prev) => {
                const updated = [newNotif, ...prev]
                try {
                  localStorage.setItem(
                    "campuscore_notifications",
                    JSON.stringify(updated),
                  )
                } catch {
                  // ignore
                }
                return updated
              })

              triggerPing()
              window.dispatchEvent(new CustomEvent("campuscore:tickets-sync"))
            }
          }
        }
      }
    } catch {
      // ignore
    }

    // 3. Populate baseline ticket IDs once on load (no continuous polling)
    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tickets)) {
          data.tickets.forEach((t: { id: string }) => {
            knownTicketIdsRef.current.add(t.id)
          })
          hasInitializedTicketsRef.current = true
        }
      })
      .catch(() => {})

    // 4. Server-Sent Events (SSE): Server pushes new tickets only when written to DB
    let eventSource: EventSource | null = null
    try {
      if (typeof window !== "undefined" && "EventSource" in window) {
        eventSource = new EventSource("/api/tickets/stream")
        eventSource.addEventListener("new-ticket", (event: MessageEvent) => {
          try {
            const t = JSON.parse(event.data)
            if (t && t.id && !knownTicketIdsRef.current.has(t.id)) {
              knownTicketIdsRef.current.add(t.id)
              const newNotif: CampusNotification = {
                id: `notif-${Date.now()}-${t.id.replace("#", "")}`,
                title: `New Grievance: ${t.id}`,
                desc: `${t.title} (${t.department}) - Priority: ${t.priority || "routine"}`,
                time: "Just now",
                read: false,
                type: "ticket",
                ticketId: t.id,
              }

              setNotifications((prev) => {
                const updated = [newNotif, ...prev]
                try {
                  localStorage.setItem(
                    "campuscore_notifications",
                    JSON.stringify(updated),
                  )
                } catch {
                  // ignore
                }
                return updated
              })

              triggerPing()
              window.dispatchEvent(new CustomEvent("campuscore:tickets-sync"))
            }
          } catch {
            // ignore malformed push message
          }
        })
      }
    } catch {
      // ignore
    }

    window.addEventListener("campuscore:new-ticket", handleNewTicketEvent)

    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (broadcastChannel) {
        broadcastChannel.close()
      }
      window.removeEventListener("campuscore:new-ticket", handleNewTicketEvent)
    }
  }, [triggerPing])

  const addNotification = useCallback(
    (notif: Omit<CampusNotification, "id" | "time" | "read">) => {
      const newNotif: CampusNotification = {
        ...notif,
        id: `notif-${Date.now()}`,
        time: "Just now",
        read: false,
      }

      setNotifications((prev) => {
        const updated = [newNotif, ...prev]
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "campuscore_notifications",
              JSON.stringify(updated),
            )
          } catch {
            // ignore
          }
        }
        return updated
      })

      triggerPing()
    },
    [triggerPing],
  )

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }))
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "campuscore_notifications",
            JSON.stringify(updated),
          )
        } catch {
          // ignore
        }
      }
      return updated
    })
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "campuscore_notifications",
            JSON.stringify(updated),
          )
        } catch {
          // ignore
        }
      }
      return updated
    })
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isPinging,
      addNotification,
      markAllAsRead,
      markAsRead,
      triggerPing,
    }),
    [
      notifications,
      unreadCount,
      isPinging,
      addNotification,
      markAllAsRead,
      markAsRead,
      triggerPing,
    ],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    )
  }
  return context
}
