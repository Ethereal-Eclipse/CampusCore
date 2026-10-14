import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAcademicBatch } from "@/lib/student"

export const instant = false

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  const name = session?.user?.name || "Student"
  const email = session?.user?.email || "student@glbitm.ac.in"
  const image = session?.user?.image
  const role = session?.user?.role || "student"
  const academicBatch = getAcademicBatch(email)

  return (
    <div className="flex flex-col gap-[20px]">
      <header className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[32px] shadow-[var(--shadow-sh)] flex flex-col sm:flex-row gap-[24px] items-center sm:items-start text-center sm:text-left">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-[100px] h-[100px] rounded-full object-cover shrink-0 shadow-lg border border-[var(--color-line)]"
          />
        ) : (
          <div className="w-[100px] h-[100px] rounded-full bg-[var(--color-blue-ref)] text-white grid place-items-center text-[40px] font-bold shrink-0 shadow-lg">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-[28px] font-bold text-[var(--color-navy)] mb-[4px]">
            {name}
          </h2>
          <p className="text-[var(--color-mut)] text-[15px] mb-[16px]">
            Student Account • GL Bajaj ITM
          </p>
          <div className="flex flex-wrap gap-[12px] justify-center sm:justify-start">
            <span className="px-[12px] py-[6px] rounded-full bg-[#e8f1ff] text-[#3b82f6] text-[13px] font-medium border border-[#b3d4ff]">
              {email}
            </span>
            <span className="px-[12px] py-[6px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[var(--color-mut)] text-[13px] font-medium">
              Roll No: -
            </span>
            <span className="px-[12px] py-[6px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[var(--color-mut)] text-[13px] font-medium capitalize">
              Role: {role}
            </span>
          </div>
        </div>
      </header>

      <section aria-label="Profile metrics and activity" className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <h3 className="font-bold text-[18px] mb-[16px] text-[var(--color-navy)]">
            Academic Stats
          </h3>
          <ul className="flex flex-col gap-[12px] text-[14px] text-[var(--color-ink)]">
            <li className="flex justify-between pb-[12px] border-b border-[var(--color-line)]">
              <span className="text-[var(--color-mut)]">Academic Batch</span>
              <span className="font-semibold">{academicBatch}</span>
            </li>
            <li className="flex justify-between pb-[12px] border-b border-[var(--color-line)]">
              <span className="text-[var(--color-mut)]">Current Semester</span>
              <span className="font-semibold">-</span>
            </li>
            <li className="flex justify-between pb-[12px] border-b border-[var(--color-line)]">
              <span className="text-[var(--color-mut)]">CGPA</span>
              <span className="font-semibold">-</span>
            </li>
            <li className="flex justify-between pb-[12px] border-b border-[var(--color-line)]">
              <span className="text-[var(--color-mut)]">Attendance</span>
              <span className="font-semibold">-</span>
            </li>
          </ul>
        </article>

        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <h3 className="font-bold text-[18px] mb-[16px] text-[var(--color-navy)]">
            Recent Activity
          </h3>
          <div className="flex flex-col gap-[12px]">
            <p className="text-[13px] text-[var(--color-mut)]">
              No recent activity recorded yet.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}
