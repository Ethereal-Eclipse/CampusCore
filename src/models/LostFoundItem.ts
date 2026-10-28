import mongoose, { Schema, Document } from "mongoose"

export interface ILostFoundItem extends Document {
  title: string
  location: string
  type: "Lost" | "Found"
  category: string
  description?: string
  imageUrl?: string
  date: string
  status: "In Custody" | "Reported" | "Claimed"
  turnedInBy: string
  contactEmail?: string
  createdAt: Date
  updatedAt: Date
}

const LostFoundItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: true,
      index: true,
    },
    category: { type: String, default: "General" },
    description: { type: String },
    imageUrl: { type: String },
    date: { type: String, default: "Today" },
    status: {
      type: String,
      enum: ["In Custody", "Reported", "Claimed"],
      default: "Reported",
      index: true,
    },
    turnedInBy: { type: String, default: "Campus Security Desk" },
    contactEmail: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.LostFoundItem ||
  mongoose.model<ILostFoundItem>("LostFoundItem", LostFoundItemSchema)
