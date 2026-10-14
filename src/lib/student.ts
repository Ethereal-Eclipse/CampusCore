export function getAcademicBatch(email?: string | null): string {
  if (!email) return "-"
  const clean = email.trim().toLowerCase()
  const match = clean.match(/^(\d{2})\d{3}[a-z]{2}\d{3}@glbitm\.ac\.in$/)
  if (!match) return "-"
  const startYear = 2000 + parseInt(match[1], 10)
  return `${startYear} - ${startYear + 4}`
}
