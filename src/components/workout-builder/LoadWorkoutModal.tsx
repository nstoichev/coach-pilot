import { useEffect, useMemo, useRef, useState } from 'react'
import type { Workout } from '../../types/workout.ts'

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
    if (isOpen) {
      setQuery('')
      inputRef.current?.focus()
    }
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
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className="modal-panel"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel-header">
          <div>
            <p className="eyebrow">Sample templates</p>
            <h2>Load template</h2>
          </div>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>

        <div className="search-picker">
          <p className="muted-text picker-summary">
            Search by name, then click a template to load it into the builder.
          </p>
          <input
            aria-label="Search sample templates"
            className="search-input"
            placeholder="Search templates (e.g. Fran, Murph)"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="search-results">
            {options.length > 0 ? (
              options.map((sample) => (
                <button
                  key={sample.workout.id}
                  className="search-result-item"
                  type="button"
                  onMouseDown={() => handleSelect(sample.workout)}
                >
                  <strong>{sample.label}</strong>
                </button>
              ))
            ) : (
              <div className="empty-state bordered">
                <strong>No matching template.</strong>
                <p>Try another search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
