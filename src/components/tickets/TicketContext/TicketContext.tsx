"use client"

import React, { createContext, useContext, useState, useMemo, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Ticket, TicketStatus, StaffMember, TicketUpdate } from "../types"
import { initialTickets, mockStaff } from "../mockData"

interface TicketContextType {
  tickets: Ticket[]
  staff: StaffMember[]
  selectedTicket: Ticket | null
  selectedTicketId: string | null
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
  }) => Ticket
}

const TicketContext = createContext<TicketContextType | null>(null)

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawParam = searchParams.get("ticket")
  const urlSelectedId = rawParam ? (rawParam.startsWith("#") ? rawParam : `#${rawParam}`) : null
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(urlSelectedId)

  // Sync state if URL changes externally
  React.useEffect(() => {
    setSelectedTicketId(urlSelectedId)
  }, [urlSelectedId])

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null
    return (
      tickets.find(
        (t) =>
          t.id === selectedTicketId ||
          t.id.replace("#", "") === selectedTicketId.replace("#", "")
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
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const updateTicketStatus = useCallback((id: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) return t
        // Auto-escalation math: unresolved ticket over 48h must remain/turn back escalated
        const effectiveStatus: TicketStatus =
          newStatus !== "resolved" && t.ageHours > 48 ? "escalated" : newStatus

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
      })
    )
  }, [])

  const updateTicketAssignee = useCallback((id: string, staffMember: StaffMember | null) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) return t
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
      })
    )
  }, [])

  const postTicketUpdate = useCallback(
    (id: string, message: string, author: string = "Admin"): boolean => {
      const trimmed = message.trim()
      if (!trimmed) return false

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) return t
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
        })
      )
      return true
    },
    []
  )

  const markResolved = useCallback((id: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) return t
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
      })
    )
  }, [])

  const acknowledgeAndDispatch = useCallback((id: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id && t.id.replace("#", "") !== id.replace("#", "")) return t
        const defaultAssignee =
          t.assignedTo ||
          mockStaff.find(
            (s) => s.department.toLowerCase() === t.department.toLowerCase()
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
      })
    )
  }, [])

  const createTicket = useCallback(
    (data: {
      title: string
      category: string
      department: string
      description: string
    }) => {
      const newId = `#${1045 + Math.floor(Math.random() * 100)}`
      const newTicket: Ticket = {
        id: newId,
        title: data.title,
        description: data.description,
        category: data.category,
        department: data.department,
        status: "pending",
        raisedBy: {
          name: "Campus Student",
          email: "student@glbitm.ac.in",
          initials: "CS",
        },
        assignedTo: null,
        openedAt: "Just now",
        expectedReply: "Within 24 hours",
        age: "0h",
        ageHours: 0,
        icon: "ticket",
        updates: [
          {
            id: `u-${Date.now()}`,
            message: "Ticket submitted by student",
            timestamp: "Just now",
            type: "submitted",
          },
        ],
      }
      setTickets((prev) => [newTicket, ...prev])
      return newTicket
    },
    []
  )

  const value = useMemo(
    () => ({
      tickets,
      staff: mockStaff,
      selectedTicket,
      selectedTicketId,
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
      selectTicket,
      updateTicketStatus,
      updateTicketAssignee,
      postTicketUpdate,
      markResolved,
      acknowledgeAndDispatch,
      createTicket,
    ]
  )

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
}
