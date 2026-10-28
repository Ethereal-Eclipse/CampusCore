import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminVaultView } from "@/components/vault/AdminVaultView"
import { StudentVaultView } from "@/components/vault/StudentVaultView"

export const instant = false

export default async function VaultPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin"

  if (isAdmin) {
    return <AdminVaultView />
  }

  return <StudentVaultView />
}
