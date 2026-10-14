"use client"

import { Book, Dl } from "@/components/ui/Icons"

export interface ResourceData {
  id?: string
  title: string
  author: string
  type: string
  size: string
  color?: string
  branch?: string
  semester?: string
}

interface ResourceCardProps {
  resource: ResourceData
  onDownload?: (res: ResourceData) => void
  onClick?: () => void
}

export function ResourceCard({
  resource,
  onDownload,
  onClick,
}: ResourceCardProps) {
  const typeColors: Record<string, string> = {
    PDF: "bg-[#e8f1ff] text-[#3b82f6]",
    ZIP: "bg-[#f5ebff] text-[#a855f7]",
    DOC: "bg-[#e4f9ee] text-[#10b981]",
    PPT: "bg-[#fff6dc] text-[#f59e0b]",
  }

  const badgeColor =
    resource.color ||
    typeColors[resource.type.toUpperCase()] ||
    "bg-[#e8f1ff] text-[#3b82f6]"

  return (
    <article
      onClick={onClick}
      className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[20px] shadow-[var(--shadow-sh)] flex flex-col justify-between transition-all duration-200 hover:shadow-[0_14px_34px_rgba(30,58,138,0.1)] hover:-translate-y-[2px] hover:border-[var(--color-navy)]/30 cursor-pointer group"
    >
      <div>
        <div className="flex justify-between items-start mb-[16px]">
          <div
            className={`w-[48px] h-[48px] rounded-[12px] grid place-items-center transition-transform duration-200 group-hover:scale-105 ${badgeColor}`}
          >
            <Book className="w-[24px] h-[24px]" />
          </div>
          <span
            className={`px-[10px] py-[3px] rounded-full text-[11px] font-bold ${badgeColor}`}
          >
            {resource.type}
          </span>
        </div>

        <h4 className="font-semibold text-[16px] text-[var(--color-ink)] mb-[6px] line-clamp-2">
          {resource.title}
        </h4>
        <p className="text-[var(--color-mut)] text-[13px] mb-[16px]">
          By {resource.author}
          {resource.branch && ` • ${resource.branch}`}
          {resource.semester && ` • ${resource.semester}`}
        </p>
      </div>

      <div className="flex justify-between items-center pt-[14px] border-t border-[var(--color-line)] mt-auto">
        <span className="text-[12px] font-medium text-[var(--color-mut)]">
          {resource.size}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDownload?.(resource)
          }}
          className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] font-semibold text-[var(--color-ink)] transition-all hover:bg-[var(--color-navy)] hover:text-white hover:border-[var(--color-navy)] active:scale-95 cursor-pointer"
        >
          <Dl className="w-[14px] h-[14px]" />
          Download
        </button>
      </div>
    </article>
  )
}
