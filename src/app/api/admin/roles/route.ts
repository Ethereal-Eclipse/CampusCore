import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions, isAdminEmail } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import User from "@/models/User"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 },
      )
    }

    await connectDB()
    const admins = await User.find({ role: "admin" })
      .select("name email role createdAt")
      .lean()

    return NextResponse.json({ success: true, admins })
  } catch (err: any) {
    console.error("Error fetching admins:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 403 },
      )
    }

    const body = await req.json()
    const { email, name } = body

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required" },
        { status: 400 },
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    await connectDB()

    let user = await User.findOne({ email: cleanEmail })
    if (user) {
      user.role = "admin"
      if (name?.trim()) user.name = name.trim()
      await user.save()
    } else {
      user = await User.create({
        name: name?.trim() || "Administrator",
        email: cleanEmail,
        role: "admin",
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: `Admin access granted to ${cleanEmail}`,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    )
  } catch (err: any) {
    console.error("Error updating admin role:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    )
  }
}
