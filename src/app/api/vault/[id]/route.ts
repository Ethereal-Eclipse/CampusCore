import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import VaultItem from "@/models/VaultItem"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const item = await VaultItem.findById(id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 },
      )
    }

    if (body.action === "download") {
      item.downloadCount = (item.downloadCount || 0) + 1
    } else if (body.action === "dismiss_flag") {
      item.flagged = false
      item.flagReason = undefined
    } else if (body.action === "flag") {
      item.flagged = true
      item.flagReason = body.reason || "Reported by student"
      item.flaggedCount = (item.flaggedCount || 0) + 1
    }

    await item.save()
    return NextResponse.json({ success: true, item })
  } catch (err: any) {
    console.error("Error updating vault item:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    await VaultItem.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Error deleting vault item:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
