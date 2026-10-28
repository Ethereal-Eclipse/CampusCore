import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import VaultItem from "@/models/VaultItem"
import { initialVaultItems } from "@/lib/seedAll"
import { uploadDocumentToR2 } from "@/lib/storage"

export async function GET(req: Request) {
  try {
    await connectDB()
    const count = await VaultItem.countDocuments()
    if (count === 0) {
      await VaultItem.insertMany(initialVaultItems)
    }

    const { searchParams } = new URL(req.url)
    const branch = searchParams.get("branch")
    const semester = searchParams.get("semester")
    const search = searchParams.get("search")
    const flaggedOnly = searchParams.get("flagged") === "true"

    const filter: any = {}
    if (branch && branch !== "All") filter.branch = branch
    if (semester && semester !== "All") filter.semester = semester
    if (flaggedOnly) filter.flagged = true

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { author: { $regex: search.trim(), $options: "i" } },
        { branch: { $regex: search.trim(), $options: "i" } },
      ]
    }

    const items = await VaultItem.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, items })
  } catch (err: any) {
    console.error("Error fetching vault items:", err)
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
    let author = "Faculty Contributor"
    let branch = "CSE"
    let semester = "Sem 3"
    let type = "PDF"
    let size = "2.1 MB"
    let fileUrl = "https://pub-campuscore.r2.dev/vault/sample_document.pdf"

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      title = (formData.get("title") as string) || ""
      author = (formData.get("author") as string) || "Faculty Contributor"
      branch = (formData.get("branch") as string) || "CSE"
      semester = (formData.get("semester") as string) || "Sem 3"
      type = (formData.get("type") as string) || "PDF"

      const file = formData.get("file") as File | null
      if (file && typeof file === "object" && file.size > 0) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
        size = `${sizeMb} MB`
        fileUrl = await uploadDocumentToR2(buffer, file.name, file.type)
      }
    } else {
      const body = await req.json()
      title = body.title
      author = body.author || "Faculty Contributor"
      branch = body.branch || "CSE"
      semester = body.semester || "Sem 3"
      type = body.type || "PDF"
      size = body.size || "1.8 MB"
      if (body.fileUrl) fileUrl = body.fileUrl
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      )
    }

    const newItem = await VaultItem.create({
      title: title.trim(),
      author: author.trim(),
      branch,
      semester,
      type,
      size,
      fileUrl,
      downloadCount: 0,
      flagged: false,
      flaggedCount: 0,
    })

    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (err: any) {
    console.error("Error creating vault item:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
