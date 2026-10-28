import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import MarketplaceItem from "@/models/MarketplaceItem"
import { initialMarketplaceItems } from "@/lib/seedAll"
import { uploadImageToCloudinary } from "@/lib/storage"

export async function GET(req: Request) {
  try {
    await connectDB()
    const count = await MarketplaceItem.countDocuments()
    if (count === 0) {
      await MarketplaceItem.insertMany(initialMarketplaceItems)
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const reportedOnly = searchParams.get("reported") === "true"

    const filter: any = {}
    if (category && category !== "All") filter.category = category
    if (reportedOnly) {
      filter.status = "reported"
    } else {
      filter.status = { $ne: "sold" }
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { "seller.name": { $regex: search.trim(), $options: "i" } },
      ]
    }

    const items = await MarketplaceItem.find(filter)
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json({ success: true, items })
  } catch (err: any) {
    console.error("Error fetching marketplace items:", err)
    return NextResponse.json(
      { success: false, error: err.message, items: [] },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const contentType = req.headers.get("content-type") || ""

    let title = ""
    let price = "₹250"
    let condition = "Good"
    let category = "General"
    let description = ""
    let sellerName = "Student Seller"
    let sellerEmail = "student@glbitm.ac.in"
    let sellerBranch = "CSE"
    let sellerPhone = "+91 98765 43210"
    let imageUrl =
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      title = (formData.get("title") as string) || ""
      price = (formData.get("price") as string) || "₹250"
      condition = (formData.get("condition") as string) || "Good"
      category = (formData.get("category") as string) || "General"
      description = (formData.get("description") as string) || ""
      sellerName = (formData.get("sellerName") as string) || "Student Seller"
      sellerEmail =
        (formData.get("sellerEmail") as string) || "student@glbitm.ac.in"
      sellerBranch = (formData.get("sellerBranch") as string) || "CSE"
      sellerPhone = (formData.get("sellerPhone") as string) || ""

      const file = formData.get("image") as File | null
      if (file && typeof file === "object" && file.size > 0) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        imageUrl = await uploadImageToCloudinary(
          buffer,
          file.name,
          "marketplace",
        )
      }
    } else {
      const body = await req.json()
      title = body.title
      price = body.price || "₹250"
      condition = body.condition || "Good"
      category = body.category || "General"
      description = body.description || ""
      sellerName = body.sellerName || "Student Seller"
      sellerEmail = body.sellerEmail || "student@glbitm.ac.in"
      sellerBranch = body.sellerBranch || "CSE"
      sellerPhone = body.sellerPhone || ""
      if (body.imageUrl) imageUrl = body.imageUrl
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      )
    }

    if (!price.startsWith("₹")) {
      price = `₹${price.replace(/[^0-9]/g, "")}`
    }

    const newItem = await MarketplaceItem.create({
      title: title.trim(),
      price,
      condition,
      category,
      description,
      seller: {
        name: sellerName,
        email: sellerEmail,
        branch: sellerBranch,
        phone: sellerPhone,
      },
      imageUrl,
      status: "available",
      reportsCount: 0,
    })

    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (err: any) {
    console.error("Error creating marketplace item:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
