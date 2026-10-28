"use client"

import { useState, useEffect } from "react"
import {
  Book,
  Upload,
  Flag,
  CheckCircle,
  AlertTriangle,
  Search,
} from "@/components/ui/Icons"

interface FlaggedItem {
  id: string
  title: string
  uploadedBy: string
  branch: string
  semester: string
  flagReason: string
  flaggedCount: number
}

export function AdminVaultView() {
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [title, setTitle] = useState("")
  const [branch, setBranch] = useState("CSE")
  const [semester, setSemester] = useState("Sem 3")
  const [docType, setDocType] = useState("Notes")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchVaultData = async () => {
    try {
      const res = await fetch("/api/vault")
      const data = await res.json()
      if (data.success && Array.isArray(data.items)) {
        setTotalCount(data.items.length)
        const flagged = data.items
          .filter((it: any) => it.flagged)
          .map((it: any) => ({
            id: it._id,
            title: it.title,
            uploadedBy: it.author || "Student Contributor",
            branch: it.branch,
            semester: it.semester,
            flagReason: it.flagReason || "Quality / syllabus issue reported",
            flaggedCount: it.flaggedCount || 1,
          }))
        setFlaggedItems(flagged)
      }
    } catch (err) {
      console.error("Failed to load vault items:", err)
    }
  }

  useEffect(() => {
    fetchVaultData()
  }, [])

  const handleDismissFlag = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dismiss_flag" }),
      })
      if (res.ok) {
        setFlaggedItems((prev) => prev.filter((item) => item.id !== id))
      }
    } catch (err) {
      console.error("Failed to dismiss flag:", err)
    }
  }

  const handleRemoveDoc = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setFlaggedItems((prev) => prev.filter((item) => item.id !== id))
        setTotalCount((prev) => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error("Failed to remove document:", err)
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("author", "Academic Faculty")
      formData.append("branch", branch)
      formData.append("semester", semester)
      formData.append(
        "type",
        docType === "Notes" ? "PDF" : docType === "PYQ" ? "ZIP" : "PDF",
      )

      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      const res = await fetch("/api/vault", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setUploadSuccess(true)
        setTitle("")
        setSelectedFile(null)
        setTotalCount((prev) => prev + 1)
        setTimeout(() => setUploadSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Failed to upload verified document:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Admin Header */}
      <header className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px_28px] shadow-[var(--shadow-sh)] flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[10px] mb-[6px]">
            <span className="w-[32px] h-[32px] rounded-[10px] bg-blue-600/10 text-blue-500 grid place-items-center">
              <Book className="w-[18px] h-[18px]" />
            </span>
            <h1 className="text-[22px] font-bold text-[var(--color-ink)]">
              Academic Vault • Document Curation Desk
            </h1>
          </div>
          <p className="text-[14px] text-[var(--color-mut)]">
            Upload official department syllabus material, review quality flags,
            and curate repository assets.
          </p>
        </div>

        <span className="px-[12px] py-[6px] rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[12px] font-semibold self-start md:self-auto">
          Admin Access
        </span>
      </header>

      {/* Metric Strip */}
      <section
        aria-label="Vault metrics"
        className="grid grid-cols-2 md:grid-cols-4 gap-[14px]"
      >
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Verified Documents
          </span>
          <span className="text-[26px] font-bold text-[var(--color-ink)]">
            {totalCount}
          </span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Flagged for Review
          </span>
          <span className="text-[26px] font-bold text-red-400">
            {flaggedItems.length}
          </span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Active Repository
          </span>
          <span className="text-[26px] font-bold text-emerald-400">Online</span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Cloudflare R2 Bucket
          </span>
          <span className="text-[26px] font-bold text-[var(--color-ink)]">
            {(totalCount * 2.8).toFixed(1)} MB
          </span>
        </article>
      </section>

      {/* Main Grid: Upload card & Flagged items moderation */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        {/* Upload Form */}
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)]">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <Upload className="w-[18px] h-[18px] text-blue-500" />
            <h2 className="text-[16px] font-bold text-[var(--color-ink)]">
              Upload Official Study Material
            </h2>
          </div>

          {uploadSuccess && (
            <div className="mb-[14px] p-[10px_14px] rounded-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[13px] flex items-center gap-[8px]">
              <CheckCircle className="w-[16px] h-[16px]" />
              Document uploaded &amp; verified into academic repository.
            </div>
          )}

          <form
            onSubmit={handleUploadSubmit}
            className="flex flex-col gap-[12px]"
          >
            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Document Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Operating Systems Unit 1-4 Complete Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
                >
                  <option value="CSE">CSE - Computer Science</option>
                  <option value="IT">IT - Information Tech</option>
                  <option value="ECE">ECE - Electronics</option>
                  <option value="ME">ME - Mechanical</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
                >
                  <option value="Sem 1">Semester 1</option>
                  <option value="Sem 2">Semester 2</option>
                  <option value="Sem 3">Semester 3</option>
                  <option value="Sem 4">Semester 4</option>
                  <option value="Sem 5">Semester 5</option>
                  <option value="Sem 6">Semester 6</option>
                  <option value="Sem 7">Semester 7</option>
                  <option value="Sem 8">Semester 8</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Resource Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-[12px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none cursor-pointer"
              >
                <option value="Notes">Lecture Notes (PDF)</option>
                <option value="PYQ">Previous Year Questions (PYQs)</option>
                <option value="Lab">Lab Manual &amp; Experiments</option>
                <option value="Syllabus">Curriculum / Syllabus Document</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                Upload File (PDF / ZIP to Cloudflare R2)
              </label>
              <input
                type="file"
                accept=".pdf,.zip,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-[12px] py-[7px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] text-[var(--color-mut)] outline-none file:mr-[10px] file:py-[4px] file:px-[10px] file:rounded-[6px] file:border-0 file:text-[12px] file:bg-blue-600/10 file:text-blue-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[6px] py-[10px] rounded-[10px] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-[13px] transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              {isSubmitting
                ? "Uploading to Cloudflare R2..."
                : "Publish Verified Material"}
            </button>
          </form>
        </article>

        {/* Moderation Queue */}
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[18px] p-[22px] shadow-[var(--shadow-sh)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-[14px]">
              <div className="flex items-center gap-[10px]">
                <Flag className="w-[18px] h-[18px] text-red-400" />
                <h2 className="text-[16px] font-bold text-[var(--color-ink)]">
                  Flagged Notes Moderation Queue
                </h2>
              </div>
              <span className="text-[12px] text-[var(--color-mut)] font-medium">
                {flaggedItems.length} reports pending
              </span>
            </div>

            {flaggedItems.length === 0 ? (
              <div className="p-[28px] text-center text-[var(--color-mut)] text-[13px] border border-dashed border-[var(--color-line)] rounded-[14px] mt-[10px]">
                ✓ All student reports cleared. No flagged resources.
              </div>
            ) : (
              <div className="flex flex-col gap-[12px]">
                {flaggedItems.map((item) => (
                  <article
                    key={item.id}
                    className="p-[14px] rounded-[12px] bg-[var(--color-bg)] border border-[var(--color-line)] flex flex-col gap-[8px]"
                  >
                    <div className="flex items-start justify-between gap-[10px]">
                      <div>
                        <h4 className="text-[14px] font-semibold text-[var(--color-ink)]">
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-[var(--color-mut)] mt-[2px]">
                          {item.branch} · {item.semester} · Uploaded by{" "}
                          {item.uploadedBy}
                        </p>
                      </div>
                      <span className="px-[8px] py-[2px] rounded-full bg-red-500/15 text-red-400 text-[11px] font-bold shrink-0">
                        {item.flaggedCount} flags
                      </span>
                    </div>

                    <div className="text-[12px] text-red-400 bg-red-500/10 p-[6px_10px] rounded-[8px]">
                      Reason: {item.flagReason}
                    </div>

                    <div className="flex items-center justify-end gap-[8px] mt-[4px]">
                      <button
                        type="button"
                        onClick={() => handleDismissFlag(item.id)}
                        className="px-[12px] py-[5px] rounded-[8px] border border-[var(--color-line)] text-[12px] text-[var(--color-mut)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(item.id)}
                        className="px-[12px] py-[5px] rounded-[8px] bg-red-600/20 text-red-400 hover:bg-red-600/30 text-[12px] font-semibold transition-colors cursor-pointer"
                      >
                        Remove Document
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}
