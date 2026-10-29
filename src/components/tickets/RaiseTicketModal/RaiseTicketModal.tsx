"use client"

import { useState, useEffect } from "react"
import { useTickets } from "../TicketContext"
import { TicketPriority } from "../types"
import { X, AlertTriangle, Pin, Clock } from "@/components/ui/Icons"

interface RaiseTicketModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_TOPICS = [
  {
    label: "Wi-Fi & Network",
    category: "IT and network",
    department: "IT Desk",
    placeholder: "e.g. Wi-Fi AP dropping connection in Lab 3",
  },
  {
    label: "Lab / Hardware",
    category: "Lab Systems",
    department: "IT Desk",
    placeholder: "e.g. PC terminal #14 not booting into OS",
  },
  {
    label: "Projector / AV",
    category: "Classroom AV",
    department: "Maintenance",
    placeholder: "e.g. Broken HDMI port / projector flickering in Room 402",
  },
  {
    label: "Electrical / AC",
    category: "Infrastructure",
    department: "Infrastructure",
    placeholder: "e.g. AC thermostat malfunctioning in Auditorium 1",
  },
  {
    label: "Water / Sanitation",
    category: "Facilities",
    department: "Facilities",
    placeholder: "e.g. Water cooler leaking on 2nd floor hallway",
  },
]

