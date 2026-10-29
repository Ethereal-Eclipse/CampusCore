"use client"

import { useState, useEffect } from "react"
import { Search, Upload, Book, CheckCircle, X, Dl } from "@/components/ui/Icons"
import { ModuleHeader } from "@/components/layout/ModuleHeader"
import { ResourceCard, ResourceData } from "../ResourceCard"

const BRANCHES = ["All", "CSE", "IT", "ECE", "ME"]
const SEMESTERS = [
  "All",
  "Sem 1",
  "Sem 2",
  "Sem 3",
  "Sem 4",
  "Sem 5",
  "Sem 6",
  "Sem 7",
  "Sem 8",
]

export function StudentVaultView() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [selectedSemester, setSelectedSemester] = useState("All")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Upload modal state
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [branch, setBranch] = useState("CSE")
  const [semester, setSemester] = useState("Sem 3")
  const [docType, setDocType] = useState("PDF")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedBranch !== "All") params.set("branch", selectedBranch)
      if (selectedSemester !== "All") params.set("semester", selectedSemester)
      if (search.trim()) params.set("search", search.trim())

      const res = await fetch(`/api/vault?${params.toString()}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.items)) {
        setResources(data.items)
      }
    } catch (err) {
      console.error("Failed to fetch vault items:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [selectedBranch, selectedSemester, search])

  const handleDownload = (res: any) => {
    const docId = res._id || res.id
    if (docId) {
      window.open(`/api/vault/${docId}/download`, "_blank")
    } else {
      window.open(
        res.fileUrl ||
          "https://pub-campuscore.r2.dev/vault/sample_document.pdf",
        "_blank",
      )
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.set("title", title.trim())
      formData.set("author", author.trim() || "Student Contributor")
      formData.set("branch", branch)
      formData.set("semester", semester)
      formData.set("type", docType)
      if (selectedFile) {
        formData.set("file", selectedFile)
      }

      const res = await fetch("/api/vault", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        setToastMessage("Material uploaded to Academic Vault & Cloudflare R2!")
        setIsModalOpen(false)
        setTitle("")
        setAuthor("")
        setSelectedFile(null)
        fetchResources()
        setTimeout(() => setToastMessage(""), 3500)
      }
    } catch (err) {
      console.error("Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <ModuleHeader
        title="Academic Vault"
        description="Access and download verified notes, PYQs, and lab manuals from Cloudflare R2 storage."
      >
        <div className="flex items-center gap-[10px] w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[260px]">
            <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--color-mut)]" />
            <input
              type="text"
              placeholder="Search notes, PYQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--color-bg)] border border-[var(--color-line)] rounded-full py-[10px] pl-[40px] pr-[16px] text-[13px] text-[var(--color-ink)] outline-none focus:border-[var(--color-navy)] transition-colors cursor-text"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-[6px] px-[16px] py-[10px] rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <Upload className="w-[14px] h-[14px]" />
            <span>Upload Notes</span>
          </button>
        </div>
      </ModuleHeader>

      {/* Toast Alert */}
      {toastMessage && (
        <aside
          role="status"
          className="p-[12px_16px] rounded-[12px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[13px] font-semibold flex items-center gap-[8px]"
        >
          <CheckCircle className="w-[16px] h-[16px]" />
          {toastMessage}
        </aside>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] bg-[var(--color-card-ref)] p-[12px_16px] rounded-[16px] border border-[var(--color-line)]">
        {/* Branch Filters */}
        <div className="flex items-center gap-[6px] overflow-x-auto pb-[2px] sm:pb-0">
          <span className="text-[12px] text-[var(--color-mut)] font-semibold uppercase tracking-wider mr-[4px]">
            Branch:
          </span>
          {BRANCHES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBranch(b)}
              className={`px-[12px] py-[5px] rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                selectedBranch === b
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-[var(--color-bg)] text-[var(--color-mut)] hover:text-[var(--color-ink)]"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Semester Select */}
        <div className="flex items-center gap-[8px] shrink-0">
          <span className="text-[12px] text-[var(--color-mut)] font-semibold">
            Semester:
          </span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-[12px] py-[6px] rounded-full bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] text-[var(--color-ink)] outline-none cursor-pointer"
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Catalog Grid */}
      {loading ? (
        <div className="p-[40px] text-center text-[var(--color-mut)] text-[14px]">
          Loading academic vault documents...
        </div>
      ) : resources.length === 0 ? (
        <div className="p-[40px] text-center text-[var(--color-mut)] bg-[var(--color-card-ref)] border border-dashed border-[var(--color-line)] rounded-[18px]">
          <Book className="w-[32px] h-[32px] mx-auto mb-[10px] opacity-40" />
          <p className="text-[14px] font-medium">
            No documents found matching criteria.
          </p>
        </div>
      ) : (
        <section
          aria-label="Academic resources catalog"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]"
        >
          {resources.map((res) => (
            <ResourceCard
              key={res._id || res.id}
              resource={{
                id: res._id || res.id,
                title: res.title,
                author: res.author,
                type: res.type,
                size: res.size,
                branch: res.branch,
                semester: res.semester,
              }}
              onDownload={() => handleDownload(res)}
            />
          ))}
        </section>
      )}

      {/* Upload Resource Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <article
            className="w-full max-w-[500px] bg-[var(--color-card-ref)] border border-[var(--color-line)] rounded-[20px] p-[24px] shadow-2xl text-[var(--color-ink)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-[18px]">
              <div className="flex items-center gap-[10px]">
                <span className="w-[32px] h-[32px] rounded-[10px] bg-blue-600/10 text-blue-500 grid place-items-center">
                  <Upload className="w-[18px] h-[18px]" />
                </span>
                <h3 className="text-[17px] font-bold text-[var(--color-ink)]">
                  Upload Notes or PYQs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-[30px] h-[30px] rounded-full grid place-items-center text-[var(--color-mut)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            <form
              onSubmit={handleUploadSubmit}
              className="flex flex-col gap-[14px]"
            >
              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compiler Design Unit 1-3 Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-[14px] py-[9px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[13px] text-[var(--color-ink)] outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Author or Professor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Verma / Student Notes"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
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
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
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
                    <option value="Sem 1">Sem 1</option>
                    <option value="Sem 2">Sem 2</option>
                    <option value="Sem 3">Sem 3</option>
                    <option value="Sem 4">Sem 4</option>
                    <option value="Sem 5">Sem 5</option>
                    <option value="Sem 6">Sem 6</option>
                    <option value="Sem 7">Sem 7</option>
                    <option value="Sem 8">Sem 8</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[var(--color-mut)] mb-[4px]">
                  Document File (Cloudflare R2 Storage)
                </label>
                <input
                  type="file"
                  accept=".pdf,.zip,.docx,.pptx"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-[14px] py-[8px] rounded-[10px] bg-[var(--color-bg)] border border-[var(--color-line)] text-[12px] text-[var(--color-ink)] outline-none file:mr-[10px] file:py-[4px] file:px-[10px] file:rounded-full file:border-0 file:bg-blue-600/10 file:text-blue-600 file:font-semibold cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-[10px] mt-[8px]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-[16px] py-[8px] rounded-full border border-[var(--color-line)] text-[13px] font-semibold text-[var(--color-mut)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-[20px] py-[8px] rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Upload to Vault"}
                </button>
              </div>
            </form>
          </article>
        </div>
      )}
    </div>
  )
}
