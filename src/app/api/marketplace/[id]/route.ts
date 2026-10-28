import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import MarketplaceItem from "@/models/MarketplaceItem"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const item = await MarketplaceItem.findById(id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 },
      )
    }

    if (body.action === "mark_sold") {
      item.status = "sold"
    } else if (body.action === "dismiss_report") {
      item.status = "available"
      item.reportsCount = 0
      item.reportReason = undefined
    } else if (body.action === "report") {
      item.status = "reported"
      item.reportsCount = (item.reportsCount || 0) + 1
      item.reportReason = body.reason || "Reported by community"
    } else if (body.action === "suspend") {
      item.status = "sold" // remove from active market
    }

    await item.save()
    return NextResponse.json({ success: true, item })
  } catch (err: any) {
    console.error("Error updating marketplace item:", err)
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
    await MarketplaceItem.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Error deleting marketplace item:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
