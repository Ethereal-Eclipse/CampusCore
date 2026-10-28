"use client"

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Ticket, TicketStatus, StaffMember, TicketUpdate } from "../types"
import { mockStaff } from "../mockData"

interface TicketContextType {
  tickets: Ticket[]
  staff: StaffMember[]
  selectedTicket: Ticket | null
  selectedTicketId: string | null
  isLoading: boolean
  selectTicket: (id: string | null) => void
  updateTicketStatus: (id: string, status: TicketStatus) => void
  updateTicketAssignee: (id: string, staffMember: StaffMember | null) => void
  postTicketUpdate: (id: string, message: string, author?: string) => boolean
  markResolved: (id: string) => void
  acknowledgeAndDispatch: (id: string) => void
  createTicket: (data: {
    title: string
    category: string
    department: string
    description: string
    location?: string
    priority?: Ticket["priority"]
    contactPhone?: string
  }) => Ticket
}

const TicketContext = createContext<TicketContextType | null>(null)

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawParam = searchParams.get("ticket")
  const urlSelectedId = rawParam
    ? rawParam.startsWith("#")
      ? rawParam
      : `#${rawParam}`
    : null
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    urlSelectedId,
  )

  // Fetch tickets directly from database on mount
  useEffect(() => {
    let isMounted = true

    async function loadTickets() {
      try {
        const res = await fetch("/api/tickets")
        if (!res.ok) return
        const data = await res.json()
        if (isMounted && data.success && Array.isArray(data.tickets)) {
          setTickets(data.tickets)
        }
      } catch (err) {
        console.error("Failed to load tickets from database:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadTickets()

    return () => {
      isMounted = false
    }
  }, [])

  // Sync state if URL changes externally
  useEffect(() => {
    setSelectedTicketId(urlSelectedId)
  }, [urlSelectedId])

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null
    return (
      tickets.find(
        (t) =>
          t.id === selectedTicketId ||
          t.id.replace("#", "") === selectedTicketId.replace("#", ""),
      ) || null
    )
  }, [tickets, selectedTicketId])

  const selectTicket = useCallback(
    (id: string | null) => {
      setSelectedTicketId(id)
      const params = new URLSearchParams(searchParams.toString())
      if (id) {
        params.set("ticket", id.replace(/^#/, ""))
      } else {
        params.delete("ticket")
      }
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    },
    [router, pathname, searchParams],
  )

  const updateTicketStatus = useCallback(
    (id: string, newStatus: TicketStatus) => {
      // Optimistic state update
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) {
            return t
          }
          const effectiveStatus: TicketStatus =
            newStatus !== "resolved" && t.ageHours > 48
              ? "escalated"
              : newStatus

          const updateEntry: TicketUpdate = {
            id: `u-${Date.now()}`,
            message:
              effectiveStatus === "escalated" && newStatus !== "escalated"
                ? `Status reset to ${newStatus.replace("_", " ")}, but automatically flagged as escalated due to SLA policy (>48h)`
                : `Status changed to ${effectiveStatus.replace("_", " ")}`,
            timestamp: "Just now",
            type: effectiveStatus,
          }
          return {
            ...t,
            status: effectiveStatus,
            updates: [...t.updates, updateEntry],
          }
        }),
      )

      // Persist status change to database
      fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.ticket) {
            setTickets((prev) =>
              prev.map((t) => (t.id === data.ticket.id ? data.ticket : t)),
            )
          }
        })
        .catch((err) => console.error("Error saving status to database:", err))
    },
    [],
  )

  const updateTicketAssignee = useCallback(
    (id: string, staffMember: StaffMember | null) => {
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) {
            return t
          }
          const updateEntry: TicketUpdate = {
            id: `u-${Date.now()}`,
            message: staffMember
              ? `Assigned to ${staffMember.name}`
              : "Ticket unassigned",
            timestamp: "Just now",
            type: "assigned",
          }

          let nextStatus = t.status
          if (!staffMember && t.status === "in_progress") {
            nextStatus = t.ageHours > 48 ? "escalated" : "pending"
          } else if (t.status === "pending" && staffMember) {
            nextStatus = t.ageHours > 48 ? "escalated" : "in_progress"
          } else if (t.ageHours > 48 && t.status !== "resolved") {
            nextStatus = "escalated"
          }

          return {
            ...t,
            assignedTo: staffMember,
            status: nextStatus,
            updates: [...t.updates, updateEntry],
          }
        }),
      )

      // Persist assignee change to database
      fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: staffMember }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.ticket) {
            setTickets((prev) =>
              prev.map((t) => (t.id === data.ticket.id ? data.ticket : t)),
            )
          }
        })
        .catch((err) => console.error("Error saving assignee to database:", err))
    },
    [],
  )

  const postTicketUpdate = useCallback(
    (id: string, message: string, author: string = "Admin"): boolean => {
      const trimmed = message.trim()
      if (!trimmed) return false

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) {
            return t
          }
          const updateEntry: TicketUpdate = {
            id: `u-${Date.now()}`,
            message: trimmed,
            timestamp: "Just now",
            type: "note",
            author,
          }
          return {
            ...t,
            updates: [...t.updates, updateEntry],
          }
        }),
      )

      // Persist update note to database
      fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateMessage: trimmed, author }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.ticket) {
            setTickets((prev) =>
              prev.map((t) => (t.id === data.ticket.id ? data.ticket : t)),
            )
          }
        })
        .catch((err) =>
          console.error("Error saving update note to database:", err),
        )

      return true
    },
    [],
  )

  const markResolved = useCallback((id: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) {
          return t
        }
        const updateEntry: TicketUpdate = {
          id: `u-${Date.now()}`,
          message: "Marked as resolved",
          timestamp: "Just now",
          type: "resolved",
        }
        return {
          ...t,
          status: "resolved",
          updates: [...t.updates, updateEntry],
        }
      }),
    )

    // Persist resolution to database
    fetch(`/api/tickets/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resolve" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ticket) {
          setTickets((prev) =>
            prev.map((t) => (t.id === data.ticket.id ? data.ticket : t)),
          )
        }
      })
      .catch((err) => console.error("Error saving resolution to database:", err))
  }, [])

  const acknowledgeAndDispatch = useCallback((id: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) {
          return t
        }
        const defaultAssignee =
          t.assignedTo ||
          mockStaff.find(
            (s) => s.department.toLowerCase() === t.department.toLowerCase(),
          ) ||
          mockStaff[0]
        const updateEntry: TicketUpdate = {
          id: `u-${Date.now()}`,
          message: `Escalation acknowledged and dispatched to ${defaultAssignee.name}`,
          timestamp: "Just now",
          type: "in_progress",
        }
        return {
          ...t,
          status: "in_progress",
          assignedTo: defaultAssignee,
          updates: [...t.updates, updateEntry],
        }
      }),
    )

    // Persist escalation dispatch to database
    fetch(`/api/tickets/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acknowledge_dispatch" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ticket) {
          setTickets((prev) =>
            prev.map((t) => (t.id === data.ticket.id ? data.ticket : t)),
          )
        }
      })
      .catch((err) =>
        console.error("Error acknowledging escalation in database:", err),
      )
  }, [])

  const createTicket = useCallback(
    (data: {
      title: string
      category: string
      department: string
      description: string
      location?: string
      priority?: Ticket["priority"]
      contactPhone?: string
    }) => {
      let maxNum = 1044
      for (const t of tickets) {
        const n = parseInt(t.id.replace(/[^0-9]/g, ""), 10)
        if (!isNaN(n) && n > maxNum) maxNum = n
      }
      const tempId = `#${maxNum + 1}`

      const catLower = data.category.toLowerCase()
      let icon: Ticket["icon"] = "ticket"
      if (catLower.includes("wi-fi") || catLower.includes("network")) {
        icon = "wifi"
      } else if (
        catLower.includes("classroom") ||
        catLower.includes("projector") ||
        catLower.includes("lab")
      ) {
        icon = "monitor"
      } else if (
        catLower.includes("water") ||
        catLower.includes("cooler") ||
        catLower.includes("plumbing")
      ) {
        icon = "droplet"
      }

      const newTicket: Ticket = {
        id: tempId,
        title: data.title,
        description: data.description,
        category: data.category,
        department: data.department,
        location: data.location,
        priority: data.priority || "medium",
        contactPhone: data.contactPhone,
        status: "pending",
        raisedBy: {
          name: "Student",
          email: "student@glbitm.ac.in",
          initials: "ST",
        },
        assignedTo: null,
        openedAt: "Just now",
        expectedReply:
          data.priority === "high" || data.priority === "critical"
            ? "Within 6 hours"
            : "Within 24 hours",
        age: "0h",
        ageHours: 0,
        icon,
        updates: [
          {
            id: `u-${Date.now()}`,
            message: "Ticket submitted by student",
            timestamp: "Just now",
            type: "submitted",
          },
        ],
      }

      // Add to React state immediately
      setTickets((prev) => [newTicket, ...prev])

      // Dispatch custom event for admin notifications and audio ping chime
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("campuscore:new-ticket", { detail: newTicket }),
        )
      }

      // Persist newly created ticket directly to MongoDB database
      fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: tempId,
          title: data.title,
          category: data.category,
          department: data.department,
          description: data.description,
          location: data.location,
          priority: data.priority,
          contactPhone: data.contactPhone,
          raisedBy: newTicket.raisedBy,
        }),
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.success && resp.ticket) {
            setTickets((prev) =>
              prev.map((t) => (t.id === tempId ? resp.ticket : t)),
            )
          }
        })
        .catch((err) => console.error("Error creating ticket in database:", err))

      return newTicket
    },
    [tickets],
  )

  const value = useMemo(
    () => ({
      tickets,
      staff: mockStaff,
      selectedTicket,
      selectedTicketId,
      isLoading,
      selectTicket,
      updateTicketStatus,
      updateTicketAssignee,
      postTicketUpdate,
      markResolved,
      acknowledgeAndDispatch,
      createTicket,
    }),
    [
      tickets,
      selectedTicket,
      selectedTicketId,
      isLoading,
      selectTicket,
      updateTicketStatus,
      updateTicketAssignee,
      postTicketUpdate,
      markResolved,
      acknowledgeAndDispatch,
      createTicket,
    ],
  )

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  )
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
}
