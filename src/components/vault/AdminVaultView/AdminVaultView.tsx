"use client"

import { useState } from "react"
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

const INITIAL_FLAGGED: FlaggedItem[] = [
  {
    id: "vault-302",
    title: "Data Structures Hand-written Notes (Unit 4)",
    uploadedBy: "24019cs088@glbitm.ac.in",
    branch: "CSE",
    semester: "Sem 3",
    flagReason: "Incomplete pages and blurry scan quality",
    flaggedCount: 3,
  },
  {
    id: "vault-119",
    title: "Operating Systems Old Syllabus PYQs 2018",
    uploadedBy: "24019it142@glbitm.ac.in",
    branch: "IT",
    semester: "Sem 4",
    flagReason: "Outdated 2018 syllabus curriculum",
    flaggedCount: 2,
  },
]

export function AdminVaultView() {
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>(INITIAL_FLAGGED)
  const [title, setTitle] = useState("")
  const [branch, setBranch] = useState("CSE")
  const [semester, setSemester] = useState("Sem 3")
  const [docType, setDocType] = useState("Notes")
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleDismissFlag = (id: string) => {
    setFlaggedItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleRemoveDoc = (id: string) => {
    setFlaggedItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setUploadSuccess(true)
    setTitle("")
    setTimeout(() => setUploadSuccess(false), 3000)
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
            Upload official department syllabus material, review quality flags, and curate repository assets.
          </p>
        </div>

        <span className="px-[12px] py-[6px] rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[12px] font-semibold self-start md:self-auto">
          Admin Access
        </span>
      </header>

      {/* Metric Strip */}
      <section aria-label="Vault metrics" className="grid grid-cols-2 md:grid-cols-4 gap-[14px]">
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Verified Documents
          </span>
          <span className="text-[26px] font-bold text-[var(--color-ink)]">48</span>
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
            Pending Submissions
          </span>
          <span className="text-[26px] font-bold text-amber-400">5</span>
        </article>
        <article className="bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[14px] p-[16px_18px]">
          <span className="text-[12px] text-[var(--color-mut)] font-medium block mb-[4px]">
            Cloudflare R2 Storage
          </span>
          <span className="text-[26px] font-bold text-[var(--color-ink)]">342 MB</span>
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

          <form onSubmit={handleUploadSubmit} className="flex flex-col gap-[12px]">
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

            <button
              type="submit"
              className="mt-[6px] py-[10px] rounded-[10px] bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[13px] transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              Publish Verified Material
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
                          {item.branch} · {item.semester} · Uploaded by {item.uploadedBy}
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
