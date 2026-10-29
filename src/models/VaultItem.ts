import mongoose, { Schema, Document } from "mongoose"

export interface IVaultItem extends Document {
  title: string
  author: string
  type: string
  size: string
  branch: string
  semester: string
  fileUrl: string
  fileData?: string
  fileName?: string
  downloadCount: number
  uploadedBy?: {
    name: string
    email: string
  }
  flagged: boolean
  flagReason?: string
  flaggedCount: number
  createdAt: Date
  updatedAt: Date
}

const VaultItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, default: "PDF" },
    size: { type: String, default: "1.5 MB" },
    branch: { type: String, required: true, index: true },
    semester: { type: String, required: true, index: true },
    fileUrl: { type: String, default: "/uploads/vault/sample.pdf" },
    fileData: { type: String },
    fileName: { type: String },
    downloadCount: { type: Number, default: 0 },
    uploadedBy: {
      name: { type: String },
      email: { type: String },
    },
    flagged: { type: Boolean, default: false },
    flagReason: { type: String },
    flaggedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.models.VaultItem ||
  mongoose.model<IVaultItem>("VaultItem", VaultItemSchema)
