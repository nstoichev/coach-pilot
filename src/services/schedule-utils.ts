/**
 * Returns today's local date in YYYY-MM-DD format.
 */
export function getTodayLocalDateString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns true when date is before today (local), using YYYY-MM-DD lexical compare.
 */
export function isDateInPast(date: string | undefined): boolean {
  if (!date || date.trim() === '') return false
  return date < getTodayLocalDateString()
}
