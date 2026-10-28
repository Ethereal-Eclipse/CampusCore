import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminLostFoundView } from "@/components/dashboard/AdminLostFoundView"
import { StudentLostFoundView } from "@/components/dashboard/StudentLostFoundView"

export const instant = false

export default async function LostFoundPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin"

  if (isAdmin) {
    return <AdminLostFoundView />
  }

  return <StudentLostFoundView />
}
