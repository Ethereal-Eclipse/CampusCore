import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import LostFoundItem from "@/models/LostFoundItem"
import { initialLostFoundItems } from "@/lib/seedAll"
import { uploadImageToCloudinary } from "@/lib/storage"

export async function GET(req: Request) {
  try {
    await connectDB()
    const count = await LostFoundItem.countDocuments()
    if (count === 0) {
      await LostFoundItem.insertMany(initialLostFoundItems)
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")
    const custodyOnly = searchParams.get("custody") === "true"

    const filter: any = {}
    if (type && type !== "All") filter.type = type
    if (custodyOnly) filter.status = "In Custody"

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ]
    }

    const items = await LostFoundItem.find(filter)
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json({ success: true, items })
  } catch (err: any) {
    console.error("Error fetching lost-found items:", err)
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
    let location = ""
    let type: "Lost" | "Found" = "Found"
    let category = "General"
    let description = ""
    let turnedInBy = "Student Report"
    let contactEmail = "student@glbitm.ac.in"
    let imageUrl =
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      title = (formData.get("title") as string) || ""
      location = (formData.get("location") as string) || ""
      type = ((formData.get("type") as string) || "Found") as "Lost" | "Found"
      category = (formData.get("category") as string) || "General"
      description = (formData.get("description") as string) || ""
      turnedInBy = (formData.get("turnedInBy") as string) || "Student Report"
      contactEmail =
        (formData.get("contactEmail") as string) || "student@glbitm.ac.in"

      const file = formData.get("image") as File | null
      if (file && typeof file === "object" && file.size > 0) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        imageUrl = await uploadImageToCloudinary(
          buffer,
          file.name,
          "lost-found",
        )
      }
    } else {
      const body = await req.json()
      title = body.title
      location = body.location
      type = body.type || "Found"
      category = body.category || "General"
      description = body.description || ""
      turnedInBy = body.turnedInBy || "Student Report"
      contactEmail = body.contactEmail || "student@glbitm.ac.in"
      if (body.imageUrl) imageUrl = body.imageUrl
    }

    if (!title?.trim() || !location?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and location are required" },
        { status: 400 },
      )
    }

    const newItem = await LostFoundItem.create({
      title: title.trim(),
      location: location.trim(),
      type,
      category,
      description,
      turnedInBy,
      contactEmail,
      imageUrl,
      date: "Today",
      status: type === "Found" ? "In Custody" : "Reported",
    })

    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (err: any) {
    console.error("Error creating lost-found item:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
