"use client"

import { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
  value: string | number
  label: string
  subtext?: string
  badge?: {
    text: string
    variant?: "danger" | "success" | "warning" | "info" | "purple"
  }
  cardGradient?: string
  onClick?: () => void
}

export function StatCard({
  icon: Icon,
  iconBg = "bg-[var(--color-card-ref)]",
  iconColor = "text-[var(--color-navy)]",
  value,
  label,
  subtext,
  badge,
  cardGradient,
  onClick,
}: StatCardProps) {
  const badgeClasses = {
    danger: "text-[#ef4444] bg-[#ef4444]/10",
    success: "text-[#10b981] bg-[#10b981]/10",
    warning: "text-[#f59e0b] bg-[#f59e0b]/10",
    info: "text-[#3b82f6] bg-[#3b82f6]/10",
    purple: "text-[#7c3aed] bg-[#7c3aed]/10",
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-[18px] p-[22px] border border-[var(--color-line)] shadow-[var(--shadow-sh)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(30,58,138,0.08)] cursor-pointer group flex flex-col justify-between ${
        cardGradient
          ? cardGradient
          : "bg-[var(--color-card-ref)] hover:border-[var(--color-navy)]/30"
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-[14px]">
          <span
            className={`w-[44px] h-[44px] rounded-[13px] grid place-items-center shadow-[0_2px_8px_rgba(30,58,138,0.08)] transition-transform duration-200 group-hover:scale-105 ${iconBg} ${iconColor}`}
          >
            <Icon className="w-[20px] h-[20px]" />
          </span>
          {badge && (
            <span
              className={`text-[11px] font-semibold px-[8px] py-[3px] rounded-md ${
                badgeClasses[badge.variant || "info"]
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        <div className="text-[32px] leading-[1.1] font-bold text-[var(--color-ink)] mb-[4px]">
          {value}
        </div>
        <div className="text-[var(--color-mut)] text-[14px] font-medium">
          {label}
        </div>
      </div>
      {subtext && (
        <div className="text-[12px] text-[var(--color-mut)] mt-[8px] pt-[8px] border-t border-[var(--color-line)]/50">
          {subtext}
        </div>
      )}
    </div>
  )
}
