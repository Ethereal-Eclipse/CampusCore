import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ModuleHeader } from "@/components/layout/ModuleHeader"
import {
  LostFoundCard,
  LostFoundData,
} from "@/components/dashboard/LostFoundCard"
import { AdminLostFoundView } from "@/components/dashboard/AdminLostFoundView"

export const instant = false

export default async function LostFoundPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin"

  if (isAdmin) {
    return <AdminLostFoundView />
  }

  const dummyItems: LostFoundData[] = [
    {
      title: "Blue Water Bottle",
      location: "Library 2nd Floor",
      type: "Lost",
      date: "Today",
    },
    {
      title: "Wireless Mouse",
      location: "Lab 4",
      type: "Found",
      date: "Yesterday",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Lost & Found"
        description="Help campus belongings find their way back home."
        actionButtonText="+ Report Item"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {dummyItems.map((item, i) => (
          <LostFoundCard key={i} item={item} />
        ))}
      </div>
    </div>
  )
}
