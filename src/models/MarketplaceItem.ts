import mongoose, { Schema, Document } from "mongoose"

export interface IMarketplaceItem extends Document {
  title: string
  price: string
  condition: string
  category: string
  description?: string
  seller: {
    name: string
    email: string
    branch?: string
    phone?: string
  }
  imageUrl: string
  status: "available" | "sold" | "reported"
  reportsCount: number
  reportReason?: string
  createdAt: Date
  updatedAt: Date
}

const MarketplaceItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    condition: { type: String, default: "Good" },
    category: { type: String, default: "General" },
    description: { type: String },
    seller: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      branch: { type: String },
      phone: { type: String },
    },
    imageUrl: { type: String, default: "/images/sample-product.jpg" },
    status: {
      type: String,
      enum: ["available", "sold", "reported"],
      default: "available",
      index: true,
    },
    reportsCount: { type: Number, default: 0 },
    reportReason: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.MarketplaceItem ||
  mongoose.model<IMarketplaceItem>("MarketplaceItem", MarketplaceItemSchema)
