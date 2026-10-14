import { ModuleHeader } from "@/components/layout/ModuleHeader"
import { ProductCard, ProductData } from "@/components/marketplace/ProductCard"

export const instant = false

export default async function MarketplacePage() {
  const dummyItems: ProductData[] = [
    {
      title: "Casio Scientific Calculator",
      price: "₹450",
      condition: "Like New",
      seller: "Rohan (CSE)",
    },
    {
      title: "Engineering Drawing Kit",
      price: "₹200",
      condition: "Good",
      seller: "Priya (ME)",
    },
    {
      title: "Table Lamp",
      price: "₹350",
      condition: "Fair",
      seller: "Amit (ECE)",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Marketplace"
        description="Buy and sell items within the campus community."
        actionButtonText="+ Sell Item"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {dummyItems.map((item, i) => (
          <ProductCard key={i} item={item} />
        ))}
      </div>
    </div>
  )
}
