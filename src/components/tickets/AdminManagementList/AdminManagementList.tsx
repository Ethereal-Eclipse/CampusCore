"use client"

import { useState, useMemo } from "react"
import { useTickets } from "../TicketContext"
import { TicketStatus } from "../types"
import { AdminStatStrip } from "../AdminStatStrip"
import { AdminAttentionBanner } from "../AdminAttentionBanner"
import { AdminTicketRow } from "../AdminTicketRow"
import { AdminTicketDrawer } from "../AdminTicketDrawer"
import { AdminBoardView } from "../AdminBoardView"
import { ArrowUpDown } from "@/components/ui/Icons"
import { isTicketEscalated } from "../sla"

export function AdminManagementList() {
  const { tickets, selectedTicketId, selectTicket, isLoading } = useTickets()

  const [activeTab, setActiveTab] = useState<"list" | "board">("list")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("newest")
  const [isReviewFilterActive, setIsReviewFilterActive] = useState(false)

  const overdueCount = tickets.filter(
    (t) => t.ageHours > 48 && t.status !== "resolved",
  ).length
  const unassignedCount = tickets.filter(
    (t) => !t.assignedTo && t.status !== "resolved",
  ).length

  const filteredTickets = useMemo(() => {
    let list = [...tickets]

    // Review attention filter: overdue or unassigned
    if (isReviewFilterActive) {
      list = list.filter(
        (t) => (t.ageHours > 48 || !t.assignedTo) && t.status !== "resolved",
      )
    }

    // Department filter
    if (departmentFilter !== "all") {
      list = list.filter(
        (t) => t.department.toLowerCase() === departmentFilter.toLowerCase(),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "escalated") {
        list = list.filter(isTicketEscalated)
      } else {
        list = list.filter((t) => t.status === statusFilter)
      }
    }

    // Sort: newest first (default) vs oldest first
    list.sort((a, b) => {
      // Escalated / SLA breached rows are pinned to the top!
      const aEsc = isTicketEscalated(a)
      const bEsc = isTicketEscalated(b)
      if (aEsc && !bEsc) return -1
      if (!aEsc && bEsc) return 1

      if (sortOrder === "oldest") {
        if (b.ageHours !== a.ageHours) return b.ageHours - a.ageHours
        return a.id.localeCompare(b.id)
      } else {
        if (a.ageHours !== b.ageHours) return a.ageHours - b.ageHours
        return b.id.localeCompare(a.id)
      }
    })

    return list
  }, [tickets, isReviewFilterActive, departmentFilter, statusFilter, sortOrder])

  return (
    <div className="flex flex-col gap-[20px]">
      {/* 1. Stat Strip */}
      <AdminStatStrip tickets={tickets} />

      {/* 2. Attention Banner (Red) */}
      <AdminAttentionBanner
        overdueCount={overdueCount}
        unassignedCount={unassignedCount}
        isFilterActive={isReviewFilterActive}
        onReviewClick={() => setIsReviewFilterActive(!isReviewFilterActive)}
      />

      {/* 3. Filter Row matching Image 1 */}
      <nav
        aria-label="Ticket filters"
        className="flex flex-wrap items-center justify-between gap-[12px] pt-[4px]"
      >
        <div className="flex items-center gap-[10px] flex-wrap">
          {/* List / Board Pill Toggle */}
          <div className="flex items-center p-[3px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className={`px-[16px] py-[6px] rounded-full transition-all cursor-pointer ${
                activeTab === "list"
                  ? "bg-[var(--color-card-ref)] text-[var(--color-ink)] shadow-xs font-semibold"
                  : "text-[var(--color-mut)] hover:text-[var(--color-ink)]"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("board")}
              className={`px-[16px] py-[6px] rounded-full transition-all cursor-pointer ${
                activeTab === "board"
                  ? "bg-[var(--color-card-ref)] text-[var(--color-ink)] shadow-xs font-semibold"
                  : "text-[var(--color-mut)] hover:text-[var(--color-ink)]"
              }`}
            >
              Board
            </button>
          </div>

          {/* Department Dropdown */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-[14px] py-[8px] rounded-full bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] font-medium outline-none focus:border-[var(--color-navy)] transition-colors cursor-pointer"
          >
            <option value="all">All departments</option>
            <option value="IT Desk">IT Desk</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Facilities">Facilities</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-[14px] py-[8px] rounded-full bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] font-medium outline-none focus:border-[var(--color-navy)] transition-colors cursor-pointer"
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Sort: Oldest first default */}
        <button
          type="button"
          onClick={() =>
            setSortOrder(sortOrder === "oldest" ? "newest" : "oldest")
          }
          className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-full bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] font-medium hover:border-[var(--color-navy)] transition-colors cursor-pointer"
        >
          <ArrowUpDown className="w-[14px] h-[14px] text-[var(--color-mut)]" />
          <span>
            {sortOrder === "oldest" ? "Oldest first" : "Newest first"}
          </span>
        </button>
      </nav>

      {/* 4. List View or Board View */}
      {activeTab === "board" ? (
        <section
          aria-label="Master issue board"
          className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[24px] shadow-[var(--shadow-sh)]"
        >
          <AdminBoardView />
        </section>
      ) : (
        <section
          aria-label="Grievance management list"
          className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[20px] shadow-[var(--shadow-sh)]"
        >
          {/* Column Headers */}
          <div className="hidden md:flex items-center justify-between text-[12px] font-semibold text-[var(--color-mut)] px-[20px] pb-[12px] uppercase tracking-wider">
            <span className="flex-1">Issue</span>
            <div className="flex items-center gap-[24px]">
              <span className="w-[130px]">Assigned to</span>
              <span className="w-[50px]">Age</span>
              <span className="w-[95px] text-right">Status</span>
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-[10px]">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[64px] rounded-[14px] bg-[var(--color-bg)] border border-[var(--color-line)] animate-pulse"
                />
              ))
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <AdminTicketRow
                  key={ticket.id}
                  ticket={ticket}
                  isSelected={selectedTicketId === ticket.id}
                  onClick={() => selectTicket(ticket.id)}
                />
              ))
            ) : (
              <div className="p-[32px] text-center text-[var(--color-mut)] text-[14px]">
                No tickets found matching the selected filter criteria.
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Detail Drawer */}
      <AdminTicketDrawer />
    </div>
  )
}
