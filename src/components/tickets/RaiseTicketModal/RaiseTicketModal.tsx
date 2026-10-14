"use client"

import { useState, useEffect } from "react"
import { useTickets } from "../TicketContext"
import { X } from "@/components/ui/Icons"

interface RaiseTicketModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RaiseTicketModal({ isOpen, onClose }: RaiseTicketModalProps) {
  const { createTicket, selectTicket } = useTickets()
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("IT Desk")
  const [category, setCategory] = useState("IT and network")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Escape") {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError("Please fill in both the title and description.")
      return
    }

    const newTicket = createTicket({
      title: title.trim(),
      department,
      category,
      description: description.trim(),
    })

    onClose()
    setTitle("")
    setDescription("")
    setError("")
    selectTicket(newTicket.id)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[460px] bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[28px] shadow-2xl text-[var(--color-ink)] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-[16px]">
          <h3 className="text-[18px] font-bold text-[var(--color-ink)]">
            Raise Campus Grievance
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-[28px] h-[28px] rounded-full grid place-items-center text-[var(--color-mut)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
          >
            <X className="w-[16px] h-[16px]" />
          </button>
        </div>

        {error && (
          <p className="text-[12px] text-red-400 mb-[14px] bg-red-400/10 p-[8px_12px] rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
              Issue Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wi-Fi issue in Library"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-[14px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-[12px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors"
              >
                <option value="IT Desk">IT Desk</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Facilities">Facilities</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-[12px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors"
              >
                <option value="IT and network">IT and network</option>
                <option value="Classroom maintenance">Classroom maintenance</option>
                <option value="Facilities">Facilities</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--color-mut)] mb-[4px]">
              Detailed Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what is happening and the exact location..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-[14px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-[10px] pt-[8px]">
            <button
              type="button"
              onClick={onClose}
              className="px-[16px] py-[9px] rounded-[10px] border border-[var(--color-line)] text-[13px] font-medium text-[var(--color-mut)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-[18px] py-[9px] rounded-[10px] bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold transition-colors cursor-pointer active:scale-95 shadow-sm"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
