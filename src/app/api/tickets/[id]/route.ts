import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import TicketModel from "@/models/Ticket"
import { mockStaff } from "@/components/tickets/mockData"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    const rawId = decodeURIComponent(id)
    const targetId = rawId.startsWith("#") ? rawId : `#${rawId}`

    const doc = await TicketModel.findOne({
      $or: [{ ticketId: targetId }, { ticketId: rawId }],
    })

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 },
      )
    }

    const body = await req.json()
    const { status, assignedTo, updateMessage, author = "Admin", action } = body

    // 1. Action: Mark Resolved
    if (action === "resolve" || status === "resolved") {
      doc.status = "resolved"
      doc.updates.push({
        id: `u-${Date.now()}`,
        message: "Marked as resolved",
        timestamp: "Just now",
        type: "resolved",
      })
    }
    // 2. Action: Acknowledge & Dispatch
    else if (action === "acknowledge_dispatch") {
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
    }
    // 3. Status update
    else if (status) {
      // Dynamic SLA policy check
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

    // 4. Assignee update
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

    // 5. Append message / note
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

    const elapsedHours = Math.floor(
      (Date.now() - new Date(doc.createdAt).getTime()) / (1000 * 60 * 60),
    )
    const effectiveAgeHours = Math.max(doc.ageHours || 0, elapsedHours)

    const ticket = {
      id: doc.ticketId,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      department: doc.department,
      location: doc.location,
      priority: doc.priority,
      contactPhone: doc.contactPhone,
      status: doc.status,
      raisedBy: doc.raisedBy,
      assignedTo: doc.assignedTo || null,
      openedAt: doc.openedAt,
      expectedReply: doc.expectedReply,
      age: `${effectiveAgeHours}h`,
      ageHours: effectiveAgeHours,
      icon: doc.icon,
      updates: doc.updates,
    }

    return NextResponse.json({ success: true, ticket })
  } catch (err: any) {
    console.error("Error updating ticket in MongoDB:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
