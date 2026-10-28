import mongoose, { Schema, Document } from "mongoose"

export interface ITicketUpdate {
  id: string
  message: string
  timestamp: string
  type:
    | "submitted"
    | "assigned"
    | "in_progress"
    | "resolved"
    | "note"
    | "escalated"
    | "pending"
  author?: string
}

export interface ITicket extends Document {
  ticketId: string
  title: string
  description: string
  category: string
  department: string
  location?: string
  priority?: "low" | "medium" | "high" | "critical"
  contactPhone?: string
  status: "pending" | "in_progress" | "resolved" | "escalated"
  raisedBy: {
    name: string
    email: string
    initials: string
  }
  assignedTo?: {
    id: string
    name: string
    department: string
    initials: string
  } | null
  openedAt: string
  expectedReply?: string
  age: string
  ageHours: number
  resolvedAt?: Date
  icon?: "wifi" | "monitor" | "droplet" | "ticket" | "alert"
  updates: ITicketUpdate[]
  createdAt: Date
  updatedAt: Date
}

const TicketUpdateSchema = new Schema(
  {
    id: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "submitted",
        "assigned",
        "in_progress",
        "resolved",
        "note",
        "escalated",
        "pending",
      ],
      default: "submitted",
    },
    author: { type: String },
  },
  { _id: false },
)

const TicketSchema: Schema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    contactPhone: { type: String },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "escalated"],
      default: "pending",
    },
    raisedBy: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      initials: { type: String, required: true },
    },
    assignedTo: {
      id: { type: String },
      name: { type: String },
      department: { type: String },
      initials: { type: String },
    },
    openedAt: { type: String, required: true },
    expectedReply: { type: String },
    age: { type: String },
    ageHours: { type: Number, default: 0 },
    resolvedAt: { type: Date },
    icon: {
      type: String,
      enum: ["wifi", "monitor", "droplet", "ticket", "alert"],
      default: "ticket",
    },
    updates: [TicketUpdateSchema],
  },
  { timestamps: true },
)

export default mongoose.models.Ticket ||
  mongoose.model<ITicket>("Ticket", TicketSchema)
