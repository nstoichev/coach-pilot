import type { SegmentType } from '../../types/domain.ts'

type SegmentTypeModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelectSegmentType: (segmentType: SegmentType) => void
}

const segmentOptions: Array<{
  type: SegmentType
  title: string
}> = [
  {
    type: 'emom',
    title: 'EMOM',
  },
  {
    type: 'amrap',
    title: 'AMRAP',
  },
  {
    type: 'forTime',
    title: 'For Time',
  },
  {
    type: 'custom',
    title: 'Custom',
  },
]

export const SegmentTypeModal = ({
  isOpen,
  onClose,
  onSelectSegmentType,
}: SegmentTypeModalProps) => {
  if (!isOpen) {
    return null
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

        <div className="segment-type-grid">
          {segmentOptions.map((option) => (
            <button
              key={option.type}
              className="segment-type-card"
              type="button"
              onClick={() => onSelectSegmentType(option.type)}
            >
              <strong>{option.title}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
