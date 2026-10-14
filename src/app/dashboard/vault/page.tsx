import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Search } from "@/components/ui/Icons"
import { ModuleHeader } from "@/components/layout/ModuleHeader"
import { ResourceCard, ResourceData } from "@/components/vault/ResourceCard"
import { AdminVaultView } from "@/components/vault/AdminVaultView"

export const instant = false

export default async function VaultPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin"

  if (isAdmin) {
    return <AdminVaultView />
  }

  const dummyResources: ResourceData[] = [
    {
      title: "Data Structures Notes",
      author: "Prof. Smith",
      type: "PDF",
      size: "2.4 MB",
      branch: "CSE",
      semester: "Sem 3",
    },
    {
      title: "DBMS PYQs (2020-2023)",
      author: "CSE Dept",
      type: "ZIP",
      size: "15 MB",
      branch: "IT",
      semester: "Sem 5",
    },
    {
      title: "OS Lab Manual",
      author: "Dr. Johnson",
      type: "PDF",
      size: "1.1 MB",
      branch: "CSE",
      semester: "Sem 4",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Academic Vault"
        description="Access notes, PYQs, and lab manuals."
      >
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--color-mut)]" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-full py-[10px] pl-[40px] pr-[16px] text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors cursor-text"
          />
        </div>
      </ModuleHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {dummyResources.map((res, i) => (
          <ResourceCard key={i} resource={res} />
        ))}
      </div>
    </div>
  )
}
