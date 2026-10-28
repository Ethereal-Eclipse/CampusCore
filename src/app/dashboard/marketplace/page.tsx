import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminMarketplaceView } from "@/components/marketplace/AdminMarketplaceView"
import { StudentMarketplaceView } from "@/components/marketplace/StudentMarketplaceView"

export const instant = false

export default async function MarketplacePage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin"

  if (isAdmin) {
    return <AdminMarketplaceView />
  }

  return <StudentMarketplaceView />
}
