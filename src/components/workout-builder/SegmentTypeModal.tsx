import { useEffect, useMemo, useRef, useState } from 'react'
import type { SegmentType } from '../../types/domain.ts'
import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'

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
    if (!isOpen) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional modal open reset
    setQuery('')
    inputRef.current?.focus()
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
    <div className={tw.modalOverlay} role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className={tw.modalPanel}
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={tw.panelHeader}>
          <div>
            <p className={tw.eyebrow}>Segment Type</p>
            <h2 className={tw.panelTitle}>Select a segment template</h2>
          </div>
          <button type="button" className={tw.secondaryButton} onClick={onClose}>
            Cancel
          </button>
        </div>

        <div className={tw.searchPicker}>
          <p className={cn(tw.mutedText, tw.pickerSummary)}>
            Search or type to find a format, then click to add.
          </p>
          <input
            aria-label="Search segment format"
            className={tw.searchInput}
            placeholder="Search segment format (e.g. Tabata, EMOM)"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className={tw.searchResults}>
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.type}
                  className={tw.searchResultItem}
                  type="button"
                  onMouseDown={() => handleSelect(option.type)}
                >
                  <strong className={tw.searchResultTitle}>{option.title}</strong>
                </button>
              ))
            ) : (
              <div className={cn(tw.emptyState, tw.bordered)}>
                <strong className={tw.searchResultTitle}>No matching format.</strong>
                <p className={tw.mutedText}>Try another search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
