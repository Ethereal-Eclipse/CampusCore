import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import LostFoundItem from "@/models/LostFoundItem"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const item = await LostFoundItem.findById(id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 },
      )
    }

    if (body.status) {
      item.status = body.status
    }
    if (body.action === "mark_claimed") {
      item.status = "Claimed"
    }

    await item.save()
    return NextResponse.json({ success: true, item })
  } catch (err: any) {
    console.error("Error updating lost-found item:", err)
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
    await LostFoundItem.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Error deleting lost-found item:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
