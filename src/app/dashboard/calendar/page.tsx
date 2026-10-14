import { Cal } from "@/components/ui/Icons"
import { ModuleHeader } from "@/components/layout/ModuleHeader"
import { EventCard, EventData } from "@/components/calendar/EventCard"

export const instant = false

export default async function CalendarPage() {
  const dummyEvents: EventData[] = [
    {
      title: "Data Structures Lab",
      time: "10:00 AM - 12:00 PM",
      type: "Academic",
      location: "Lab 2",
    },
    {
      title: "Tech Club Meetup",
      time: "2:00 PM - 3:30 PM",
      type: "Extracurricular",
      location: "Audi 1",
    },
    {
      title: "Project Submission Deadline",
      time: "11:59 PM",
      type: "Deadline",
      location: "Online Portal",
    },
  ]

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Campus Calendar"
        description="Keep track of classes, deadlines, and campus events."
        actionButtonText="+ Add Event"
      />

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <h3 className="font-bold text-[18px] mb-[16px] flex items-center gap-2 text-[var(--color-ink)]">
          <Cal className="w-5 h-5 text-[var(--color-navy)]" /> Today's Schedule
        </h3>
        <div className="flex flex-col gap-[12px]">
          {dummyEvents.map((ev, i) => (
            <EventCard key={i} event={ev} />
          ))}
        </div>
      </div>
    </div>
  )
}
