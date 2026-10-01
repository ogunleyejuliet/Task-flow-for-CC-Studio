/**
 * Date utility functions for consistent local timezone date handling.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Returns today's date formatted as YYYY-MM-DD in the user's local timezone.
 */
export function getLocalTodayISO(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Formats YYYY-MM-DD date string for display (e.g. "Oct 1, 2026").
 */
export function formatDateLabel(isoDate: string | null | undefined): string | null {
  if (!isoDate) return null
  const [yearStr, monthStr, dayStr] = isoDate.split('T')[0].split('-')
  if (!yearStr || !monthStr || !dayStr) return isoDate

  const year = parseInt(yearStr, 10)
  const monthIndex = parseInt(monthStr, 10) - 1
  const day = parseInt(dayStr, 10)

  if (isNaN(year) || isNaN(monthIndex) || isNaN(day) || monthIndex < 0 || monthIndex > 11) {
    return isoDate
  }

  return `${MONTHS[monthIndex]} ${day}, ${year}`
}

/**
 * Checks if a task is due today based on local date.
 */
export function isTaskDueToday(dueDate: string | null | undefined): boolean {
  if (!dueDate) return false
  const dateOnly = dueDate.split('T')[0]
  return dateOnly === getLocalTodayISO()
}

/**
 * Checks if a task is overdue (due date has passed and task is not completed).
 */
export function isTaskOverdue(dueDate: string | null | undefined, status: string): boolean {
  if (!dueDate || status === 'completed') return false
  const dateOnly = dueDate.split('T')[0]
  return dateOnly < getLocalTodayISO()
}
