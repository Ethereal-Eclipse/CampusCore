"use client"

import React from "react"

interface ModuleHeaderProps {
  title: string
  description: string
  actionButtonText?: string
  onAction?: () => void
  children?: React.ReactNode
}

export function ModuleHeader({
  title,
  description,
  actionButtonText,
  onAction,
  children,
}: ModuleHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px] bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
      <div>
        <h1 className="text-[24px] font-bold text-[var(--color-navy)] mb-[4px]">
          {title}
        </h1>
        <p className="text-[var(--color-mut)] text-[14px]">{description}</p>
      </div>

      <div className="flex items-center gap-[12px] w-full sm:w-auto">
        {children}
        {actionButtonText && (
          <button
            onClick={onAction}
            className="px-[20px] py-[10px] rounded-full bg-[var(--color-navy)] text-white font-semibold text-[14px] transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(30,58,138,0.25)] active:scale-[0.98] cursor-pointer whitespace-nowrap shadow-sm"
          >
            {actionButtonText}
          </button>
        )}
      </div>
    </header>
  )
}
