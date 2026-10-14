import { Cart } from "@/components/ui/Icons"

export const instant = false

export default async function MarketplacePage() {
  const dummyItems = [
    {
      title: "Casio Scientific Calculator",
      price: "₹450",
      condition: "Like New",
      seller: "Rohan (CSE)",
      color: "bg-[#e4f9ee] text-[#10b981]",
    },
    {
      title: "Engineering Drawing Kit",
      price: "₹200",
      condition: "Good",
      seller: "Priya (ME)",
      color: "bg-[#e8f1ff] text-[#3b82f6]",
    },
    {
      title: "Table Lamp",
      price: "₹350",
      condition: "Fair",
      seller: "Amit (ECE)",
      color: "bg-[#fff6dc] text-[#f59e0b]",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex justify-between items-center bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div>
          <h2 className="text-[24px] font-bold text-[var(--color-navy)] mb-[4px]">
            Marketplace
          </h2>
          <p className="text-[var(--color-mut)] text-[14px]">
            Buy and sell items within the campus.
          </p>
        </div>
        <button className="px-[20px] py-[10px] rounded-full bg-[var(--color-navy)] text-white font-semibold text-[14px] transition-all hover:-translate-y-[1px] shadow-sm">
          + Sell Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {dummyItems.map((item, i) => (
          <div
            key={i}
            className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[20px] shadow-[var(--shadow-sh)] flex flex-col transition-all hover:shadow-[0_14px_34px_rgba(30,58,138,0.1)] hover:-translate-y-[2px]"
          >
            <div className="aspect-[4/3] bg-[var(--color-bg)] rounded-[12px] mb-[16px] grid place-items-center text-[var(--color-mut)] border border-[var(--color-line)]">
              <Cart className="w-[32px] h-[32px] opacity-40" />
            </div>
            <div className="flex justify-between items-start mb-[6px]">
              <h4 className="font-semibold text-[var(--color-ink)] text-[16px]">
                {item.title}
              </h4>
              <span className="font-bold text-[var(--color-navy)]">
                {item.price}
              </span>
            </div>
            <div className="flex justify-between items-center mt-auto pt-[12px]">
              <p className="text-[var(--color-mut)] text-[13px]">
                Sold by {item.seller}
              </p>
              <span
                className={`px-[10px] py-[4px] rounded-[6px] text-[11px] font-medium ${item.color}`}
              >
                {item.condition}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
