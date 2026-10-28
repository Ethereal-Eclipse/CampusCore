"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Shield, Plus, Check } from "@/components/ui/Icons"

interface AdminUser {
  id?: string
  name: string
  email: string
  role: string
}

export function AdminRolesSection() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState("")

  useEffect(() => {
    if (!isAdmin) return
    fetch("/api/admin/roles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.admins)) {
          setAdmins(data.admins)
        }
      })
      .catch(() => {})
  }, [isAdmin])

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim() || !newEmail.includes("@")) return

    setLoading(true)
    setStatusMsg("")

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim(), name: newName.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setStatusMsg(`Admin privileges successfully granted to ${newEmail}`)
        setAdmins((prev) => [
          ...prev,
          {
            name: newName.trim() || "Administrator",
            email: newEmail.trim().toLowerCase(),
            role: "admin",
          },
        ])
        setNewEmail("")
        setNewName("")
      } else {
        setStatusMsg(data.error || "Failed to grant admin privileges")
      }
    } catch {
      setStatusMsg("Network error granting admin privileges")
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="p-[22px] border-b border-[var(--color-line)]">
        <h3 className="font-bold text-[18px] text-[var(--color-ink)] mb-[4px]">
          Access Role &amp; Permissions
        </h3>
        <p className="text-[13px] text-[var(--color-mut)] mb-[14px]">
          Current authorization level for campus services.
        </p>
        <div className="flex items-center gap-[10px] p-[12px_16px] rounded-[12px] bg-[var(--color-bg)] border border-[var(--color-line)] w-fit text-[13px]">
          <span className="w-[8px] h-[8px] rounded-full bg-blue-500" />
          <span className="font-semibold text-[var(--color-ink)]">
            Student Role
          </span>
          <span className="text-[var(--color-mut)]">
            (Contact a Senior Administrator to request triage privileges)
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-[22px] border-b border-[var(--color-line)] flex flex-col gap-[16px]">
      <div>
        <div className="flex items-center gap-[8px]">
          <Shield className="w-[18px] h-[18px] text-blue-500" />
          <h3 className="font-bold text-[18px] text-[var(--color-ink)]">
            Administrator Access &amp; Delegation (RBAC)
          </h3>
        </div>
        <p className="text-[13px] text-[var(--color-mut)] mt-[4px]">
          Manage whitelisted staff emails with administrative triage and dispatch
          permissions.
        </p>
      </div>

      {statusMsg && (
        <div className="p-[10px_14px] rounded-[10px] bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[13px] flex items-center gap-[8px]">
          <Check className="w-[15px] h-[15px]" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Grant admin form */}
      <form
        onSubmit={handleGrantAdmin}
        className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_auto] gap-[10px] p-[16px] rounded-[14px] bg-[var(--color-bg)] border border-[var(--color-line)]"
      >
        <input
          type="text"
          placeholder="Staff Name (Optional)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="px-[14px] py-[8px] rounded-[10px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500"
        />
        <input
          type="email"
          required
          placeholder="e.g. staff@glbitm.ac.in or admin email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="px-[14px] py-[8px] rounded-[10px] bg-[var(--color-card-ref)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-[6px] px-[18px] py-[8px] rounded-[10px] bg-[var(--color-navy)] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-xs"
        >
          <Plus className="w-[14px] h-[14px]" />
          <span>Grant Admin</span>
        </button>
      </form>

      {/* Current admins list */}
      {admins.length > 0 && (
        <div className="flex flex-col gap-[8px]">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-mut)]">
            Active Administrators ({admins.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
            {admins.map((adm, i) => (
              <div
                key={adm.email || i}
                className="flex items-center justify-between p-[10px_14px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px]"
              >
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">
                    {adm.name}
                  </p>
                  <p className="text-[12px] text-[var(--color-mut)]">
                    {adm.email}
                  </p>
                </div>
                <span className="px-[8px] py-[2px] rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold">
                  Admin
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
