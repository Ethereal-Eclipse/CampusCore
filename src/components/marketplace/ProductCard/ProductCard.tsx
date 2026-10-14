"use client"

import { Cart } from "@/components/ui/Icons"

export interface ProductData {
  id?: string
  title: string
  price: string
  condition: string
  seller: string
  color?: string
  image?: string
}

interface ProductCardProps {
  item: ProductData
  onContact?: (item: ProductData) => void
  onClick?: () => void
}

export function ProductCard({ item, onContact, onClick }: ProductCardProps) {
  const conditionColors: Record<string, string> = {
    "Like New": "bg-[#e4f9ee] text-[#10b981]",
    Good: "bg-[#e8f1ff] text-[#3b82f6]",
    Fair: "bg-[#fff6dc] text-[#f59e0b]",
  }

  const badgeColor =
    item.color ||
    conditionColors[item.condition] ||
    "bg-[#e8f1ff] text-[#3b82f6]"

  return (
    <div
      onClick={onClick}
      className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[20px] shadow-[var(--shadow-sh)] flex flex-col justify-between transition-all duration-200 hover:shadow-[0_14px_34px_rgba(30,58,138,0.1)] hover:-translate-y-[2px] hover:border-[var(--color-navy)]/30 cursor-pointer group"
    >
      <div>
        <div className="aspect-[4/3] bg-[var(--color-bg)] rounded-[12px] mb-[16px] grid place-items-center text-[var(--color-mut)] border border-[var(--color-line)] overflow-hidden relative">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Cart className="w-[36px] h-[36px] opacity-40 group-hover:scale-110 transition-transform duration-200" />
          )}
          <span
            className={`absolute top-[10px] right-[10px] px-[10px] py-[3px] rounded-full text-[11px] font-bold ${badgeColor}`}
          >
            {item.condition}
          </span>
        </div>

        <div className="flex justify-between items-start mb-[6px] gap-[8px]">
          <h4 className="font-semibold text-[var(--color-ink)] text-[16px] line-clamp-1">
            {item.title}
          </h4>
          <span className="font-bold text-[var(--color-navy)] text-[16px] shrink-0">
            {item.price}
          </span>
        </div>

        <p className="text-[var(--color-mut)] text-[13px] mb-[16px]">
          Seller: {item.seller}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onContact?.(item)
        }}
        className="w-full py-[10px] rounded-full bg-[var(--color-navy)] text-white font-semibold text-[13px] transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer shadow-sm"
      >
        Contact Seller
      </button>
    </div>
  )
}
