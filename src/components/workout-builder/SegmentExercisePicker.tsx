import { useEffect, useMemo, useRef, useState } from 'react'
import type { Exercise } from '../../types/exercise.ts'
import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'

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
      <div className={cn(tw.emptyState, tw.bordered)}>
        <strong className={tw.searchResultTitle}>No exercises available yet.</strong>
        <p className={tw.mutedText}>
          Load or create exercise data before assigning movements to a segment.
        </p>
      </div>
    )
  }

  return (
    <div className={tw.exercisePicker}>
      <p className={cn(tw.mutedText, tw.pickerSummary)}>
        Search the mock exercise database and click an exercise to add it.
      </p>

      <div className={tw.searchPicker}>
        <input
          aria-label="Search exercises"
          className={tw.searchInput}
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
          <div className={tw.searchResults}>
            {options.length > 0 ? (
              options.map((exercise) => (
                <button
                  key={exercise.id}
                  className={tw.searchResultItem}
                  type="button"
                  onMouseDown={() => {
                    onAssignExercise(exercise.id)
                    setQuery('')
                    setIsFocused(false)
                  }}
                >
                  <strong className={tw.searchResultTitle}>{exercise.name}</strong>
                  <span className={tw.searchResultMeta}>{exercise.type.join(', ')}</span>
                </button>
              ))
            ) : (
              <div className={cn(tw.emptyState, tw.bordered)}>
                <strong className={tw.searchResultTitle}>No matching exercises.</strong>
                <p className={tw.mutedText}>Try another search term.</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
