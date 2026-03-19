import { useEffect, useMemo, useRef, useState } from 'react'
import type { SegmentType } from '../../types/domain.ts'

type SegmentTypeModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelectSegmentType: (segmentType: SegmentType) => void
}

const segmentOptions: Array<{
  type: SegmentType
  title: string
  searchTerms: string
}> = [
  { type: 'emom', title: 'EMOM', searchTerms: 'emom every minute' },
  { type: 'amrap', title: 'AMRAP', searchTerms: 'amrap as many rounds' },
  { type: 'forTime', title: 'For Time', searchTerms: 'for time' },
  { type: 'deathBy', title: 'Death by…', searchTerms: 'death by' },
  { type: 'chipper', title: 'Chipper', searchTerms: 'chipper' },
  { type: 'tabata', title: 'Tabata', searchTerms: 'tabata interval' },
  { type: 'custom', title: 'Custom', searchTerms: 'custom' },
]

export const SegmentTypeModal = ({
  isOpen,
  onClose,
  onSelectSegmentType,
}: SegmentTypeModalProps) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const options = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = normalizedQuery
      ? segmentOptions.filter(
          (option) =>
            option.title.toLowerCase().includes(normalizedQuery) ||
            option.type.toLowerCase().includes(normalizedQuery) ||
            option.searchTerms.toLowerCase().includes(normalizedQuery),
        )
      : segmentOptions
    return filtered.slice(0, 10)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      inputRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSelect = (type: SegmentType) => {
    onSelectSegmentType(type)
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
            <p className="eyebrow">Segment Type</p>
            <h2>Select a segment template</h2>
          </div>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>

        <div className="search-picker">
          <p className="muted-text picker-summary">
            Search or type to find a format, then click to add.
          </p>
          <input
            aria-label="Search segment format"
            className="search-input"
            placeholder="Search segment format (e.g. Tabata, EMOM)"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="search-results">
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.type}
                  className="search-result-item"
                  type="button"
                  onMouseDown={() => handleSelect(option.type)}
                >
                  <strong>{option.title}</strong>
                </button>
              ))
            ) : (
              <div className="empty-state bordered">
                <strong>No matching format.</strong>
                <p>Try another search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
