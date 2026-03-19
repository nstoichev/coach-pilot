import { useEffect, useId, useRef, useState } from 'react'
import { format, isValid, parse } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

const DATE_FORMAT = 'yyyy-MM-dd'
const DISPLAY_FORMAT = 'MMM d, yyyy'

type ScheduleDatePickerProps = {
  /** Current value (YYYY-MM-DD). */
  value: string
  /** Minimum selectable date (YYYY-MM-DD), e.g. today. */
  min: string
  onChange: (date: string) => void
  ariaLabel?: string
}

function parseDateString(s: string): Date | undefined {
  if (!s?.trim()) return undefined
  const d = parse(s, DATE_FORMAT, new Date())
  return isValid(d) ? d : undefined
}

export function ScheduleDatePicker({
  value,
  min,
  onChange,
  ariaLabel = 'Scheduled date (today or future)',
}: ScheduleDatePickerProps) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [month, setMonth] = useState<Date>(() => parseDateString(value) ?? new Date())

  const selectedDate = parseDateString(value)
  const minDate = parseDateString(min)
  const displayValue = selectedDate ? format(selectedDate, DISPLAY_FORMAT) : ''

  // Keep calendar month in sync when value changes (e.g. load workout)
  useEffect(() => {
    if (value && selectedDate) setMonth(selectedDate)
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    onChange(format(date, DATE_FORMAT))
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="schedule-date-picker">
      <div className="schedule-date-picker-input-row">
        <input
          id={id}
          type="text"
          className="schedule-date-picker-input"
          value={displayValue}
          readOnly
          placeholder="Pick a date"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        <button
          type="button"
          className="schedule-date-picker-trigger"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Open calendar"
          aria-expanded={isOpen}
        >
          <CalendarIcon />
        </button>
      </div>
      {isOpen && (
        <div className="schedule-date-picker-popover" role="dialog" aria-label="Choose date">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            disabled={minDate ? { before: minDate } : undefined}
            showOutsideDays
            defaultMonth={selectedDate ?? minDate ?? new Date()}
          />
        </div>
      )}
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
