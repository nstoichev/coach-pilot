/**
 * Schedule/calendar helpers. Uses local date for "today" and past checks.
 */

/** Returns today's date in local timezone as YYYY-MM-DD (for input[type="date"] and storage). */
export function getTodayLocalDateString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns true if the given date string (YYYY-MM-DD) is before today (local date).
 * Invalid or empty string is treated as not in the past (so we don't block on invalid input).
 */
export function isDateInPast(date: string | undefined): boolean {
  if (!date || date.trim() === '') return false
  const today = getTodayLocalDateString()
  return date < today
}
