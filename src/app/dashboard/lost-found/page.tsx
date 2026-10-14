import { Search } from "@/components/ui/Icons"

export const instant = false

export default async function LostFoundPage() {
  const dummyItems = [
    {
      title: "Blue Water Bottle",
      location: "Library 2nd Floor",
      type: "Lost",
      color: "bg-[#ffecee] text-[#ef4444]",
      date: "Today",
    },
    {
      title: "Wireless Mouse",
      location: "Lab 4",
      type: "Found",
      color: "bg-[#e4f9ee] text-[#10b981]",
      date: "Yesterday",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex justify-between items-center bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div>
          <h2 className="text-[24px] font-bold text-[var(--color-navy)] mb-[4px]">
            Lost & Found
          </h2>
          <p className="text-[var(--color-mut)] text-[14px]">
            Help belongings find their way back.
          </p>
        </div>
        <button className="px-[20px] py-[10px] rounded-full bg-[var(--color-navy)] text-white font-semibold text-[14px] transition-all hover:-translate-y-[1px] shadow-sm">
          + Report Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {dummyItems.map((item, i) => (
          <div
            key={i}
            className="flex gap-[16px] bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[20px] shadow-[var(--shadow-sh)] transition-all hover:shadow-[0_14px_34px_rgba(30,58,138,0.1)] hover:-translate-y-[2px]"
          >
            <div className="w-[80px] h-[80px] bg-[var(--color-bg)] rounded-[12px] border border-[var(--color-line)] flex items-center justify-center">
              <Search className="w-8 h-8 text-[var(--color-mut)] opacity-30" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-[4px]">
                <h4 className="font-semibold text-[var(--color-ink)] text-[16px]">
                  {item.title}
                </h4>
                <span
                  className={`px-[10px] py-[2px] rounded-full text-[11px] font-bold ${item.color}`}
                >
                  {item.type}
                </span>
              </div>
              <p className="text-[var(--color-mut)] text-[13px]">
                {item.location}
              </p>
              <p className="text-[var(--color-mut)] text-[12px] mt-2 opacity-70">
                Posted {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
