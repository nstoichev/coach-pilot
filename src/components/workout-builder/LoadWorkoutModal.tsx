import { useEffect, useMemo, useRef, useState } from 'react'
import type { Workout } from '../../types/workout.ts'
import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'

export type LoadWorkoutSample = { label: string; workout: Workout }

type LoadWorkoutModalProps = {
  isOpen: boolean
  onClose: () => void
  samples: LoadWorkoutSample[]
  onSelectWorkout: (workout: Workout) => void
}

export const LoadWorkoutModal = ({
  isOpen,
  onClose,
  samples,
  onSelectWorkout,
}: LoadWorkoutModalProps) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const options = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = normalizedQuery
      ? samples.filter((s) => {
          const hay = `${s.label} ${s.workout.name}`.toLowerCase()
          return hay.includes(normalizedQuery)
        })
      : samples
    return filtered.slice(0, 20)
  }, [query, samples])

  useEffect(() => {
    if (!isOpen) return
    // Reset search when opening; focus is tied to the same user gesture as open.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional modal open reset
    setQuery('')
    inputRef.current?.focus()
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSelect = (workout: Workout) => {
    onSelectWorkout(workout)
    setQuery('')
    onClose()
  }

  return (
    <div className={tw.modalOverlay} role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className={tw.modalPanel}
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={tw.panelHeader}>
          <div>
            <p className={tw.eyebrow}>Sample templates</p>
            <h2 className={tw.panelTitle}>Load template</h2>
          </div>
          <button type="button" className={tw.secondaryButton} onClick={onClose}>
            Cancel
          </button>
        </div>

        <div className={tw.searchPicker}>
          <p className={cn(tw.mutedText, tw.pickerSummary)}>
            Search by name, then click a template to load it into the builder.
          </p>
          <input
            aria-label="Search sample templates"
            className={tw.searchInput}
            placeholder="Search templates (e.g. Fran, Murph)"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className={tw.searchResults}>
            {options.length > 0 ? (
              options.map((sample) => (
                <button
                  key={sample.workout.id}
                  className={tw.searchResultItem}
                  type="button"
                  onMouseDown={() => handleSelect(sample.workout)}
                >
                  <strong className={tw.searchResultTitle}>{sample.label}</strong>
                </button>
              ))
            ) : (
              <div className={cn(tw.emptyState, tw.bordered)}>
                <strong className={tw.searchResultTitle}>No matching template.</strong>
                <p className={tw.mutedText}>Try another search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
