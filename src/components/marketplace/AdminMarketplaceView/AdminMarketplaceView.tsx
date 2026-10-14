"use client"

import { useState } from "react"
import { Cart, AlertTriangle, Shield, CheckCircle } from "@/components/ui/Icons"

interface ReportedSeller {
  id: string
  seller: string
  email: string
  listing: string
  reports: number
  reason: string
  lastActive: string
}

const INITIAL_REPORTS: ReportedSeller[] = [
  {
    id: "user-884",
    seller: "Karan Mehta",
    email: "23019me054@glbitm.ac.in",
    listing: "Engineering Graphics Drafter Tool Set",
    reports: 4,
    reason: "Repeatedly unresponsive to buyer meeting requests (Ghosting)",
    lastActive: "1d ago",
  },
  {
    id: "user-412",
    seller: "Aman Gupta",
    email: "22019cs012@glbitm.ac.in",
    listing: "Casio fx-991EX Calculator",
    reports: 2,
    reason: "Pricing discrepancies and counterfeit product claims",
    lastActive: "3h ago",
  },
]

export function AdminMarketplaceView() {
  const [reports, setReports] = useState<ReportedSeller[]>(INITIAL_REPORTS)
  const [toastMessage, setToastMessage] = useState("")

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const handleDismiss = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
    triggerToast("Report dismissed.")
  }

  const handleWarn = (id: string, name: string) => {
    triggerToast(`Official warning issued to ${name}.`)
  }

  const handleSuspend = (id: string, name: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
    triggerToast(`Seller account ${name} suspended from campus marketplace.`)
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <header className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px_28px] shadow-[var(--shadow-sh)] flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[10px] mb-[6px]">
            <span className="w-[32px] h-[32px] rounded-[10px] bg-emerald-600/10 text-emerald-500 grid place-items-center">
              <Cart className="w-[18px] h-[18px]" />
            </span>
            <h1 className="text-[22px] font-bold text-[var(--color-ink)]">
              Marketplace • Trust &amp; Moderation Console
            </h1>
          </div>
          <p className="text-[14px] text-[var(--color-mut)]">
            Review reported sellers, investigate listing disputes, and maintain fair peer-to-peer campus trading.
          </p>
        </div>

        <span className="px-[12px] py-[6px] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[12px] font-semibold self-start md:self-auto">
          Trust &amp; Safety Admin
        </span>
      </header>

      {toastMessage && (
        <div className="p-[12px_16px] rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] flex items-center gap-[8px]">
          <CheckCircle className="w-[16px] h-[16px]" />
          {toastMessage}
        </div>
      )}

      {/* Metric Strip */}
      <section aria-label="Marketplace metrics" className="grid grid-cols-2 md:grid-cols-4 gap-[14px]">
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Active Listings
          </span>
          <span className="text-[26px] font-bold text-[var(--color-ink)]">38</span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Reported Items
          </span>
          <span className="text-[26px] font-bold text-red-400">
            {reports.length}
          </span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Resolved Flags
          </span>
          <span className="text-[26px] font-bold text-emerald-400">14</span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Trade Volume
          </span>
          <span className="text-[26px] font-bold text-[var(--color-ink)]">₹24,800</span>
        </article>
      </section>

      {/* Reported Sellers Section */}
      <section aria-label="Reported sellers and disputes" className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <div className="flex items-center justify-between mb-[16px]">
          <div className="flex items-center gap-[10px]">
            <AlertTriangle className="w-[18px] h-[18px] text-red-400" />
            <h2 className="text-[16px] font-bold text-[var(--color-ink)]">
              Reported Sellers &amp; Listing Grievances
            </h2>
          </div>
          <span className="text-[12px] text-[var(--color-mut)] font-medium">
            {reports.length} active disputes
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="p-[32px] text-center text-[var(--color-mut)] text-[13px] border border-dashed border-[var(--color-line)] rounded-[14px]">
            ✓ No reported sellers or listing disputes. Marketplace trust index is 100%.
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {reports.map((item) => (
              <article
                key={item.id}
                className="p-[16px] rounded-[14px] bg-[var(--color-bg)] border border-[var(--color-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-[8px] flex-wrap">
                    <h4 className="text-[15px] font-semibold text-[var(--color-ink)]">
                      {item.seller}
                    </h4>
                    <span className="text-[12px] text-[var(--color-mut)]">
                      ({item.email})
                    </span>
                    <span className="px-[8px] py-[2px] rounded-full bg-red-500/15 text-red-400 text-[11px] font-bold">
                      {item.reports} user reports
                    </span>
                  </div>

                  <p className="text-[13px] text-[var(--color-ink)] font-medium mt-[4px]">
                    Listing: "{item.listing}"
                  </p>
                  <p className="text-[12px] text-red-400/90 mt-[2px]">
                    Reason: {item.reason}
                  </p>
                </div>

                <div className="flex items-center gap-[8px] shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleDismiss(item.id)}
                    className="px-[12px] py-[6px] rounded-[8px] border border-[var(--color-line)] text-[12px] text-[var(--color-mut)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWarn(item.id, item.seller)}
                    className="px-[12px] py-[6px] rounded-[8px] border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    Warn
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuspend(item.id, item.seller)}
                    className="px-[12px] py-[6px] rounded-[8px] bg-red-600/20 hover:bg-red-600/30 text-red-400 text-[12px] font-semibold transition-colors cursor-pointer"
                  >
                    Suspend Seller
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
