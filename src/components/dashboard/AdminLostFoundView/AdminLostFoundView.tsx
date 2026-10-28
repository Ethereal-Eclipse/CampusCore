"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle, Plus, Pin, Clock } from "@/components/ui/Icons"

interface CustodyItem {
  id: string
  title: string
  location: string
  turnedInBy: string
  date: string
  status: "In Custody" | "Claimed"
}

export function AdminLostFoundView() {
  const [items, setItems] = useState<CustodyItem[]>([])
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [turnedInBy, setTurnedInBy] = useState("Security Gate 1")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const fetchCustodyItems = async () => {
    try {
      const res = await fetch("/api/lost-found")
      const data = await res.json()
      if (data.success && Array.isArray(data.items)) {
        const mapped = data.items.map((it: any) => ({
          id: it._id,
          title: it.title,
          location: it.location,
          turnedInBy: it.turnedInBy || "Campus Security Desk",
          date: it.date || "Today",
          status: (it.status === "Claimed" ? "Claimed" : "In Custody") as
            "In Custody" | "Claimed",
        }))
        setItems(mapped)
      }
    } catch (err) {
      console.error("Failed to fetch custody items:", err)
    }
  }

  useEffect(() => {
    fetchCustodyItems()
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !location.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/lost-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          location: location.trim(),
          turnedInBy,
          type: "Found",
          category: "Personal Belongings",
          description: "Logged directly at campus security desk custody",
          status: "In Custody",
        }),
      })
      const data = await res.json()
      if (data.success && data.item) {
        const newItem: CustodyItem = {
          id: data.item._id,
          title: data.item.title,
          location: data.item.location,
          turnedInBy: data.item.turnedInBy || turnedInBy,
          date: "Just now",
          status: "In Custody",
        }
        setItems((prev) => [newItem, ...prev])
        setTitle("")
        setLocation("")
        triggerToast("Item logged into campus security custody in MongoDB.")
      }
    } catch (err) {
      console.error("Failed to register custody item:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkClaimed = async (id: string) => {
    try {
      const res = await fetch(`/api/lost-found/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Claimed" }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "Claimed" } : item,
          ),
        )
        triggerToast("Item verified and handed over to owner.")
      }
    } catch (err) {
      console.error("Failed to mark item claimed:", err)
    }
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <header className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px_28px] shadow-[var(--shadow-sh)] flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[10px] mb-[6px]">
            <span className="w-[32px] h-[32px] rounded-[10px] bg-amber-500/10 text-amber-500 grid place-items-center">
              <Search className="w-[18px] h-[18px]" />
            </span>
            <h1 className="text-[22px] font-bold text-[var(--color-ink)]">
              Lost &amp; Found • Security &amp; Custody Desk
            </h1>
          </div>
          <p className="text-[14px] text-[var(--color-mut)]">
            Log security turn-ins, verify student ownership claims, and track
            recovered campus property.
          </p>
        </div>

        <span className="px-[12px] py-[6px] rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[12px] font-semibold self-start md:self-auto">
          Campus Custody Desk
        </span>
      </header>

      {toastMsg && (
        <div className="p-[12px_16px] rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] flex items-center gap-[8px]">
          <CheckCircle className="w-[16px] h-[16px]" />
          {toastMsg}
        </div>
      )}

      {/* Metric Strip */}
      <section
        aria-label="Custody metrics"
        className="grid grid-cols-2 md:grid-cols-4 gap-[14px]"
      >
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Items in Custody
          </span>
          <span className="text-[26px] font-bold text-amber-400">
            {items.filter((i) => i.status === "In Custody").length}
          </span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Returned to Owner
          </span>
          <span className="text-[26px] font-bold text-emerald-400">
            {items.filter((i) => i.status === "Claimed").length}
          </span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Security Desks
          </span>
          <span className="text-[26px] font-bold text-[var(--color-ink)]">
            3 Gates
          </span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Recovery Rate
          </span>
          <span className="text-[26px] font-bold text-blue-400">89%</span>
        </article>
      </section>

      {/* Main Grid: Log Turn-in and Custody Items */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        {/* Register Turn-in Form */}
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <Plus className="w-[18px] h-[18px] text-amber-500" />
            <h2 className="text-[16px] font-bold text-[var(--color-ink)]">
              Log Found Item to Custody
            </h2>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-[12px]">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Item Description
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Black Dell Laptop Charger (65W)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Found Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AB Block 3rd Floor Water Point"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Custody Point / Turned in By
              </label>
              <select
                value={turnedInBy}
                onChange={(e) => setTurnedInBy(e.target.value)}
                className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
              >
                <option value="Security Gate 1">
                  Security Gate 1 (Main Entrance)
                </option>
                <option value="Security Gate 2">
                  Security Gate 2 (Hostel Side)
                </option>
                <option value="Library Staff Desk">
                  Central Library Staff Desk
                </option>
                <option value="Admin Block Reception">
                  Admin Block Reception
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-[6px] py-[10px] rounded-[10px] bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[13px] transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              Add to Custody Register
            </button>
          </form>
        </article>

        {/* Custody Inventory */}
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-[16px]">
              <h2 className="text-[16px] font-bold text-[var(--color-ink)]">
                Campus Custody Inventory
              </h2>
              <span className="text-[12px] text-[var(--color-mut)] font-medium">
                {items.length} items logged
              </span>
            </div>

            <div className="flex flex-col gap-[10px]">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="p-[14px] rounded-[12px] bg-[var(--color-bg)] border border-[var(--color-line)] flex items-center justify-between gap-[14px]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-[8px] flex-wrap">
                      <h4 className="text-[14px] font-semibold text-[var(--color-ink)]">
                        {item.title}
                      </h4>
                      <span
                        className={`px-[8px] py-[2px] rounded-full text-[10px] font-bold ${
                          item.status === "In Custody"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-[12px] text-[12px] text-[var(--color-mut)] mt-[4px]">
                      <span className="flex items-center gap-[4px]">
                        <Pin className="w-[12px] h-[12px]" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-[4px]">
                        <Clock className="w-[12px] h-[12px]" />
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {item.status === "In Custody" && (
                    <button
                      type="button"
                      onClick={() => handleMarkClaimed(item.id)}
                      className="px-[10px] py-[5px] rounded-[8px] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      Verify Claim
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
