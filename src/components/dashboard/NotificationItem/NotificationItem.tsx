import React from "react"
import { Bell } from "@/components/ui/Icons"

export interface NotificationData {
  id?: string
  title: string
  desc: string
  time: string
  read: boolean
  icon?: React.ReactNode
  color?: string
}

interface NotificationItemProps {
  notification: NotificationData
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <article
      className={`flex gap-[16px] p-[16px] rounded-[14px] border border-[var(--color-line)] transition-all duration-200 cursor-pointer hover:shadow-[0_4px_16px_rgba(30,58,138,0.06)] hover:-translate-y-[1px] ${
        notification.read
          ? "bg-[var(--color-bg)] opacity-75 hover:opacity-100 hover:border-[var(--color-navy)]/30"
          : "bg-[color-mix(in_srgb,var(--color-card-ref)_85%,var(--color-blue-ref))] hover:border-[var(--color-navy)]/50"
      }`}
    >
      <div
        className={`w-[40px] h-[40px] rounded-full grid place-items-center shrink-0 transition-transform duration-200 hover:scale-105 ${
          notification.color || "bg-[#e8f1ff] text-[#3b82f6]"
        }`}
      >
        {notification.icon || <Bell className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start gap-[8px]">
          <h4 className="font-semibold text-[var(--color-ink)] text-[15px]">
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="w-[8px] h-[8px] rounded-full bg-[var(--color-navy)] mt-[6px] shrink-0" />
          )}
        </div>
        <p className="text-[var(--color-mut)] text-[13px] mt-[2px]">
          {notification.desc}
        </p>
        <p className="text-[var(--color-mut)] text-[11px] mt-[6px]">
          {notification.time}
        </p>
      </div>
    </article>
  )
}
