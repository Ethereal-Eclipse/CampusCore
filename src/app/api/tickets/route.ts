import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import TicketModel from "@/models/Ticket"
import { seedTickets } from "@/lib/seedTickets"

function formatDoc(doc: any) {
  const elapsedHours = Math.floor(
    (Date.now() - new Date(doc.createdAt).getTime()) / (1000 * 60 * 60),
  )
  const effectiveAgeHours = Math.max(doc.ageHours || 0, elapsedHours)
  const effectiveAge = `${effectiveAgeHours}h`

  const effectiveStatus =
    doc.status !== "resolved" && effectiveAgeHours > 48
      ? "escalated"
      : doc.status

  return {
    id: doc.ticketId,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    department: doc.department,
    location: doc.location,
    priority: doc.priority || "medium",
    contactPhone: doc.contactPhone,
    status: effectiveStatus,
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

export async function GET() {
  try {
    await connectDB()

    const count = await TicketModel.countDocuments()
    if (count === 0) {
      const seedDocs = seedTickets.map((t) => ({
        ticketId: t.ticketId,
        title: t.title,
        description: t.description,
        category: t.category,
        department: t.department,
        location: t.location,
        priority: t.priority || "medium",
        contactPhone: t.contactPhone,
        status: t.status,
        raisedBy: t.raisedBy,
        assignedTo: t.assignedTo,
        openedAt: t.openedAt,
        expectedReply: t.expectedReply,
        age: t.age,
        ageHours: t.ageHours,
        icon: t.icon || "ticket",
        updates: t.updates,
        createdAt: new Date(Date.now() - (t.ageOffsetHours || 0) * 3600 * 1000),
      }))
      await TicketModel.insertMany(seedDocs)
    }

    const docs = await TicketModel.find({}).sort({ createdAt: -1 }).lean()
    const tickets = docs.map(formatDoc)
    return NextResponse.json({ success: true, tickets })
  } catch (err: any) {
    console.error("Error fetching tickets from database:", err)
    return NextResponse.json(
      { success: false, error: err.message, tickets: [] },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const {
      ticketId: requestedTicketId,
      title,
      category,
      department,
      description,
      location,
      priority = "medium",
      contactPhone,
      raisedBy = {
        name: "Student",
        email: "student@glbitm.ac.in",
        initials: "ST",
      },
    } = body

    if (!title || !description || !category || !department) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      )
    }

    let ticketId = requestedTicketId
    if (ticketId) {
      const existing = await TicketModel.findOne({ ticketId })
      if (existing) ticketId = undefined
    }

    if (!ticketId) {
      const count = await TicketModel.countDocuments()
      const highestDoc = await TicketModel.findOne({}, { ticketId: 1 }).sort({
        createdAt: -1,
      })
      let nextNum = 1045 + count
      if (highestDoc?.ticketId) {
        const parsed = parseInt(highestDoc.ticketId.replace(/[^0-9]/g, ""), 10)
        if (!isNaN(parsed) && parsed >= nextNum) {
          nextNum = parsed + 1
        }
      }
      ticketId = `#${nextNum}`
    }

    const catLower = category.toLowerCase()
    let icon = "ticket"
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

    const expectedReply =
      priority === "high" || priority === "critical"
        ? "Within 6 hours"
        : "Within 24 hours"

    const nowFormatted = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    const initialUpdate = {
      id: `u-${Date.now()}`,
      message: `Ticket submitted by ${raisedBy.name}`,
      timestamp: "Just now",
      type: "submitted",
    }

    const newDoc = await TicketModel.create({
      ticketId,
      title,
      description,
      category,
      department,
      location,
      priority,
      contactPhone,
      status: "pending",
      raisedBy,
      assignedTo: null,
      openedAt: `Today, ${nowFormatted}`,
      expectedReply,
      age: "0h",
      ageHours: 0,
      icon,
      updates: [initialUpdate],
    })

    const ticket = formatDoc(newDoc)
    return NextResponse.json({ success: true, ticket }, { status: 201 })
  } catch (err: any) {
    console.error("Error creating ticket in database:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
