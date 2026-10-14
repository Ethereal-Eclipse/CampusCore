"use client"

import { Search } from "@/components/ui/Icons"

export interface LostFoundData {
  id?: string
  title: string
  location: string
  type: "Lost" | "Found" | string
  color?: string
  date: string
  image?: string
}

interface LostFoundCardProps {
  item: LostFoundData
  onClick?: () => void
}

export function LostFoundCard({ item, onClick }: LostFoundCardProps) {
  const typeColors: Record<string, string> = {
    Lost: "bg-[#ffecee] text-[#ef4444]",
    Found: "bg-[#e4f9ee] text-[#10b981]",
  }

  const badgeColor =
    item.color || typeColors[item.type] || "bg-[#ffecee] text-[#ef4444]"

  return (
    <div
      onClick={onClick}
      className="flex gap-[16px] bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[20px] shadow-[var(--shadow-sh)] transition-all duration-200 hover:shadow-[0_14px_34px_rgba(30,58,138,0.1)] hover:-translate-y-[2px] hover:border-[var(--color-navy)]/30 cursor-pointer group"
    >
      <div className="w-[80px] h-[80px] bg-[var(--color-bg)] rounded-[12px] border border-[var(--color-line)] flex items-center justify-center shrink-0 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Search className="w-8 h-8 text-[var(--color-mut)] opacity-30 group-hover:scale-110 transition-transform duration-200" />
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-[4px] gap-[8px]">
          <h4 className="font-semibold text-[var(--color-ink)] text-[16px] line-clamp-1">
            {item.title}
          </h4>
          <span
            className={`px-[10px] py-[2px] rounded-full text-[11px] font-bold shrink-0 ${badgeColor}`}
          >
            {item.type}
          </span>
        </div>
        <p className="text-[var(--color-mut)] text-[13px]">{item.location}</p>
        <p className="text-[var(--color-mut)] text-[12px] mt-2 opacity-70">
          Posted {item.date}
        </p>
      </div>
    </div>
  )
}
