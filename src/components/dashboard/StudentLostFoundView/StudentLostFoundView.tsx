"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ModuleHeader } from "@/components/layout/ModuleHeader"
import {
  LostFoundCard,
  LostFoundData,
} from "@/components/dashboard/LostFoundCard"
import {
  Search,
  CheckCircle,
  Plus,
  Pin,
  Clock,
  AlertTriangle,
} from "@/components/ui/Icons"

const TABS = ["All", "Lost", "Found"]

interface LostFoundItemDoc {
  _id: string
  title: string
  location: string
  type: "Lost" | "Found"
  category: string
  description?: string
  imageUrl?: string
  date: string
  status: string
  turnedInBy?: string
  contactEmail?: string
  createdAt?: string
}

export function StudentLostFoundView() {
  const { data: session } = useSession()
  const [items, setItems] = useState<LostFoundItemDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedTab, setSelectedTab] = useState("All")

  // Report modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [reportType, setReportType] = useState<"Lost" | "Found">("Lost")
  const [category, setCategory] = useState("Electronics")
  const [description, setDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Detail modal state
  const [selectedItem, setSelectedItem] = useState<LostFoundItemDoc | null>(
    null,
  )

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3500)
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedTab !== "All") params.set("type", selectedTab)
      if (search.trim()) params.set("search", search.trim())

      const res = await fetch(`/api/lost-found?${params.toString()}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items)
      }
    } catch (err) {
      console.error("Failed to fetch lost-found items:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [selectedTab])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchItems()
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !location.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("location", location.trim())
      formData.append("type", reportType)
      formData.append("category", category)
      formData.append("description", description.trim())
      formData.append(
        "contactEmail",
        contactEmail.trim() || session?.user?.email || "student@glbitm.ac.in",
      )
      formData.append(
        "turnedInBy",
        session?.user?.name || "Student Contributor",
      )

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const res = await fetch("/api/lost-found", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.item) {
        setItems((prev) => [data.item, ...prev])
        setIsReportModalOpen(false)
        setTitle("")
        setLocation("")
        setDescription("")
        setImageFile(null)
        triggerToast(
          "Campus notice published with Cloudinary photo verification.",
        )
      }
    } catch (err) {
      console.error("Failed to publish lost/found notice:", err)
      triggerToast("Failed to report item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClaim = async (itemId: string) => {
    try {
      const res = await fetch(`/api/lost-found/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_claimed" }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((it) =>
            it._id === itemId ? { ...it, status: "Claimed" } : it,
          ),
        )
        setSelectedItem(null)
        triggerToast("Item marked as claimed / resolved.")
      }
    } catch (err) {
      console.error("Failed to mark item claimed:", err)
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Lost & Found"
        description="Help campus belongings find their way back home. Report lost gear or turn in found items."
        actionButtonText="+ Report Item"
        onAction={() => setIsReportModalOpen(true)}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full sm:w-[300px]"
        >
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--color-mut)]" />
          <input
            type="text"
            placeholder="Search items, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-full py-[10px] pl-[40px] pr-[16px] text-[14px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors cursor-text"
          />
        </form>
      </ModuleHeader>

      {/* Tabs */}
      <div className="flex items-center gap-[10px]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-[16px] py-[8px] rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
              selectedTab === tab
                ? "bg-[var(--color-navy)] text-white shadow-sm"
                : "bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[var(--color-mut)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {toastMessage && (
        <div className="p-[12px_16px] rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] flex items-center gap-[8px]">
          <CheckCircle className="w-[16px] h-[16px]" />
          {toastMessage}
        </div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="p-[48px] text-center text-[var(--color-mut)] text-[14px]">
          Loading campus belongings...
        </div>
      ) : items.length === 0 ? (
        <div className="p-[48px] text-center text-[var(--color-mut)] text-[14px] border border-dashed border-[var(--color-line)] rounded-[20px]">
          No {selectedTab.toLowerCase()} items reported. Campus is tidy!
        </div>
      ) : (
        <section
          aria-label="Lost and found items catalog"
          className="grid grid-cols-1 md:grid-cols-2 gap-[20px]"
        >
          {items.map((doc) => {
            const cardData: LostFoundData = {
              id: doc._id,
              title: doc.title,
              location: doc.location,
              type: doc.type,
              date: doc.date || "Recently",
              image: doc.imageUrl,
            }
            return (
              <div key={doc._id} onClick={() => setSelectedItem(doc)}>
                <LostFoundCard item={cardData} />
              </div>
            )
          })}
        </section>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-[16px]">
          <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px] w-full max-w-[480px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="flex items-center gap-[10px]">
                <Plus className="w-[20px] h-[20px] text-amber-500" />
                <h3 className="text-[18px] font-bold text-[var(--color-ink)]">
                  Report Item
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-[var(--color-mut)] hover:text-[var(--color-ink)] text-[20px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleReportSubmit}
              className="flex flex-col gap-[14px]"
            >
              <div className="grid grid-cols-2 gap-[10px]">
                <button
                  type="button"
                  onClick={() => setReportType("Lost")}
                  className={`py-[9px] rounded-[10px] text-[13px] font-bold cursor-pointer transition-all border ${
                    reportType === "Lost"
                      ? "bg-red-500/15 text-red-500 border-red-500/40"
                      : "bg-[var(--color-bg)] border-[var(--color-line)] text-[var(--color-mut)]"
                  }`}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setReportType("Found")}
                  className={`py-[9px] rounded-[10px] text-[13px] font-bold cursor-pointer transition-all border ${
                    reportType === "Found"
                      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/40"
                      : "bg-[var(--color-bg)] border-[var(--color-line)] text-[var(--color-mut)]"
                  }`}
                >
                  I Found Something
                </button>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Item Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navy Blue Milton Thermosteel Bottle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Library 2nd Floor Reading Hall"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Personal Belongings">
                      Personal Belongings
                    </option>
                    <option value="Documents / ID">Documents / ID Cards</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Contact Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@glbitm.ac.in"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Identification marks, unique stickers, time noticed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] resize-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Photo (Cloudinary Verification Image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-[12px] py-[7px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] text-[var(--color-mut)] outline-none file:mr-[10px] file:py-[4px] file:px-[10px] file:rounded-[6px] file:border-0 file:text-[12px] file:bg-amber-600/10 file:text-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-[10px] mt-[10px]">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
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
                    : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-[16px]">
          <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px] w-full max-w-[460px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-[14px]">
              <span
                className={`px-[10px] py-[2px] rounded-full text-[11px] font-bold ${
                  selectedItem.type === "Lost"
                    ? "bg-[#ffecee] text-[#ef4444]"
                    : "bg-[#e4f9ee] text-[#10b981]"
                }`}
              >
                {selectedItem.type} Notice
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-[var(--color-mut)] hover:text-[var(--color-ink)] text-[20px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedItem.imageUrl && (
              <div className="aspect-[16/9] bg-[var(--color-bg)] rounded-[12px] border border-[var(--color-line)] mb-[16px] overflow-hidden">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h3 className="text-[18px] font-bold text-[var(--color-ink)] mb-[6px]">
              {selectedItem.title}
            </h3>

            <div className="flex flex-col gap-[6px] text-[13px] text-[var(--color-mut)] mb-[14px]">
              <div className="flex items-center gap-[6px]">
                <Pin className="w-[14px] h-[14px] text-amber-500" />
                <span>{selectedItem.location}</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <Clock className="w-[14px] h-[14px]" />
                <span>Reported {selectedItem.date || "recently"}</span>
              </div>
            </div>

            {selectedItem.description && (
              <p className="text-[13px] text-[var(--color-ink)] mb-[16px] bg-[var(--color-bg)] p-[12px] rounded-[10px] border border-[var(--color-line)]">
                {selectedItem.description}
              </p>
            )}

            <div className="flex items-center justify-between gap-[10px] mt-[10px]">
              {selectedItem.contactEmail ? (
                <a
                  href={`mailto:${selectedItem.contactEmail}?subject=Regarding ${encodeURIComponent(selectedItem.title)} on CampusCore`}
                  className="px-[16px] py-[9px] rounded-[10px] bg-[var(--color-navy)] text-white text-[13px] font-semibold hover:opacity-95"
                >
                  Contact Finder / Reporter
                </a>
              ) : (
                <div />
              )}
              {selectedItem.status !== "Claimed" && (
                <button
                  type="button"
                  onClick={() => handleClaim(selectedItem._id)}
                  className="px-[14px] py-[9px] rounded-[10px] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[12px] font-semibold cursor-pointer"
                >
                  Mark Claimed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
