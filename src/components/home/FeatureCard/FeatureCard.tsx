import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  description: string
}

export function FeatureCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="bg-[color-mix(in_srgb,var(--color-card-ref)_60%,var(--color-bg))] border border-[var(--color-line)] rounded-[18px] p-[32px] transition-all duration-200 hover:bg-[var(--color-card-ref)] hover:shadow-[0_14px_34px_rgba(30,58,138,0.1)] hover:-translate-y-[3px] cursor-pointer group">
      <div
        className={`w-[56px] h-[56px] rounded-[15px] grid place-items-center mb-[26px] ${iconBg} ${iconColor} transition-transform duration-200 group-hover:scale-105`}
      >
        <Icon className="w-[28px] h-[28px]" />
      </div>
      <h3 className="text-[20px] font-bold mb-[10px] text-[var(--color-ink)]">
        {title}
      </h3>
      <p className="text-[var(--color-mut)] text-[15px] leading-relaxed">
        {description}
      </p>
    </article>
  )
}
