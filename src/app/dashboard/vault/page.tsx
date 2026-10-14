import { Book, Dl, Search } from "@/components/ui/Icons"

export const instant = false

export default async function VaultPage() {
  const dummyResources = [
    {
      title: "Data Structures Notes",
      author: "Prof. Smith",
      type: "PDF",
      size: "2.4 MB",
      color: "bg-[#e8f1ff] text-[#3b82f6]",
    },
    {
      title: "DBMS PYQs (2020-2023)",
      author: "CSE Dept",
      type: "ZIP",
      size: "15 MB",
      color: "bg-[#f5ebff] text-[#a855f7]",
    },
    {
      title: "OS Lab Manual",
      author: "Dr. Johnson",
      type: "PDF",
      size: "1.1 MB",
      color: "bg-[#ffecee] text-[#ef4444]",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px] bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div>
          <h2 className="text-[24px] font-bold text-[var(--color-navy)] mb-[4px]">
            Academic Vault
          </h2>
          <p className="text-[var(--color-mut)] text-[14px]">
            Access notes, PYQs, and lab manuals.
          </p>
        </div>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--color-mut)]" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-full py-[10px] pl-[40px] pr-[16px] text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {dummyResources.map((res, i) => (
          <div
            key={i}
            className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[20px] shadow-[var(--shadow-sh)] flex flex-col transition-all hover:shadow-[0_14px_34px_rgba(30,58,138,0.1)] hover:-translate-y-[2px]"
          >
            <div
              className={`w-[48px] h-[48px] rounded-[12px] grid place-items-center mb-[16px] ${res.color}`}
            >
              <Book className="w-[24px] h-[24px]" />
            </div>
            <h4 className="font-semibold text-[var(--color-ink)] text-[16px] mb-[6px]">
              {res.title}
            </h4>
            <p className="text-[var(--color-mut)] text-[13px] mb-[16px]">
              By {res.author}
            </p>
            <div className="mt-auto flex justify-between items-center pt-[16px] border-t border-[var(--color-line)]">
              <span className="text-[12px] text-[var(--color-mut)] font-medium">
                {res.type} • {res.size}
              </span>
              <button className="text-[var(--color-navy)] hover:text-[var(--color-navy2)] transition-colors bg-[var(--color-bg)] p-[8px] rounded-full">
                <Dl className="w-[16px] h-[16px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
