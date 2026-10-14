import { Ticket } from "../types"
import { Check } from "@/components/ui/Icons"

interface TicketTimelineProps {
  ticket: Ticket
  className?: string
}

export function TicketTimeline({ ticket, className = "" }: TicketTimelineProps) {
  // Determine current active step (1: Submitted, 2: Assigned, 3: In progress, 4: Resolved)
  let activeStep = 1
  if (ticket.status === "resolved") {
    activeStep = 4
  } else if (ticket.status === "in_progress" || ticket.status === "escalated") {
    activeStep = 3
  } else if (ticket.assignedTo) {
    activeStep = 2
  } else {
    activeStep = 1
  }

  // Find relevant update info
  const submittedUpdate = ticket.updates.find((u) => u.type === "submitted")
  const assignedUpdate = ticket.updates.find((u) => u.type === "assigned")
  const inProgressUpdates = ticket.updates.filter(
    (u) => u.type === "in_progress" || u.type === "note" || u.type === "escalated"
  )
  const resolvedUpdate = ticket.updates.find((u) => u.type === "resolved")

  const latestInProgress = inProgressUpdates[inProgressUpdates.length - 1]

  const steps = [
    {
      index: 1,
      title: "Submitted",
      time: submittedUpdate?.timestamp || ticket.openedAt,
      message: null,
    },
    {
      index: 2,
      title: ticket.assignedTo
        ? `Assigned to ${ticket.assignedTo.name}`
        : "Assigned",
      time: assignedUpdate?.timestamp || (ticket.assignedTo ? "Assigned" : null),
      message: null,
    },
    {
      index: 3,
      title: ticket.status === "escalated" ? "Escalated" : "In progress",
      time: latestInProgress?.timestamp || (ticket.status === "in_progress" ? "Recent" : null),
      message: latestInProgress?.message || null,
    },
    {
      index: 4,
      title: "Resolved",
      time: resolvedUpdate?.timestamp || null,
      message: resolvedUpdate?.message !== "Marked as resolved" ? resolvedUpdate?.message : null,
    },
  ]

  return (
    <div className={`py-[10px] ${className}`}>
      <h4 className="text-[14px] font-bold text-[var(--color-ink)] mb-[16px]">
        Progress
      </h4>

      <div className="flex flex-col">
        {steps.map((step, idx) => {
          const isDone = activeStep > step.index || (activeStep === 4 && step.index === 4)
          const isCurrent = activeStep === step.index && !(activeStep === 4 && step.index === 4)
          const isFuture = activeStep < step.index
          const isLast = idx === steps.length - 1

          return (
            <div key={step.index} className="flex gap-[16px] relative">
              {/* Left timeline track */}
              <div className="flex flex-col items-center">
                {isDone ? (
                  <div className="w-[20px] h-[20px] rounded-full bg-blue-600 text-white grid place-items-center shrink-0 z-10">
                    <Check className="w-[12px] h-[12px] stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-[20px] h-[20px] rounded-full border-2 border-blue-500 bg-[var(--color-card-ref)] grid place-items-center shrink-0 z-10">
                    <span className="w-[6px] h-[6px] rounded-full bg-blue-500" />
                  </div>
                ) : (
                  <div className="w-[20px] h-[20px] rounded-full border border-dashed border-[var(--color-mut)]/60 bg-transparent shrink-0 z-10" />
                )}

                {/* Vertical connecting line */}
                {!isLast && (
                  <div
                    className={`w-[2px] flex-1 min-h-[32px] my-[2px] ${
                      isDone ? "bg-blue-600" : "bg-[var(--color-line)]"
                    }`}
                  />
                )}
              </div>

              {/* Right content */}
              <div className={`pb-[20px] ${isLast ? "pb-0" : ""}`}>
                <p
                  className={`text-[14px] font-semibold leading-tight ${
                    isCurrent
                      ? "text-blue-500"
                      : isFuture
                        ? "text-[var(--color-mut)]"
                        : "text-[var(--color-ink)]"
                  }`}
                >
                  {step.title}
                </p>

                {step.message && (
                  <p className="text-[13px] text-[var(--color-ink)]/90 mt-[4px] leading-relaxed max-w-[380px]">
                    {step.message}
                  </p>
                )}

                {step.time && (
                  <p className="text-[12px] text-[var(--color-mut)] mt-[2px]">
                    {step.time}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
