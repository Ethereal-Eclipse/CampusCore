import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import TicketModel from "@/models/Ticket"
import { mockStaff } from "@/components/tickets/mockData"

function formatDoc(doc: any) {
  let effectiveAgeHours = doc.ageHours || 0
  if (doc.status !== "resolved") {
    const elapsedHours = Math.floor(
      (Date.now() - new Date(doc.createdAt).getTime()) / (1000 * 60 * 60),
    )
    effectiveAgeHours = Math.max(doc.ageHours || 0, elapsedHours)
  }
  const effectiveAge = `${effectiveAgeHours}h`

  return {
    id: doc.ticketId,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    department: doc.department,
    location: doc.location,
    priority: doc.priority || "medium",
    contactPhone: doc.contactPhone,
    status: doc.status,
    raisedBy: doc.raisedBy,
    assignedTo: doc.assignedTo || null,
    openedAt: doc.openedAt,
    expectedReply: doc.expectedReply,
    age: effectiveAge,
    ageHours: effectiveAgeHours,
    icon: doc.icon || "ticket",
    updates: doc.updates || [],
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    const rawId = decodeURIComponent(id)
    const targetId = rawId.startsWith("#") ? rawId : `#${rawId}`
    const body = await req.json()
    const { status, assignedTo, updateMessage, author = "Admin", action } = body

    const doc = await TicketModel.findOne({
      $or: [{ ticketId: targetId }, { ticketId: rawId }],
    })

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 },
      )
    }

    if (action === "resolve" || status === "resolved") {
      doc.status = "resolved"
      const elapsedHours = Math.floor(
        (Date.now() - new Date(doc.createdAt).getTime()) / (1000 * 60 * 60),
      )
      const finalAgeHours = Math.max(doc.ageHours || 0, elapsedHours)
      doc.ageHours = finalAgeHours
      doc.age = `${finalAgeHours}h`
      doc.resolvedAt = new Date()
      doc.updates.push({
        id: `u-${Date.now()}`,
        message: "Marked as resolved",
        timestamp: "Just now",
        type: "resolved",
      })
    } else if (action === "acknowledge_dispatch") {
      const defaultAssignee =
        doc.assignedTo ||
        mockStaff.find(
          (s) => s.department.toLowerCase() === doc.department.toLowerCase(),
        ) ||
        mockStaff[0]

      doc.status = "in_progress"
      doc.assignedTo = defaultAssignee
      doc.updates.push({
        id: `u-${Date.now()}`,
        message: `Escalation acknowledged and dispatched to ${defaultAssignee.name}`,
        timestamp: "Just now",
        type: "in_progress",
      })
    } else if (status) {
      const elapsedHours = Math.floor(
        (Date.now() - new Date(doc.createdAt).getTime()) / (1000 * 60 * 60),
      )
      const effectiveAgeHours = Math.max(doc.ageHours || 0, elapsedHours)
      const effectiveStatus =
        status !== "resolved" && effectiveAgeHours > 48 ? "escalated" : status

      doc.status = effectiveStatus
      doc.updates.push({
        id: `u-${Date.now()}`,
        message:
          effectiveStatus === "escalated" && status !== "escalated"
            ? `Status reset to ${status.replace("_", " ")}, but automatically flagged as escalated due to SLA policy (>48h)`
            : `Status changed to ${effectiveStatus.replace("_", " ")}`,
        timestamp: "Just now",
        type: effectiveStatus,
      })
    }

    if (assignedTo !== undefined) {
      doc.assignedTo = assignedTo
      doc.updates.push({
        id: `u-${Date.now()}`,
        message: assignedTo
          ? `Assigned to ${assignedTo.name}`
          : "Ticket unassigned",
        timestamp: "Just now",
        type: "assigned",
      })
    }

    if (updateMessage?.trim()) {
      doc.updates.push({
        id: `u-${Date.now()}`,
        message: updateMessage.trim(),
        timestamp: "Just now",
        type: "note",
        author,
      })
    }

    await doc.save()
    return NextResponse.json({ success: true, ticket: formatDoc(doc) })
  } catch (err: any) {
    console.error("Error updating ticket in database:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
