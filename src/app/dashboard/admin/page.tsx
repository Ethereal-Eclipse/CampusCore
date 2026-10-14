import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Shield,
  Ticket,
  Book,
  Cart,
  AlertTriangle,
  CheckCircle,
  Upload,
  Flag,
} from "@/components/ui/Icons"
import { StatCard } from "@/components/dashboard/StatCard"
import { TicketProvider } from "@/components/tickets/TicketContext"
import { AdminManagementList } from "@/components/tickets/AdminManagementList"

export const instant = false

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const role = session.user?.role || "student"
  const isAdmin = role === "admin"

  const dummyFlaggedResources = [
    {
      id: "vault-302",
      title: "Data Structures Hand-written Notes (Unit 4)",
      uploadedBy: "24019cs088@glbitm.ac.in",
      branch: "CSE",
      semester: "Sem 3",
      flagReason: "Incomplete pages and blurry scan quality",
      flaggedCount: 3,
    },
    {
      id: "vault-119",
      title: "Operating Systems Old Syllabus PYQs 2018",
      uploadedBy: "24019it142@glbitm.ac.in",
      branch: "IT",
      semester: "Sem 4",
      flagReason: "Outdated 2018 syllabus curriculum",
      flaggedCount: 2,
    },
  ]

  const dummyFlaggedSellers = [
    {
      id: "user-884",
      seller: "Karan Mehta",
      email: "23019me054@glbitm.ac.in",
      listing: "Engineering Graphics Drafter Tool Set",
      reports: 4,
      reason: "Repeatedly unresponsive to buyer meeting requests (Ghosting)",
      lastActive: "1d ago",
    },
  ]

  return (
    <div className="flex flex-col gap-[28px]">
      {!isAdmin && (
        <div className="p-[14px_20px] rounded-[14px] bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex flex-col sm:flex-row items-center justify-between gap-[12px] text-[14px] text-[var(--color-ink)]">
          <div className="flex items-center gap-[10px]">
            <AlertTriangle className="w-[20px] h-[20px] text-[#f59e0b] shrink-0" />
            <span>
              <strong>Admin Preview Mode:</strong> You are currently logged in
              as a <strong>student</strong>. You are previewing the
              administrative layout.
            </span>
          </div>
          <Link
            href="/dashboard"
            className="px-[14px] py-[6px] rounded-full bg-[var(--color-card-ref)] border border-[var(--color-line)] font-semibold text-[13px] hover:border-[var(--color-navy)] transition-colors whitespace-nowrap cursor-pointer"
          >
            Back to Student View
          </Link>
        </div>
      )}

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[28px_32px] shadow-[var(--shadow-sh)] flex flex-col md:flex-row md:items-center justify-between gap-[20px]">
        <div>
          <div className="flex items-center gap-[12px] mb-[8px]">
            <span className="w-[38px] h-[38px] rounded-[12px] bg-[#7c3aed] text-white grid place-items-center shadow-md">
              <Shield className="w-[20px] h-[20px]" />
            </span>
            <h1 className="text-[26px] font-bold text-[var(--color-ink)]">
              Admin Governance Console
            </h1>
          </div>
          <p className="text-[var(--color-mut)] text-[14px] max-w-[650px]">
            Master issue tracking, academic document curation, and marketplace
            trust moderation.
          </p>
        </div>

        <div className="flex items-center gap-[12px]">
          <span className="px-[14px] py-[8px] rounded-full bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 text-[13px] font-semibold flex items-center gap-[8px]">
            <span className="w-[8px] h-[8px] rounded-full bg-[#7c3aed] animate-pulse" />
            Authorized Admin
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <StatCard
          icon={Ticket}
          iconBg="bg-[#e8f1ff]"
          iconColor="text-[#3b82f6]"
          value="14"
          label="Open Grievances"
          badge={{ text: "1 Escalated (>48h)", variant: "danger" }}
        />
        <StatCard
          icon={Book}
          iconBg="bg-[#e4f9ee]"
          iconColor="text-[#10b981]"
          value="98.4%"
          label="Vault Quality Score"
          badge={{ text: "2 Under Review", variant: "success" }}
        />
        <StatCard
          icon={Cart}
          iconBg="bg-[#f0e8ff]"
          iconColor="text-[#7c3aed]"
          value="42"
          label="Active Listings"
          subtext="6 Expired (30-day scan)"
        />
        <StatCard
          icon={Flag}
          iconBg="bg-[#fff6dc]"
          iconColor="text-[#f59e0b]"
          value="1"
          label="Flagged Sellers"
          badge={{ text: "Ghosting Reported", variant: "warning" }}
        />
      </div>

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[26px] shadow-[var(--shadow-sh)]">
        <div className="mb-[20px]">
          <h2 className="text-[18px] font-bold text-[var(--color-ink)] flex items-center gap-[10px]">
            <span className="w-[10px] h-[10px] rounded-full bg-[#7c3aed]" />
            1. Grievance Desk • Master Management Console
          </h2>
          <p className="text-[var(--color-mut)] text-[13px] mt-[2px]">
            Triage open student submissions, reassign staff, and resolve escalated campus concerns.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-[32px] rounded-[14px] bg-[var(--color-bg)] border border-[var(--color-line)] text-center text-[var(--color-mut)]">
              Loading grievance management console...
            </div>
          }
        >
          <TicketProvider>
            <AdminManagementList />
          </TicketProvider>
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[26px] shadow-[var(--shadow-sh)]">
          <div className="flex items-center justify-between mb-[18px]">
            <div>
              <h2 className="text-[18px] font-bold text-[var(--color-ink)] flex items-center gap-[10px]">
                <span className="w-[10px] h-[10px] rounded-full bg-[#10b981]" />
                2. Academic Vault • Document Curation
              </h2>
              <p className="text-[var(--color-mut)] text-[13px] mt-[2px]">
                Upload official department study material &amp; review
                low-quality flags.
              </p>
            </div>
          </div>

          <div className="mb-[24px] p-[16px] rounded-[14px] bg-[var(--color-bg)] border border-[var(--color-line)]">
            <h3 className="text-[14px] font-semibold text-[var(--color-ink)] mb-[10px] flex items-center gap-[8px]">
              <Upload className="w-[16px] h-[16px] text-[#7c3aed]" />
              Upload Verified Study Material
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] mb-[12px]">
              <input
                type="text"
                placeholder="Document Title (e.g. OS PYQ 2024)"
                className="px-[12px] py-[8px] rounded-[8px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[12px] text-[var(--color-ink)] outline-none"
              />
              <select className="px-[12px] py-[8px] rounded-[8px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[12px] text-[var(--color-ink)] outline-none cursor-pointer">
                <option>CSE - Computer Science</option>
                <option>IT - Information Tech</option>
                <option>ECE - Electronics</option>
              </select>
            </div>
            <button className="w-full py-[8px] rounded-[8px] bg-[#7c3aed] text-white font-semibold text-[13px] shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer">
              Publish to Vault
            </button>
          </div>

          <h3 className="text-[14px] font-bold text-[var(--color-ink)] mb-[12px]">
            Flagged for Quality Review ({dummyFlaggedResources.length})
          </h3>
          <div className="flex flex-col gap-[10px]">
            {dummyFlaggedResources.map((res, i) => (
              <div
                key={i}
                className="p-[14px] rounded-[12px] border border-[var(--color-line)] bg-[var(--color-bg)] flex justify-between items-center gap-[12px]"
              >
                <div>
                  <h4 className="font-semibold text-[13px] text-[var(--color-ink)]">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-[#ef4444] mt-[2px]">
                    Flagged: {res.flagReason} ({res.flaggedCount} reports)
                  </p>
                </div>
                <div className="flex gap-[6px] shrink-0">
                  <button className="px-[10px] py-[5px] rounded-lg bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[11px] font-medium hover:border-[var(--color-navy)] transition-colors cursor-pointer active:scale-95">
                    Keep
                  </button>
                  <button className="px-[10px] py-[5px] rounded-lg bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 text-[11px] font-semibold hover:bg-[#ef4444] hover:text-white transition-colors cursor-pointer active:scale-95">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[26px] shadow-[var(--shadow-sh)]">
          <div className="flex items-center justify-between mb-[18px]">
            <div>
              <h2 className="text-[18px] font-bold text-[var(--color-ink)] flex items-center gap-[10px]">
                <span className="w-[10px] h-[10px] rounded-full bg-[#f59e0b]" />
                3. Campus Marketplace • Moderation
              </h2>
              <p className="text-[var(--color-mut)] text-[13px] mt-[2px]">
                Monitor ghosting behavior, seller flags, and 30-day listing
                lifecycle.
              </p>
            </div>
          </div>

          <div className="p-[14px_16px] rounded-[12px] bg-[var(--color-bg)] border border-[var(--color-line)] mb-[18px]">
            <div className="flex justify-between items-center mb-[6px]">
              <span className="text-[12px] font-semibold text-[var(--color-ink)]">
                Market Health &amp; Expiry Scan
              </span>
              <span className="text-[11px] text-[#10b981] font-semibold flex items-center gap-[4px]">
                <CheckCircle className="w-[12px] h-[12px]" /> Automated daily
              </span>
            </div>
            <p className="text-[12px] text-[var(--color-mut)]">
              Listings older than 30 days receive renewal prompts. Unrenewed
              items are archived to keep campus listings fresh.
            </p>
          </div>

          <h3 className="text-[14px] font-bold text-[var(--color-ink)] mb-[12px]">
            Reported Unresponsive Sellers ({dummyFlaggedSellers.length})
          </h3>
          <div className="flex flex-col gap-[10px]">
            {dummyFlaggedSellers.map((seller, i) => (
              <div
                key={i}
                className="p-[14px] rounded-[12px] border border-[#f59e0b]/30 bg-[#f59e0b]/5 flex flex-col gap-[8px]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-[13px] text-[var(--color-ink)]">
                      {seller.seller} ({seller.email})
                    </h4>
                    <p className="text-[11px] text-[var(--color-mut)]">
                      Listing: {seller.listing}
                    </p>
                  </div>
                  <span className="px-[8px] py-[3px] rounded-md bg-[#f59e0b]/20 text-[#b45309] text-[11px] font-bold">
                    {seller.reports} Reports
                  </span>
                </div>
                <p className="text-[12px] text-[#b45309]">{seller.reason}</p>
                <div className="flex gap-[8px] justify-end pt-[4px]">
                  <button className="px-[12px] py-[5px] rounded-lg bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[11px] font-medium hover:border-[var(--color-navy)] transition-colors cursor-pointer active:scale-95">
                    Send Warning Email
                  </button>
                  <button className="px-[12px] py-[5px] rounded-lg bg-[#ef4444] text-white text-[11px] font-semibold shadow-sm hover:bg-[#dc2626] transition-colors cursor-pointer active:scale-95">
                    Suspend User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
