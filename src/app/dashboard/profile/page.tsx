import { User, Book, Set } from "@/components/ui/Icons"

export const instant = false

export default async function ProfilePage() {
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[32px] shadow-[var(--shadow-sh)] flex flex-col sm:flex-row gap-[24px] items-center sm:items-start text-center sm:text-left">
        <div className="w-[100px] h-[100px] rounded-full bg-[var(--color-blue-ref)] text-white grid place-items-center text-[40px] font-bold shrink-0 shadow-lg">
          N
        </div>
        <div className="flex-1">
          <h2 className="text-[28px] font-bold text-[var(--color-navy)] mb-[4px]">
            Naman (Demo)
          </h2>
          <p className="text-[var(--color-mut)] text-[15px] mb-[16px]">
            B.Tech Computer Science • 2nd Year
          </p>
          <div className="flex flex-wrap gap-[12px] justify-center sm:justify-start">
            <span className="px-[12px] py-[6px] rounded-full bg-[#e8f1ff] text-[#3b82f6] text-[13px] font-medium border border-[#b3d4ff]">
              25114cn288@glbitm.ac.in
            </span>
            <span className="px-[12px] py-[6px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[var(--color-mut)] text-[13px] font-medium">
              Roll No: 2501921540247
            </span>
          </div>
        </div>
        <button className="px-[20px] py-[10px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] font-semibold text-[14px] text-[var(--color-ink)] transition-all hover:bg-[var(--color-line)]">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <h3 className="font-bold text-[18px] mb-[16px] text-[var(--color-navy)]">
            Academic Stats
          </h3>
          <ul className="flex flex-col gap-[12px] text-[14px] text-[var(--color-ink)]">
            <li className="flex justify-between pb-[12px] border-b border-[var(--color-line)]">
              <span className="text-[var(--color-mut)]">Current Semester</span>
              <span className="font-semibold">Semester 3</span>
            </li>
            <li className="flex justify-between pb-[12px] border-b border-[var(--color-line)]">
              <span className="text-[var(--color-mut)]">CGPA</span>
              <span className="font-semibold">7.5</span>
            </li>
            <li className="flex justify-between pb-[12px] border-b border-[var(--color-line)]">
              <span className="text-[var(--color-mut)]">Attendance</span>
              <span className="font-semibold text-[#10b981]">79%</span>
            </li>
          </ul>
        </div>

        <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <h3 className="font-bold text-[18px] mb-[16px] text-[var(--color-navy)]">
            Recent Activity
          </h3>
          <div className="flex flex-col gap-[12px]">
            <p className="text-[13px] text-[var(--color-mut)]">
              Uploaded "OS Lab Manual" to Vault
            </p>
            <p className="text-[13px] text-[var(--color-mut)]">
              Listed "Scientific Calculator" in Marketplace
            </p>
            <p className="text-[13px] text-[var(--color-mut)]">
              Raised ticket #1042 for Library Wi-Fi
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
