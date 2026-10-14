import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  Cal,
  Ticket,
  Book,
  Cart,
  Arr,
  Wifi,
  Dl,
  Alert,
  Pin,
  Flame,
  Code,
  Set,
} from "@/components/ui/Icons"
import Link from "next/link"
import { headers } from "next/headers"

import { StatCard } from "@/components/dashboard/StatCard"

export const instant = false

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin"

  const stats = isAdmin
    ? [
        {
          icon: Ticket,
          iconColor: "text-[#e11d48]",
          value: "6",
          label: "Open Grievances",
          cardGradient:
            "bg-gradient-to-br from-[var(--color-rd)] to-[var(--color-card-ref)] to-95%",
          href: "/dashboard/tickets",
        },
        {
          icon: Book,
          iconColor: "text-[#2563eb]",
          value: "2",
          label: "Flagged Notes",
          cardGradient:
            "bg-gradient-to-br from-[var(--color-bu)] to-[var(--color-card-ref)] to-95%",
          href: "/dashboard/vault",
        },
        {
          icon: Cart,
          iconColor: "text-[#16a34a]",
          value: "1",
          label: "Flagged Seller",
          cardGradient:
            "bg-gradient-to-br from-[var(--color-gn)] to-[var(--color-card-ref)] to-95%",
          href: "/dashboard/marketplace",
        },
        {
          icon: Cal,
          iconColor: "text-[#9333ea]",
          value: "5",
          label: "Active Staff Desks",
          cardGradient:
            "bg-gradient-to-br from-[var(--color-pu)] to-[var(--color-card-ref)] to-95%",
          href: "/dashboard/tickets",
        },
      ]
    : [
        {
          icon: Ticket,
          iconColor: "text-[#e11d48]",
          value: "3",
          label: "Open Tickets",
          cardGradient:
            "bg-gradient-to-br from-[var(--color-rd)] to-[var(--color-card-ref)] to-95%",
          href: "/dashboard/tickets",
        },
        {
          icon: Book,
          iconColor: "text-[#2563eb]",
          value: "24",
          label: "Resources",
          cardGradient:
            "bg-gradient-to-br from-[var(--color-bu)] to-[var(--color-card-ref)] to-95%",
          href: "/dashboard/vault",
        },
        {
          icon: Cart,
          iconColor: "text-[#16a34a]",
          value: "5",
          label: "My Listings",
          cardGradient:
            "bg-gradient-to-br from-[var(--color-gn)] to-[var(--color-card-ref)] to-95%",
          href: "/dashboard/marketplace",
        },
        {
          icon: Cal,
          iconColor: "text-[#9333ea]",
          value: "4",
          label: "Upcoming Events",
          cardGradient:
            "bg-gradient-to-br from-[var(--color-pu)] to-[var(--color-card-ref)] to-95%",
          href: "/dashboard/calendar",
        },
      ]

  return (
    <>
      <div className="flex justify-between items-start gap-[16px] flex-wrap">
        <div>
          <h2 className="text-[32px] tracking-[-0.5px] text-[var(--color-navy)] font-bold">
            {isAdmin
              ? `Welcome ${session?.user?.name || "Admin"} 👋`
              : `Hello ${session?.user?.name?.split(" ")[0] || "Student"} 👋`}
          </h2>
          <p className="text-[var(--color-mut)]">
            {isAdmin
              ? "Operational oversight and governance console for campus services."
              : "Here's what's happening around your campus."}
          </p>
        </div>
        <div className="flex gap-[14px] items-center p-[9px_18px] border border-[var(--color-line)] rounded-[12px] bg-[var(--color-card-ref)] text-[14px] text-[var(--color-mut)]">
          <span className="flex items-center gap-[6px]">
            <Cal className="w-[16px] h-[16px]" />
            <b className="text-[var(--color-ink)] font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </b>
          </span>
          ⛅ <b className="text-[var(--color-ink)] font-medium">28°C</b> Partly
          Cloudy
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {stats.map((st) => (
          <Link key={st.label} href={st.href} className="block group">
            <StatCard
              icon={st.icon}
              iconColor={st.iconColor}
              value={st.value}
              label={st.label}
              cardGradient={st.cardGradient}
              subtext="Click to view details →"
            />
          </Link>
        ))}
      </div>

      <section className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <h3 className="text-[17px] flex justify-between items-center mb-[14px] font-semibold">
          Recent Activity{" "}
          <Link
            href="/dashboard/tickets"
            className="text-[13px] text-[var(--color-blue-ref)] font-medium hover:underline cursor-pointer"
          >
            View all →
          </Link>
        </h3>
        <Link
          href="/dashboard/tickets"
          className="flex items-center gap-[14px] py-[11px] px-[8px] rounded-[10px] border-b border-[var(--color-line)] text-[14px] hover:bg-[var(--color-bg)] transition-colors cursor-pointer group"
        >
          <span className="w-[40px] h-[40px] rounded-[11px] bg-gradient-to-br from-[var(--color-rd)] to-[var(--color-card-ref)] text-[#e11d48] grid place-items-center transition-transform group-hover:scale-105">
            <Wifi className="w-[18px] h-[18px]" />
          </span>
          <div>
            Wi-Fi issue
            <small className="block text-[var(--color-mut)] text-[12px]">
              Ticket #1042
            </small>
          </div>
          <div className="ml-auto flex gap-[14px] items-center text-[var(--color-mut)] text-[12px]">
            <span className="text-[11px] px-[11px] py-[3px] rounded-full bg-[var(--color-bu)] text-[var(--color-navy)] font-medium">
              In Progress
            </span>
            2h ago
          </div>
        </Link>
        <Link
          href="/dashboard/vault"
          className="flex items-center gap-[14px] py-[11px] px-[8px] rounded-[10px] border-b border-[var(--color-line)] text-[14px] hover:bg-[var(--color-bg)] transition-colors cursor-pointer group"
        >
          <span className="w-[40px] h-[40px] rounded-[11px] bg-gradient-to-br from-[var(--color-bu)] to-[var(--color-card-ref)] text-[#2563eb] grid place-items-center transition-transform group-hover:scale-105">
            <Dl className="w-[18px] h-[18px]" />
          </span>
          <div>
            DBMS Notes
            <small className="block text-[var(--color-mut)] text-[12px]">
              Academic Vault
            </small>
          </div>
          <div className="ml-auto flex gap-[14px] items-center text-[var(--color-mut)] text-[12px]">
            <span className="text-[11px] px-[11px] py-[3px] rounded-full bg-[var(--color-gn)] text-[#15803d] font-medium">
              Downloaded
            </span>
            4h ago
          </div>
        </Link>
        <Link
          href="/dashboard/marketplace"
          className="flex items-center gap-[14px] py-[11px] px-[8px] rounded-[10px] text-[14px] hover:bg-[var(--color-bg)] transition-colors cursor-pointer group"
        >
          <span className="w-[40px] h-[40px] rounded-[11px] bg-gradient-to-br from-[var(--color-gn)] to-[var(--color-card-ref)] text-[#16a34a] grid place-items-center transition-transform group-hover:scale-105">
            <Cart className="w-[18px] h-[18px]" />
          </span>
          <div>
            Calculator
            <small className="block text-[var(--color-mut)] text-[12px]">
              Marketplace
            </small>
          </div>
          <div className="ml-auto flex gap-[14px] items-center text-[var(--color-mut)] text-[12px]">
            <span>Listed for ₹450</span>5h ago
          </div>
        </Link>
      </section>

      <section>
        <h3 className="text-[17px] flex justify-between items-center mb-[14px] font-semibold">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
          <Link
            href="/dashboard/tickets"
            className="flex flex-col items-center gap-[10px] p-[26px_10px] rounded-[18px] border border-[var(--color-line)] font-semibold text-[14px] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[var(--shadow-sh)] bg-gradient-to-br from-[var(--color-rd)] to-[var(--color-card-ref)] text-[#e11d48] cursor-pointer"
          >
            <Alert className="w-[26px] h-[26px]" />
            <span className="flex gap-[6px] items-center">
              Raise Issue <Arr className="w-[14px] h-[14px]" />
            </span>
          </Link>
          <Link
            href="/dashboard/vault"
            className="flex flex-col items-center gap-[10px] p-[26px_10px] rounded-[18px] border border-[var(--color-line)] font-semibold text-[14px] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[var(--shadow-sh)] bg-gradient-to-br from-[var(--color-bu)] to-[var(--color-card-ref)] text-[#2563eb] cursor-pointer"
          >
            <Book className="w-[26px] h-[26px]" />
            <span className="flex gap-[6px] items-center">
              Find Resources <Arr className="w-[14px] h-[14px]" />
            </span>
          </Link>
          <Link
            href="/dashboard/marketplace"
            className="flex flex-col items-center gap-[10px] p-[26px_10px] rounded-[18px] border border-[var(--color-line)] font-semibold text-[14px] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[var(--shadow-sh)] bg-gradient-to-br from-[var(--color-gn)] to-[var(--color-card-ref)] text-[#16a34a] cursor-pointer"
          >
            <Cart className="w-[26px] h-[26px]" />
            <span className="flex gap-[6px] items-center">
              Sell an Item <Arr className="w-[14px] h-[14px]" />
            </span>
          </Link>
          <Link
            href="/dashboard/lost-found"
            className="flex flex-col items-center gap-[10px] p-[26px_10px] rounded-[18px] border border-[var(--color-line)] font-semibold text-[14px] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[var(--shadow-sh)] bg-gradient-to-br from-[var(--color-pu)] to-[var(--color-card-ref)] text-[#9333ea] cursor-pointer"
          >
            <Pin className="w-[26px] h-[26px]" />
            <span className="flex gap-[6px] items-center">
              Report Lost Item <Arr className="w-[14px] h-[14px]" />
            </span>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[20px] items-start">
        <section className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <h3 className="text-[17px] flex justify-between items-center mb-[14px] font-semibold">
            Today's Schedule{" "}
            <Link
              href="/dashboard/calendar"
              className="text-[13px] text-[var(--color-blue-ref)] font-medium hover:underline cursor-pointer"
            >
              View Calendar →
            </Link>
          </h3>
          <div className="relative grid gap-[16px] py-[6px] before:content-[''] before:absolute before:left-1/2 before:top-[24px] before:bottom-[24px] before:w-[2px] before:bg-[var(--color-line)] before:-translate-x-1/2">
            <div className="grid grid-cols-[1fr_30px_1fr] items-center cursor-pointer group">
              <div className="col-start-1 border border-[var(--color-line)] rounded-[12px] p-[10px_16px] bg-[var(--color-bg)] text-right text-[14px] font-semibold transition-all group-hover:border-[var(--color-navy)]/40 group-hover:-translate-x-[2px]">
                Data Structures
                <small className="block text-[var(--color-mut)] font-normal text-[12px]">
                  C-204
                </small>
              </div>
              <span className="col-start-2 w-[14px] h-[14px] rounded-full bg-[var(--color-blue-ref)] justify-self-center shadow-[0_0_0_5px_var(--color-card-ref)] relative z-10"></span>
              <span className="col-start-3 text-[var(--color-mut)] text-[13px] pl-[14px]">
                10:00 AM
              </span>
            </div>

            <div className="grid grid-cols-[1fr_30px_1fr] items-center cursor-pointer group">
              <span className="col-start-1 text-[var(--color-mut)] text-[13px] pr-[14px] text-right">
                12:00 PM
              </span>
              <span className="col-start-2 w-[14px] h-[14px] rounded-full bg-[#a855f7] justify-self-center shadow-[0_0_0_5px_var(--color-card-ref)] relative z-10"></span>
              <div className="col-start-3 border border-[var(--color-line)] rounded-[12px] p-[10px_16px] bg-[var(--color-bg)] text-left text-[14px] font-semibold transition-all group-hover:border-[var(--color-navy)]/40 group-hover:translate-x-[2px]">
                Database Management
                <small className="block text-[var(--color-mut)] font-normal text-[12px]">
                  A-102
                </small>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_30px_1fr] items-center cursor-pointer group">
              <div className="col-start-1 border border-[var(--color-line)] rounded-[12px] p-[10px_16px] bg-[var(--color-bg)] text-right text-[14px] font-semibold transition-all group-hover:border-[var(--color-navy)]/40 group-hover:-translate-x-[2px]">
                Free Time
                <small className="block text-[var(--color-mut)] font-normal text-[12px]">
                  No class
                </small>
              </div>
              <span className="col-start-2 w-[14px] h-[14px] rounded-full bg-[#c3cbe0] justify-self-center shadow-[0_0_0_5px_var(--color-card-ref)] relative z-10"></span>
              <span className="col-start-3 text-[var(--color-mut)] text-[13px] pl-[14px]">
                2:00 PM
              </span>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dk)] text-white border-transparent rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <h3 className="text-[17px] flex items-center justify-start gap-[10px] mb-[4px] font-semibold">
            <Flame className="w-[18px] h-[18px] text-[#fb923c]" />
            Campus Pulse
          </h3>
          <p className="text-[#a9b4d6] text-[14px] mb-[16px]">
            Trending this week
          </p>

          <Link
            href="/dashboard/vault"
            className="flex items-center gap-[14px] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[12px] mb-[12px] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer group"
          >
            <span className="w-[40px] h-[40px] rounded-[13px] bg-[rgba(255,255,255,0.1)] grid place-items-center transition-transform group-hover:scale-105">
              <Book className="w-[18px] h-[18px]" />
            </span>
            <div>
              DBMS PYQs
              <small className="block text-[#a9b4d6] text-[12px]">
                1.2k views
              </small>
            </div>
            <Arr className="w-[15px] h-[15px] text-[#a9b4d6] ml-auto transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-[14px] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[12px] mb-[12px] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer group"
          >
            <span className="w-[40px] h-[40px] rounded-[13px] bg-[rgba(255,255,255,0.1)] grid place-items-center transition-transform group-hover:scale-105">
              <Ticket className="w-[18px] h-[18px]" />
            </span>
            <div>
              Hackathon 2026
              <small className="block text-[#a9b4d6] text-[12px]">
                420 registrations
              </small>
            </div>
            <Arr className="w-[15px] h-[15px] text-[#a9b4d6] ml-auto transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard/vault"
            className="flex items-center gap-[14px] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[12px] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] transition-all cursor-pointer group"
          >
            <span className="w-[40px] h-[40px] rounded-[13px] bg-[rgba(255,255,255,0.1)] grid place-items-center transition-transform group-hover:scale-105">
              <Book className="w-[18px] h-[18px]" />
            </span>
            <div>
              New OS Notes
              <small className="block text-[#a9b4d6] text-[12px]">
                Uploaded 2 hours ago
              </small>
            </div>
            <Arr className="w-[15px] h-[15px] text-[#a9b4d6] ml-auto transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        <section className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <h3 className="text-[17px] flex justify-between items-center mb-[14px] font-semibold">
            Your Courses{" "}
            <Link
              href="/dashboard/vault"
              className="text-[13px] text-[var(--color-blue-ref)] font-medium hover:underline cursor-pointer"
            >
              View all →
            </Link>
          </h3>
          <div className="grid gap-[12px]">
            <div className="border border-[var(--color-line)] rounded-[12px] p-[12px_14px] text-[14px] font-semibold hover:border-[var(--color-navy)]/40 hover:bg-[var(--color-bg)] transition-all cursor-pointer">
              Data Structures{" "}
              <small className="text-[var(--color-mut)] font-normal">
                · KCS301 · 89%
              </small>
              <div className="h-[5px] rounded-[9px] bg-[var(--color-line)] mt-[8px] overflow-hidden">
                <i className="block h-full bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-blue-ref)] w-[89%]"></i>
              </div>
            </div>
            <div className="border border-[var(--color-line)] rounded-[12px] p-[12px_14px] text-[14px] font-semibold hover:border-[var(--color-navy)]/40 hover:bg-[var(--color-bg)] transition-all cursor-pointer">
              Database Management{" "}
              <small className="text-[var(--color-mut)] font-normal">
                · KCS501 · 76%
              </small>
              <div className="h-[5px] rounded-[9px] bg-[var(--color-line)] mt-[8px] overflow-hidden">
                <i className="block h-full bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-blue-ref)] w-[76%]"></i>
              </div>
            </div>
            <div className="border border-[var(--color-line)] rounded-[12px] p-[12px_14px] text-[14px] font-semibold hover:border-[var(--color-navy)]/40 hover:bg-[var(--color-bg)] transition-all cursor-pointer">
              Operating Systems{" "}
              <small className="text-[var(--color-mut)] font-normal">
                · KCS401 · 91%
              </small>
              <div className="h-[5px] rounded-[9px] bg-[var(--color-line)] mt-[8px] overflow-hidden">
                <i className="block h-full bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-blue-ref)] w-[91%]"></i>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <h3 className="text-[17px] flex justify-between items-center mb-[14px] font-semibold">
            Campus Events{" "}
            <Link
              href="/dashboard/calendar"
              className="text-[13px] text-[var(--color-blue-ref)] font-medium hover:underline cursor-pointer"
            >
              View all →
            </Link>
          </h3>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-[14px] py-[11px] px-[8px] rounded-[10px] border-b border-[var(--color-line)] text-[14px] hover:bg-[var(--color-bg)] transition-colors cursor-pointer group"
          >
            <span className="w-[40px] h-[40px] rounded-[11px] bg-gradient-to-br from-[var(--color-pu)] to-[var(--color-card-ref)] text-[#9333ea] grid place-items-center transition-transform group-hover:scale-105">
              <Code className="w-[18px] h-[18px]" />
            </span>
            <div>
              Hackathon 2026
              <small className="block text-[var(--color-mut)] text-[12px]">
                Sep 20 · Main Auditorium
              </small>
            </div>
            <div className="ml-auto flex gap-[14px] items-center">
              <span className="text-[11px] px-[11px] py-[3px] rounded-full bg-[var(--color-bu)] text-[var(--color-navy)] font-medium">
                Event
              </span>
            </div>
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-[14px] py-[11px] px-[8px] rounded-[10px] border-b border-[var(--color-line)] text-[14px] hover:bg-[var(--color-bg)] transition-colors cursor-pointer group"
          >
            <span className="w-[40px] h-[40px] rounded-[11px] bg-gradient-to-br from-[var(--color-bu)] to-[var(--color-card-ref)] text-[#2563eb] grid place-items-center transition-transform group-hover:scale-105">
              <Code className="w-[18px] h-[18px]" />
            </span>
            <div>
              Coding Club Meetup
              <small className="block text-[var(--color-mut)] text-[12px]">
                Sep 18 · CSE Block
              </small>
            </div>
            <div className="ml-auto flex gap-[14px] items-center">
              <span className="text-[11px] px-[11px] py-[3px] rounded-full bg-[var(--color-bu)] text-[var(--color-navy)] font-medium">
                Event
              </span>
            </div>
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-[14px] py-[11px] px-[8px] rounded-[10px] text-[14px] hover:bg-[var(--color-bg)] transition-colors cursor-pointer group"
          >
            <span className="w-[40px] h-[40px] rounded-[11px] bg-gradient-to-br from-[var(--color-gn)] to-[var(--color-card-ref)] text-[#16a34a] grid place-items-center transition-transform group-hover:scale-105">
              <Set className="w-[18px] h-[18px]" />
            </span>
            <div>
              Technical Workshop
              <small className="block text-[var(--color-mut)] text-[12px]">
                Sep 22 · Lab 3
              </small>
            </div>
            <div className="ml-auto flex gap-[14px] items-center">
              <span className="text-[11px] px-[11px] py-[3px] rounded-full bg-[var(--color-gn)] text-[#15803d] font-medium">
                Workshop
              </span>
            </div>
          </Link>
        </section>
      </div>
    </>
  )
}
