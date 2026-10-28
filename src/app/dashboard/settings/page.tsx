import { Set, Bell, User } from "@/components/ui/Icons"
import { AdminRolesSection } from "@/components/dashboard/AdminRolesSection"

export const instant = false

export default async function SettingsPage() {
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
        <h2 className="text-[24px] font-bold text-[var(--color-navy)] mb-[4px]">
          Settings
        </h2>
        <p className="text-[var(--color-mut)] text-[14px]">
          Manage your account preferences, authorization roles, and app settings.
        </p>
      </div>

      <div className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] overflow-hidden shadow-[var(--shadow-sh)]">
        <div className="p-[22px] border-b border-[var(--color-line)]">
          <h3 className="font-bold text-[18px] text-[var(--color-ink)] mb-[16px]">
            Account
          </h3>
          <div className="flex flex-col gap-[16px]">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--color-ink)]">
                  Change Password
                </p>
                <p className="text-[13px] text-[var(--color-mut)]">
                  Update your account password securely.
                </p>
              </div>
              <button className="px-[16px] py-[8px] rounded-[8px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] font-medium">
                Update
              </button>
            </div>
          </div>
        </div>

        <AdminRolesSection />

        <div className="p-[22px] border-b border-[var(--color-line)]">
          <h3 className="font-bold text-[18px] text-[var(--color-ink)] mb-[16px]">
            Preferences
          </h3>
          <div className="flex flex-col gap-[16px]">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--color-ink)]">
                  Email Notifications
                </p>
                <p className="text-[13px] text-[var(--color-mut)]">
                  Receive emails for new tickets and events.
                </p>
              </div>
              <div className="w-[40px] h-[24px] bg-[var(--color-blue-ref)] rounded-full relative cursor-pointer">
                <div className="absolute top-[2px] left-[18px] w-[20px] h-[20px] bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[var(--color-ink)]">
                  Marketing Emails
                </p>
                <p className="text-[13px] text-[var(--color-mut)]">
                  Receive promotional campus emails.
                </p>
              </div>
              <div className="w-[40px] h-[24px] bg-[var(--color-line)] rounded-full relative cursor-pointer">
                <div className="absolute top-[2px] left-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-[22px] bg-[#fff0f2] dark:bg-[#3a1a28]">
          <h3 className="font-bold text-[18px] text-[#ef4444] mb-[16px]">
            Danger Zone
          </h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-[#ef4444]">Delete Account</p>
              <p className="text-[13px] text-[#ef4444] opacity-80">
                Permanently delete your data.
              </p>
            </div>
            <button className="px-[16px] py-[8px] rounded-[8px] bg-[#ef4444] text-white text-[13px] font-medium hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
