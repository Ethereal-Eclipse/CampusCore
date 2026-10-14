"use client"

import { useState } from "react"
import { Cal, Plus, CheckCircle, Clock, Pin } from "@/components/ui/Icons"

interface AdminEvent {
  id: string
  title: string
  time: string
  type: string
  location: string
  organizer: string
}

const INITIAL_EVENTS: AdminEvent[] = [
  {
    id: "ev-1",
    title: "Data Structures Practical Examination",
    time: "10:00 AM - 12:00 PM",
    type: "Academic Exam",
    location: "Computer Lab 2",
    organizer: "CSE Dept",
  },
  {
    id: "ev-2",
    title: "Tech Club Annual Induction & Workshop",
    time: "2:00 PM - 3:30 PM",
    type: "Club Event",
    location: "Main Auditorium (Audi 1)",
    organizer: "Student Council",
  },
  {
    id: "ev-3",
    title: "Campus Placement Aptitude Drive",
    time: "4:00 PM - 5:30 PM",
    type: "Placement",
    location: "Seminar Hall Block B",
    organizer: "Training & Placement Cell",
  },
  {
    id: "ev-4",
    title: "Mini-Project Milestone 1 Submission",
    time: "11:59 PM",
    type: "Academic Deadline",
    location: "CampusCore Digital Portal",
    organizer: "Academic Committee",
  },
]

export function AdminCalendarView() {
  const [events, setEvents] = useState<AdminEvent[]>(INITIAL_EVENTS)
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("10:00 AM - 12:00 PM")
  const [type, setType] = useState("Academic Exam")
  const [location, setLocation] = useState("Main Auditorium (Audi 1)")
  const [organizer, setOrganizer] = useState("Academic Administration")
  const [successMsg, setSuccessMsg] = useState("")

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newEv: AdminEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      time,
      type,
      location,
      organizer,
    }

    setEvents((prev) => [newEv, ...prev])
    setTitle("")
    setSuccessMsg("Campus event successfully scheduled & published.")
    setTimeout(() => setSuccessMsg(""), 3000)
  }

  const handleCancelEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Header */}
      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px_28px] shadow-[var(--shadow-sh)] flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[10px] mb-[6px]">
            <span className="w-[32px] h-[32px] rounded-[10px] bg-purple-600/10 text-purple-400 grid place-items-center">
              <Cal className="w-[18px] h-[18px]" />
            </span>
            <h1 className="text-[22px] font-bold text-[var(--color-ink)]">
              Campus Calendar • Scheduling &amp; Exam Desk
            </h1>
          </div>
          <p className="text-[14px] text-[var(--color-mut)]">
            Schedule university events, publish exam timelines, and coordinate lab and auditorium reservations.
          </p>
        </div>

        <span className="px-[12px] py-[6px] rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[12px] font-semibold self-start md:self-auto">
          Scheduling Authority
        </span>
      </div>

      {successMsg && (
        <div className="p-[12px_16px] rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] flex items-center gap-[8px]">
          <CheckCircle className="w-[16px] h-[16px]" />
          {successMsg}
        </div>
      )}

      {/* Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px]">
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Published Events
          </span>
          <span className="text-[26px] font-bold text-[var(--color-ink)]">{events.length}</span>
        </div>
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Exam Schedules
          </span>
          <span className="text-[26px] font-bold text-purple-400">2 Active</span>
        </div>
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Venue Bookings
          </span>
          <span className="text-[26px] font-bold text-blue-400">4 Venues</span>
        </div>
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Auditorium 1
          </span>
          <span className="text-[26px] font-bold text-amber-400">Reserved</span>
        </div>
      </div>

      {/* Main Grid: Publish Form and Venue Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        {/* Publish form */}
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <Plus className="w-[18px] h-[18px] text-purple-400" />
            <h2 className="text-[16px] font-bold text-[var(--color-ink)]">
              Publish Event or Exam Notice
            </h2>
          </div>

          <form onSubmit={handlePublish} className="flex flex-col gap-[12px]">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Event or Examination Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mid-Term DBMS Examination"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Event Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
                >
                  <option value="Academic Exam">Academic Exam</option>
                  <option value="Club Event">Club / Extracurricular</option>
                  <option value="Placement">Placement Drive</option>
                  <option value="Academic Deadline">Submission Deadline</option>
                  <option value="Holiday">Campus Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Time Slot
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10:00 AM - 1:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Campus Venue / Room
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
                >
                  <option value="Main Auditorium (Audi 1)">Main Auditorium (Audi 1)</option>
                  <option value="Auditorium 2">Auditorium 2</option>
                  <option value="Computer Lab 2">Computer Lab 2</option>
                  <option value="Computer Lab 3">Computer Lab 3</option>
                  <option value="Seminar Hall Block B">Seminar Hall Block B</option>
                  <option value="CampusCore Digital Portal">CampusCore Digital Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Organizing Body
                </label>
                <input
                  type="text"
                  placeholder="e.g. Examination Cell"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-[6px] py-[10px] rounded-[10px] bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[13px] transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              Publish Event to Schedule
            </button>
          </form>
        </div>

        {/* Timetable Schedule */}
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-[16px]">
              <div className="flex items-center gap-[10px]">
                <Clock className="w-[18px] h-[18px] text-purple-400" />
                <h2 className="text-[16px] font-bold text-[var(--color-ink)]">
                  Scheduled Campus Venues &amp; Deadlines
                </h2>
              </div>
              <span className="text-[12px] text-[var(--color-mut)] font-medium">
                {events.length} slots
              </span>
            </div>

            <div className="flex flex-col gap-[10px]">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-[14px] rounded-[12px] bg-[var(--color-bg)] border border-[var(--color-line)] flex items-center justify-between gap-[14px]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-[8px] flex-wrap">
                      <h4 className="text-[14px] font-semibold text-[var(--color-ink)]">
                        {ev.title}
                      </h4>
                      <span className="px-[8px] py-[2px] rounded-full bg-purple-500/15 text-purple-400 text-[10px] font-bold">
                        {ev.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-[12px] text-[12px] text-[var(--color-mut)] mt-[4px]">
                      <span className="flex items-center gap-[4px]">
                        <Clock className="w-[12px] h-[12px]" />
                        {ev.time}
                      </span>
                      <span className="flex items-center gap-[4px]">
                        <Pin className="w-[12px] h-[12px]" />
                        {ev.location}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCancelEvent(ev.id)}
                    className="px-[10px] py-[5px] rounded-[8px] border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
