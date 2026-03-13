import { useEffect, useMemo, useRef, useState } from 'react'
import type { Exercise } from '../../types/exercise.ts'

type SegmentExercisePickerProps = {
  availableExercises: Exercise[]
  onAssignExercise: (exerciseId: string) => void
  autoFocus?: boolean
}

export const SegmentExercisePicker = ({
  availableExercises,
  onAssignExercise,
  autoFocus = false,
}: SegmentExercisePickerProps) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const options = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filteredExercises = normalizedQuery
      ? availableExercises.filter((exercise) =>
          exercise.name.toLowerCase().includes(normalizedQuery),
        )
      : availableExercises

    return filteredExercises.slice(0, 10)
  }, [availableExercises, query])

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  if (availableExercises.length === 0) {
    return (
      <div className="empty-state bordered">
        <strong>No exercises available yet.</strong>
        <p>Load or create exercise data before assigning movements to a segment.</p>
      </div>
    )
  }

  return (
    <div className="exercise-picker">
      <p className="muted-text picker-summary">
        Search the mock exercise database and click an exercise to add it.
      </p>

      <div className="search-picker">
        <input
          aria-label="Search exercises"
          className="search-input"
          placeholder="Search exercises"
          ref={inputRef}
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120)
          }}
          onChange={(event) => setQuery(event.target.value)}
        />

        {isFocused ? (
          <div className="search-results">
            {options.length > 0 ? (
              options.map((exercise) => (
                <button
                  key={exercise.id}
                  className="search-result-item"
                  type="button"
                  onMouseDown={() => {
                    onAssignExercise(exercise.id)
                    setQuery('')
                    setIsFocused(false)
                  }}
                >
                  <strong>{exercise.name}</strong>
                  <span>{exercise.type.join(', ')}</span>
                </button>
              ))
            ) : (
              <div className="empty-state bordered">
                <strong>No matching exercises.</strong>
                <p>Try another search term.</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
