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
  Search,
  User,
} from "@/components/ui/Icons"

export const instant = false

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const role = session.user?.role || "student"
  const isAdmin = role === "admin"

  const dummyMasterTickets = [
    {
      id: "#1044",
      student: "Arjun Verma",
      email: "2501921540102@glbitm.ac.in",
      title: "Wi-Fi Access Point offline in Computer Lab 3",
      category: "Infrastructure",
      age: "52h ago",
      escalated: true,
      status: "Escalated",
    },
    {
      id: "#1043",
      student: "Priya Nair",
      email: "2501921540311@glbitm.ac.in",
      title: "Digital library portal session timeout error",
      category: "IT Support",
      age: "6h ago",
      escalated: false,
      status: "Pending",
    },
    {
      id: "#1042",
      student: "Naman Sharma",
      email: "2501921540247@glbitm.ac.in",
      title: "Water dispenser filter replacement in Block B",
      category: "Maintenance",
      age: "18h ago",
      escalated: false,
      status: "In Progress",
    },
    {
      id: "#1039",
      student: "Rohan Das",
      email: "2501921540440@glbitm.ac.in",
      title: "Air Conditioner thermostat broken in Audi 1",
      category: "Maintenance",
      age: "3d ago",
      escalated: false,
      status: "Resolved",
    },
  ]

  const dummyFlaggedResources = [
    {
      id: "vault-302",
      title: "Data Structures Hand-written Notes (Unit 4)",
      uploadedBy: "rahul@glbitm.ac.in",
      branch: "CSE",
      semester: "Sem 3",
      flagReason: "Incomplete pages and blurry scan quality",
      flaggedCount: 3,
    },
    {
      id: "vault-119",
      title: "Operating Systems Old Syllabus PYQs 2018",
      uploadedBy: "anjali@glbitm.ac.in",
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
      email: "karan@glbitm.ac.in",
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
            className="px-[14px] py-[6px] rounded-full bg-[var(--color-card-ref)] border border-[var(--color-line)] font-semibold text-[13px] hover:border-[var(--color-navy)] transition-colors whitespace-nowrap"
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
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[16px] p-[20px] shadow-[var(--shadow-sh)]">
          <div className="flex justify-between items-start mb-[12px]">
            <span className="text-[var(--color-mut)] text-[13px] font-medium">
              Open Grievances
            </span>
            <span className="w-[32px] h-[32px] rounded-[10px] bg-[#e8f1ff] text-[#3b82f6] grid place-items-center">
              <Ticket className="w-[16px] h-[16px]" />
            </span>
          </div>
          <div className="text-[26px] font-bold text-[var(--color-ink)] mb-[4px]">
            14
          </div>
          <span className="text-[12px] font-semibold text-[#ef4444] bg-[#ef4444]/10 px-[8px] py-[2px] rounded-md inline-block">
            1 Escalated (&gt;48h)
          </span>
        </div>

        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[16px] p-[20px] shadow-[var(--shadow-sh)]">
          <div className="flex justify-between items-start mb-[12px]">
            <span className="text-[var(--color-mut)] text-[13px] font-medium">
              Vault Quality Score
            </span>
            <span className="w-[32px] h-[32px] rounded-[10px] bg-[#e4f9ee] text-[#10b981] grid place-items-center">
              <Book className="w-[16px] h-[16px]" />
            </span>
          </div>
          <div className="text-[26px] font-bold text-[var(--color-ink)] mb-[4px]">
            98.4%
          </div>
          <span className="text-[12px] font-semibold text-[#10b981] bg-[#10b981]/10 px-[8px] py-[2px] rounded-md inline-block">
            2 Items Under Review
          </span>
        </div>

        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[16px] p-[20px] shadow-[var(--shadow-sh)]">
          <div className="flex justify-between items-start mb-[12px]">
            <span className="text-[var(--color-mut)] text-[13px] font-medium">
              Active Listings
            </span>
            <span className="w-[32px] h-[32px] rounded-[10px] bg-[#f0e8ff] text-[#7c3aed] grid place-items-center">
              <Cart className="w-[16px] h-[16px]" />
            </span>
          </div>
          <div className="text-[26px] font-bold text-[var(--color-ink)] mb-[4px]">
            42
          </div>
          <span className="text-[12px] text-[var(--color-mut)]">
            6 Expired (30-day scan)
          </span>
        </div>

        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[16px] p-[20px] shadow-[var(--shadow-sh)]">
          <div className="flex justify-between items-start mb-[12px]">
            <span className="text-[var(--color-mut)] text-[13px] font-medium">
              Flagged Sellers
            </span>
            <span className="w-[32px] h-[32px] rounded-[10px] bg-[#fff6dc] text-[#f59e0b] grid place-items-center">
              <Flag className="w-[16px] h-[16px]" />
            </span>
          </div>
          <div className="text-[26px] font-bold text-[var(--color-ink)] mb-[4px]">
            1
          </div>
          <span className="text-[12px] font-semibold text-[#f59e0b] bg-[#f59e0b]/10 px-[8px] py-[2px] rounded-md inline-block">
            Ghosting Reported
          </span>
        </div>
      </div>

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[26px] shadow-[var(--shadow-sh)]">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-[14px] mb-[20px]">
          <div>
            <h2 className="text-[18px] font-bold text-[var(--color-ink)] flex items-center gap-[10px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#7c3aed]" />
              1. Grievance Desk • Master Issue Board
            </h2>
            <p className="text-[var(--color-mut)] text-[13px] mt-[2px]">
              Triage open student submissions and resolve escalated campus
              infrastructure concerns.
            </p>
          </div>

          <div className="flex gap-[8px]">
            <span className="px-[12px] py-[6px] rounded-lg bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] font-semibold text-[var(--color-ink)]">
              All Tickets (14)
            </span>
            <span className="px-[12px] py-[6px] rounded-lg bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20 text-[12px] font-semibold">
              Escalated (1)
            </span>
          </div>
        </div>

        <div className="p-[14px_16px] rounded-[12px] bg-[#f97316]/10 border border-[#f97316]/30 mb-[18px] flex items-center justify-between gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <AlertTriangle className="w-[20px] h-[20px] text-[#f97316] shrink-0" />
            <div>
              <p className="text-[13px] font-bold text-[#c2410c]">
                Escalation Alert: Ticket #1044 Unresolved &gt; 48 Hours
              </p>
              <p className="text-[12px] text-[#9a3412]">
                Auto-escalation notification sent to Senior Administrator.
                Action required immediately.
              </p>
            </div>
          </div>
          <button className="px-[14px] py-[6px] rounded-full bg-[#ea580c] text-white text-[12px] font-semibold shadow-sm hover:bg-[#c2410c] transition-colors shrink-0">
            Acknowledge &amp; Dispatch
          </button>
        </div>

        <div className="flex flex-col gap-[12px]">
          {dummyMasterTickets.map((ticket, i) => (
            <div
              key={i}
              className={`p-[16px_20px] rounded-[14px] border ${
                ticket.escalated
                  ? "border-[#f97316]/40 bg-[#f97316]/5"
                  : "border-[var(--color-line)] bg-[var(--color-bg)]"
              } flex flex-col md:flex-row justify-between md:items-center gap-[14px] transition-colors`}
            >
              <div className="flex gap-[16px] items-start">
                <div
                  className={`w-[44px] h-[44px] rounded-[12px] ${
                    ticket.escalated
                      ? "bg-[#f97316]/10 text-[#ea580c]"
                      : ticket.status === "Resolved"
                        ? "bg-[#10b981]/10 text-[#10b981]"
                        : "bg-[#7c3aed]/10 text-[#7c3aed]"
                  } grid place-items-center shrink-0 mt-[2px]`}
                >
                  <Ticket className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <div className="flex items-center gap-[10px] mb-[4px]">
                    <span className="font-bold text-[14px] text-[var(--color-ink)]">
                      {ticket.title}
                    </span>
                    <span className="text-[12px] font-medium text-[var(--color-mut)]">
                      {ticket.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-[12px] text-[12px] text-[var(--color-mut)]">
                    <span>Student: {ticket.student}</span>
                    <span>•</span>
                    <span>Category: {ticket.category}</span>
                    <span>•</span>
                    <span>Age: {ticket.age}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-[10px] self-end md:self-auto">
                <span
                  className={`px-[12px] py-[5px] rounded-full text-[12px] font-semibold ${
                    ticket.escalated
                      ? "bg-[#f97316] text-white"
                      : ticket.status === "Resolved"
                        ? "bg-[#10b981]/15 text-[#10b981]"
                        : "bg-[#3b82f6]/15 text-[#3b82f6]"
                  }`}
                >
                  {ticket.status}
                </span>

                {ticket.status !== "Resolved" && (
                  <button className="px-[14px] py-[6px] rounded-full bg-[var(--color-card-ref)] border border-[#10b981] text-[#10b981] font-semibold text-[12px] hover:bg-[#10b981] hover:text-white transition-colors">
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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
              <select className="px-[12px] py-[8px] rounded-[8px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[12px] text-[var(--color-ink)] outline-none">
                <option>CSE - Computer Science</option>
                <option>IT - Information Tech</option>
                <option>ECE - Electronics</option>
              </select>
            </div>
            <button className="w-full py-[8px] rounded-[8px] bg-[#7c3aed] text-white font-semibold text-[13px] shadow-sm hover:opacity-95 transition-opacity">
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
                  <button className="px-[10px] py-[5px] rounded-lg bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[11px] font-medium hover:border-[var(--color-navy)] transition-colors">
                    Keep
                  </button>
                  <button className="px-[10px] py-[5px] rounded-lg bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 text-[11px] font-semibold hover:bg-[#ef4444] hover:text-white transition-colors">
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
                  <button className="px-[12px] py-[5px] rounded-lg bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[11px] font-medium hover:border-[var(--color-navy)] transition-colors">
                    Send Warning Email
                  </button>
                  <button className="px-[12px] py-[5px] rounded-lg bg-[#ef4444] text-white text-[11px] font-semibold shadow-sm hover:bg-[#dc2626] transition-colors">
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