export function RaiseTicketModal({ isOpen, onClose }: RaiseTicketModalProps) {
  const { createTicket, selectTicket } = useTickets()

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("IT Desk")
  const [category, setCategory] = useState("IT and network")
  const [location, setLocation] = useState("")
  const [priority, setPriority] = useState<TicketPriority>("medium")
  const [contactPhone, setContactPhone] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const handleClose = () => {
    setTitle("")
    setLocation("")
    setContactPhone("")
    setDescription("")
    setError("")
    setSelectedPreset(null)
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Escape") {
        e.preventDefault()
        e.stopPropagation()
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown, { capture: true })
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true })
  }, [isOpen])

  if (!isOpen) return null

  const handleApplyPreset = (preset: (typeof PRESET_TOPICS)[0]) => {
    setSelectedPreset(preset.label)
    setCategory(preset.category)
    setDepartment(preset.department)
    setTitle(preset.placeholder.replace("e.g. ", ""))

    if (preset.label === "Wi-Fi & Network") {
      setLocation("Computer Lab 3, 2nd Floor")
    } else if (preset.label === "Lab / Hardware") {
      setLocation("Computer Lab 1, Terminal #14")
    } else if (preset.label === "Projector / AV") {
      setLocation("Room 402, Academic Block")
    } else if (preset.label === "Electrical / AC") {
      setLocation("Auditorium 1, Ground Floor")
    } else if (preset.label === "Water / Sanitation") {
      setLocation("2nd Floor Hallway, West Wing")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError("Please fill in both the issue title and detailed description.")
      return
    }

    const newTicket = createTicket({
      title: title.trim(),
      department,
      category,
      location: location.trim() || undefined,
      priority,
      contactPhone: contactPhone.trim() || undefined,
      description: description.trim(),
    })

    handleClose()
    selectTicket(newTicket.id)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <article
        className="w-full max-w-[540px] max-h-[92vh] flex flex-col bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] shadow-2xl text-[var(--color-ink)] animate-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header className="p-[20px_24px] border-b border-[var(--color-line)] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-[18px] font-bold text-[var(--color-ink)] leading-snug">
              Raise Campus Grievance
            </h3>
            <p className="text-[13px] text-[var(--color-mut)] mt-[2px]">
              Provide issue details so department management can triage and
              dispatch staff.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="w-[30px] h-[30px] rounded-full grid place-items-center text-[var(--color-mut)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer shrink-0 ml-[12px]"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </header>

        {/* Form Body (Scrollable) */}
        <div className="p-[20px_24px] overflow-y-auto flex-1 flex flex-col gap-[16px]">
          {error && (
            <div className="p-[10px_14px] rounded-[10px] bg-red-500/10 border border-red-500/30 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          {/* Quick preset chips */}
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-mut)] mb-[8px]">
              Common Campus Issues
            </span>
            <div className="flex flex-wrap gap-[6px]">
              {PRESET_TOPICS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-[12px] px-[10px] py-[4px] rounded-full border transition-all cursor-pointer ${
                    selectedPreset === preset.label
                      ? "bg-blue-600/20 text-blue-400 border-blue-500/40 font-semibold"
                      : "bg-[var(--color-bg)] text-[var(--color-mut)] border-[var(--color-line)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <form
            id="raise-ticket-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-[14px]"
          >
            {/* Issue Title */}
            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Issue Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Wi-Fi AP offline in Lab 3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-[14px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Department & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-[14px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="IT Desk">IT Desk</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Academic">Academic Affairs</option>
                  <option value="Hostel">Hostel Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-[14px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="IT and network">IT and Network</option>
                  <option value="Lab Systems">Lab Systems &amp; PCs</option>
                  <option value="Classroom AV">Classroom Projector / AV</option>
                  <option value="Infrastructure">Electrical &amp; AC</option>
                  <option value="Facilities">Water &amp; Sanitation</option>
                  <option value="General">General Campus Query</option>
                </select>
              </div>
            </div>

            {/* Location & Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Campus Location / Room
                </label>
                <div className="relative">
                  <Pin className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[var(--color-mut)]" />
                  <input
                    type="text"
                    placeholder="e.g. Computer Lab 3, 2nd Floor"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-[34px] pr-[12px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Contact Phone / Extension (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-[14px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[6px]">
                Urgency &amp; SLA Level
              </label>
              <div className="grid grid-cols-3 gap-[8px]">
                <button
                  type="button"
                  onClick={() => setPriority("low")}
                  className={`p-[8px] rounded-[10px] text-center text-[12px] font-medium border transition-all cursor-pointer ${
                    priority === "low"
                      ? "bg-blue-500/15 border-blue-500 text-blue-400 font-semibold"
                      : "bg-[var(--color-bg)] border-[var(--color-line)] text-[var(--color-mut)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  Low (Minor)
                  <span className="block text-[10px] opacity-75 mt-[1px]">
                    48h SLA
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("medium")}
                  className={`p-[8px] rounded-[10px] text-center text-[12px] font-medium border transition-all cursor-pointer ${
                    priority === "medium"
                      ? "bg-amber-500/15 border-amber-500 text-amber-400 font-semibold"
                      : "bg-[var(--color-bg)] border-[var(--color-line)] text-[var(--color-mut)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  Medium (Routine)
                  <span className="block text-[10px] opacity-75 mt-[1px]">
                    24h SLA
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("high")}
                  className={`p-[8px] rounded-[10px] text-center text-[12px] font-medium border transition-all cursor-pointer ${
                    priority === "high"
                      ? "bg-red-500/20 border-red-500 text-red-400 font-semibold"
                      : "bg-[var(--color-bg)] border-[var(--color-line)] text-[var(--color-mut)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  High (Disruptive)
                  <span className="block text-[10px] opacity-75 mt-[1px]">
                    6h SLA
                  </span>
                </button>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Detailed Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe what is happening, exact symptoms, and any error message or observation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-[14px] py-[10px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* SLA Escalation Policy Notice */}
            <div className="flex items-start gap-[10px] p-[10px_14px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] text-[var(--color-mut)]">
              <Clock className="w-[15px] h-[15px] text-blue-400 shrink-0 mt-[1px]" />
              <span>
                CampusCore auto-escalates unresolved grievances past 48 hours
                directly to the Senior Campus Administration.
              </span>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <footer className="p-[16px_24px] border-t border-[var(--color-line)] flex items-center justify-end gap-[10px] shrink-0 bg-[var(--color-card-ref)]">
          <button
            type="button"
            onClick={handleClose}
            className="px-[16px] py-[9px] rounded-[10px] border border-[var(--color-line)] text-[13px] font-semibold text-[var(--color-mut)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="raise-ticket-form"
            className="px-[20px] py-[9px] rounded-[10px] bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            Submit Grievance
          </button>
        </footer>
      </article>
    </div>
  )
}
