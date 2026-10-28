"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"

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

export function playPingSound() {
  if (typeof window === "undefined") return
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === "suspended") {
      ctx.resume()
    }
    const now = ctx.currentTime

    // Primary bell chime tone (880 Hz - A5)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(880, now)
    gain1.gain.setValueAtTime(0.18, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.35)

    // Harmonic sparkle chime tone (1318.5 Hz - E6)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(1318.5, now + 0.08)
    gain2.gain.setValueAtTime(0.22, now + 0.08)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.08)
    osc2.stop(now + 0.45)
  } catch {
    // Graceful fallback if audio is not permitted by browser
  }
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] =
    useState<CampusNotification[]>(defaultNotifications)
  const [isPinging, setIsPinging] = useState(false)

  const triggerPing = useCallback(() => {
    playPingSound()
    setIsPinging(true)
    setTimeout(() => {
      setIsPinging(false)
    }, 2500)
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

    // Listen for custom new-ticket event
    const handleNewTicket = (e: Event) => {
      const customEvent = e as CustomEvent<{
        id: string
        title: string
        department: string
        priority?: string
      }>
      if (customEvent.detail) {
        const t = customEvent.detail
        const newNotif: CampusNotification = {
          id: `notif-${Date.now()}`,
          title: `New Grievance Raised: ${t.id}`,
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

    // Listen to cross-tab storage sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "campuscore_notifications" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) {
            setNotifications(parsed)
          }
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener("campuscore:new-ticket", handleNewTicket)
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("campuscore:new-ticket", handleNewTicket)
      window.removeEventListener("storage", handleStorage)
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
