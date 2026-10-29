import { TicketStatus, statusConfig } from "../types"
import {
  Wifi,
  Monitor,
  Droplet,
  AlertTriangle,
  Ticket,
} from "@/components/ui/Icons"

interface StatusChipProps {
  status: TicketStatus
  icon?: string
  className?: string
}

export function StatusChip({ status, icon, className = "" }: StatusChipProps) {
  const config = statusConfig[status] || statusConfig.pending

  const renderIcon = () => {
    if (status === "escalated") {
      return <AlertTriangle className="w-[18px] h-[18px]" />
    }

    switch (icon) {
      case "wifi":
        return <Wifi className="w-[18px] h-[18px]" />
      case "monitor":
        return <Monitor className="w-[18px] h-[18px]" />
      case "droplet":
        return <Droplet className="w-[18px] h-[18px]" />
      case "alert":
        return <AlertTriangle className="w-[18px] h-[18px]" />
      default:
        return <Ticket className="w-[18px] h-[18px]" />
    }
  }

  return (
    <div
      className={`w-[36px] h-[36px] rounded-[10px] grid place-items-center shrink-0 transition-transform ${config.chipClass} ${className}`}
    >
      {renderIcon()}
    </div>
  )
}
