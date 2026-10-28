"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ModuleHeader } from "@/components/layout/ModuleHeader"
import { ProductCard, ProductData } from "@/components/marketplace/ProductCard"
import {
  Search,
  Cart,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "@/components/ui/Icons"

const CATEGORIES = ["All", "Academic", "Electronics", "Stationery", "Hostel"]

interface MarketplaceItemDoc {
  _id: string
  title: string
  price: string
  condition: string
  category: string
  description?: string
  seller: {
    name: string
    email: string
    branch: string
    phone?: string
  }
  imageUrl: string
  status: string
  createdAt?: string
}

export function StudentMarketplaceView() {
  const { data: session } = useSession()
  const [items, setItems] = useState<MarketplaceItemDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Sell modal state
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [condition, setCondition] = useState("Like New")
  const [category, setCategory] = useState("Academic")
  const [description, setDescription] = useState("")
  const [phone, setPhone] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Contact modal state
  const [contactItem, setContactItem] = useState<MarketplaceItemDoc | null>(
    null,
  )
  const [isReporting, setIsReporting] = useState(false)
  const [reportReason, setReportReason] = useState("")

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3500)
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "All") params.set("category", selectedCategory)
      if (search.trim()) params.set("search", search.trim())

      const res = await fetch(`/api/marketplace?${params.toString()}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items)
      }
    } catch (err) {
      console.error("Failed to fetch marketplace items:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [selectedCategory])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchItems()
  }

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !price.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("price", price.startsWith("₹") ? price : `₹${price}`)
      formData.append("condition", condition)
      formData.append("category", category)
      formData.append("description", description.trim())
      formData.append("sellerName", session?.user?.name || "Student Seller")
      formData.append(
        "sellerEmail",
        session?.user?.email || "student@glbitm.ac.in",
      )
      formData.append("sellerBranch", "CSE")
      if (phone.trim()) formData.append("sellerPhone", phone.trim())
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const res = await fetch("/api/marketplace", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.item) {
        setItems((prev) => [data.item, ...prev])
        setIsSellModalOpen(false)
        setTitle("")
        setPrice("")
        setDescription("")
        setPhone("")
        setImageFile(null)
        triggerToast(
          "Item listed on campus marketplace with Cloudinary image sync.",
        )
      }
    } catch (err) {
      console.error("Failed to list item:", err)
      triggerToast("Listing failed. Please check inputs.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReportListing = async (itemId: string) => {
    if (!reportReason.trim()) return
    try {
      const res = await fetch(`/api/marketplace/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "report",
          reason: reportReason.trim(),
        }),
      })
      if (res.ok) {
        setContactItem(null)
        setIsReporting(false)
        setReportReason("")
        triggerToast("Listing grievance submitted to Trust & Safety Desk.")
      }
    } catch (err) {
      console.error("Failed to report listing:", err)
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Marketplace"
        description="Buy and sell pre-loved academic gear, electronics, and dorm essentials within campus."
        actionButtonText="+ Sell Item"
        onAction={() => setIsSellModalOpen(true)}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full sm:w-[300px]"
        >
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--color-mut)]" />
          <input
            type="text"
            placeholder="Search items, sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-full py-[10px] pl-[40px] pr-[16px] text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors cursor-text"
          />
        </form>
      </ModuleHeader>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-[10px] overflow-x-auto pb-[4px]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-[16px] py-[8px] rounded-full text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-[var(--color-navy)] text-white shadow-sm"
                : "bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[var(--color-mut)] hover:text-[var(--color-ink)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {toastMessage && (
        <div className="p-[12px_16px] rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] flex items-center gap-[8px]">
          <CheckCircle className="w-[16px] h-[16px]" />
          {toastMessage}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="p-[48px] text-center text-[var(--color-mut)] text-[14px]">
          Loading marketplace items...
        </div>
      ) : items.length === 0 ? (
        <div className="p-[48px] text-center text-[var(--color-mut)] text-[14px] border border-dashed border-[var(--color-line)] rounded-[20px]">
          No items found in {selectedCategory}. Be the first to list one!
        </div>
      ) : (
        <section
          aria-label="Marketplace listings catalog"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]"
        >
          {items.map((doc) => {
            const cardData: ProductData = {
              id: doc._id,
              title: doc.title,
              price: doc.price,
              condition: doc.condition,
              seller: `${doc.seller?.name || "Student"} (${doc.seller?.branch || "Campus"})`,
              image: doc.imageUrl,
            }
            return (
              <ProductCard
                key={doc._id}
                item={cardData}
                onContact={() => setContactItem(doc)}
                onClick={() => setContactItem(doc)}
              />
            )
          })}
        </section>
      )}

      {/* Sell Item Modal */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-[16px]">
          <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px] w-full max-w-[500px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="flex items-center gap-[10px]">
                <Cart className="w-[20px] h-[20px] text-emerald-500" />
                <h3 className="text-[18px] font-bold text-[var(--color-ink)]">
                  List Item for Sale
                </h3>
              </div>
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="text-[var(--color-mut)] hover:text-[var(--color-ink)] text-[20px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSellSubmit}
              className="flex flex-col gap-[14px]"
            >
              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio fx-991EX ClassWiz Calculator"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                    Expected Price (₹)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="450"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Description / Item Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Battery condition, purchase year, meeting point preference..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] resize-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Photo (Cloudinary Image Upload)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-[12px] py-[7px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] text-[var(--color-mut)] outline-none file:mr-[10px] file:py-[4px] file:px-[10px] file:rounded-[6px] file:border-0 file:text-[12px] file:bg-emerald-600/10 file:text-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                <button
                  type="button"
                  onClick={() => setIsSellModalOpen(false)}
                  className="px-[16px] py-[9px] rounded-[10px] border border-[var(--color-line)] text-[13px] text-[var(--color-mut)] hover:text-[var(--color-ink)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-[20px] py-[9px] rounded-[10px] bg-[var(--color-navy)] text-white font-semibold text-[13px] hover:opacity-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting
                    ? "Uploading to Cloudinary..."
                    : "Publish Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Seller & Item Detail Modal */}
      {contactItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-[16px]">
          <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px] w-full max-w-[460px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-[14px]">
              <h3 className="text-[18px] font-bold text-[var(--color-ink)] line-clamp-1">
                {contactItem.title}
              </h3>
              <button
                onClick={() => {
                  setContactItem(null)
                  setIsReporting(false)
                }}
                className="text-[var(--color-mut)] hover:text-[var(--color-ink)] text-[20px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] bg-[var(--color-bg)] rounded-[12px] border border-[var(--color-line)] mb-[16px] overflow-hidden">
              <img
                src={contactItem.imageUrl}
                alt={contactItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-[12px]">
              <span className="text-[20px] font-bold text-[var(--color-navy)]">
                {contactItem.price}
              </span>
              <span className="px-[10px] py-[3px] rounded-full text-[12px] font-bold bg-[#e8f1ff] text-[#3b82f6]">
                {contactItem.condition}
              </span>
            </div>

            {contactItem.description && (
              <p className="text-[13px] text-[var(--color-mut)] mb-[14px]">
                {contactItem.description}
              </p>
            )}

            <div className="p-[14px] rounded-[12px] bg-[var(--color-bg)] border border-[var(--color-line)] mb-[16px] flex flex-col gap-[6px]">
              <span className="text-[11px] font-semibold text-[var(--color-mut)] uppercase tracking-wider">
                Seller Contact Details
              </span>
              <span className="text-[14px] font-semibold text-[var(--color-ink)]">
                {contactItem.seller?.name} • {contactItem.seller?.branch}
              </span>
              <a
                href={`mailto:${contactItem.seller?.email}`}
                className="text-[13px] text-blue-500 hover:underline"
              >
                {contactItem.seller?.email}
              </a>
              {contactItem.seller?.phone && (
                <span className="text-[13px] text-[var(--color-ink)] font-mono">
                  {contactItem.seller?.phone}
                </span>
              )}
            </div>

            {isReporting ? (
              <div className="p-[14px] rounded-[12px] bg-red-500/10 border border-red-500/20 mb-[16px] flex flex-col gap-[10px]">
                <span className="text-[12px] font-bold text-red-400">
                  Report Listing to Trust &amp; Safety
                </span>
                <input
                  type="text"
                  placeholder="Reason (e.g. counterfeit, unresponsive seller)"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-[12px] py-[7px] rounded-[8px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] text-[var(--color-ink)] outline-none focus:border-red-500"
                />
                <div className="flex items-center justify-end gap-[8px]">
                  <button
                    onClick={() => setIsReporting(false)}
                    className="px-[12px] py-[5px] text-[12px] text-[var(--color-mut)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReportListing(contactItem._id)}
                    className="px-[14px] py-[5px] rounded-[8px] bg-red-600 text-white font-semibold text-[12px]"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-[10px]">
              {!isReporting && (
                <button
                  type="button"
                  onClick={() => setIsReporting(true)}
                  className="text-[12px] text-red-400 hover:underline cursor-pointer"
                >
                  Report Listing
                </button>
              )}
              <div className="flex items-center gap-[10px] ml-auto">
                {contactItem.seller?.phone ? (
                  <a
                    href={`https://wa.me/${contactItem.seller.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-[18px] py-[9px] rounded-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[13px] transition-all"
                  >
                    Chat on WhatsApp
                  </a>
                ) : (
                  <a
                    href={`mailto:${contactItem.seller?.email}?subject=Interested in ${encodeURIComponent(contactItem.title)} on CampusCore`}
                    className="px-[18px] py-[9px] rounded-[10px] bg-[var(--color-navy)] hover:opacity-95 text-white font-semibold text-[13px] transition-all"
                  >
                    Email Seller
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
