import { AlertTriangle } from "@/components/ui/Icons"

interface AdminAttentionBannerProps {
  overdueCount: number
  unassignedCount: number
  isFilterActive?: boolean
  onReviewClick: () => void
  className?: string
}

export function AdminAttentionBanner({
  overdueCount,
  unassignedCount,
  isFilterActive = false,
  onReviewClick,
  className = "",
}: AdminAttentionBannerProps) {
  return (
    <aside
      role="alert"
      className={`flex items-center justify-between gap-[16px] p-[14px_18px] rounded-[12px] bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 ${className}`}
    >
      <div className="flex items-center gap-[10px] min-w-0">
        <AlertTriangle className="w-[18px] h-[18px] shrink-0" />
        <p className="text-[14px] font-medium truncate">
          {overdueCount} {overdueCount === 1 ? "ticket" : "tickets"} over 48
          hours and {unassignedCount} waiting for an owner
        </p>
      </div>

      <button
        type="button"
        onClick={onReviewClick}
        className={`px-[16px] py-[6px] rounded-full text-[13px] font-semibold transition-all cursor-pointer shrink-0 active:scale-95 ${
          isFilterActive
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-red-500/15 hover:bg-red-500/25 text-red-700 dark:text-red-300 border border-red-500/30"
        }`}
      >
        {isFilterActive ? "Clear review" : "Review"}
      </button>
    </aside>
  )
}
