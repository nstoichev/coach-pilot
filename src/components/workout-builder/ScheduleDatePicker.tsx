import { useEffect, useRef, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import * as tw from '../../ui/tw.ts'

type ScheduleDatePickerProps = {
  value: string
  min: string
  onChange: (date: string) => void
  ariaLabel?: string
}

function toDate(value: string): Date | undefined {
  if (!value) return undefined
  const d = parseISO(value)
  return Number.isNaN(d.getTime()) ? undefined : d
}

export function ScheduleDatePicker({
  value,
  min,
  onChange,
  ariaLabel = 'Scheduled date',
}: ScheduleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = toDate(value)
  const minDate = toDate(min)
  const [month, setMonth] = useState<Date>(selected ?? minDate ?? new Date())

  useEffect(() => {
    if (!selected) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- keep calendar month aligned to value
    setMonth(selected)
  }, [value, selected])

  useEffect(() => {
    if (!isOpen) return
    const onDocMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [isOpen])

  return (
    <div className={tw.scheduleDatePicker} ref={containerRef}>
      <div className={tw.scheduleDatePickerInputRow}>
        <button
          type="button"
          className={tw.scheduleDatePickerInput}
          onClick={() => setIsOpen((v) => !v)}
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {selected ? format(selected, 'MMM d, yyyy') : 'Select date'}
        </button>
        <button
          type="button"
          className={tw.scheduleDatePickerTrigger}
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Open date picker"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <CalendarIcon />
        </button>
      </div>

      {isOpen ? (
        <div
          className={tw.scheduleDatePickerPopover}
          role="dialog"
          aria-label="Choose date"
        >
          <DayPicker
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={(date) => {
              if (!date) return
              onChange(format(date, 'yyyy-MM-dd'))
              setIsOpen(false)
            }}
            disabled={minDate ? { before: minDate } : undefined}
            showOutsideDays
          />
        </div>
      ) : null}
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
