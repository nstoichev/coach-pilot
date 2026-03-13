import type { AssignedExercise, Segment } from '../../types/segment.ts'
import type { Exercise } from '../../types/exercise.ts'
import { SegmentEditor } from './SegmentEditor.tsx'

type SegmentListProps = {
  segments: Segment[]
  availableExercises: Exercise[]
  selectedSegmentId?: string
  onSelectSegment: (segmentId?: string) => void
  onUpdateSegment: (segment: Segment) => void
  onRemoveSegment: (segmentId: string) => void
  onReorderSegments: (fromIndex: number, toIndex: number) => void
  onAssignExercise: (segmentId: string, exerciseId: string) => void
  onRemoveExercise: (segmentId: string, exerciseIndex: number) => void
  onUpdateAssignedExercise: (segmentId: string, assignedExercise: AssignedExercise) => void
  onReorderExercises: (segmentId: string, fromIndex: number, toIndex: number) => void
}

export const SegmentList = ({
  segments,
  availableExercises,
  selectedSegmentId,
  onSelectSegment,
  onUpdateSegment,
  onRemoveSegment,
  onReorderSegments,
  onAssignExercise,
  onRemoveExercise,
  onUpdateAssignedExercise,
  onReorderExercises,
}: SegmentListProps) => {
  if (segments.length === 0) {
    return (
      <section className="panel empty-state">
        <h2>No segments yet</h2>
        <p>Add your first segment to start building the workout flow.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Segments</p>
          <h2>Workout flow</h2>
        </div>
      </div>

      <div className="segment-list">
        {segments.map((segment, index) => (
          <SegmentEditor
            key={segment.id}
            segment={segment}
            availableExercises={availableExercises}
            isSelected={selectedSegmentId === segment.id}
            onNameChange={onUpdateSegment}
            onSelect={() => onSelectSegment(segment.id)}
            onRemove={() => onRemoveSegment(segment.id)}
            onMoveUp={() => onReorderSegments(index, Math.max(0, index - 1))}
            onMoveDown={() =>
              onReorderSegments(index, Math.min(segments.length - 1, index + 1))
            }
            onAssignExercise={(exerciseId) => onAssignExercise(segment.id, exerciseId)}
            onRemoveExercise={(exerciseIndex) => onRemoveExercise(segment.id, exerciseIndex)}
            onUpdateAssignedExercise={(assignedExercise) =>
              onUpdateAssignedExercise(segment.id, assignedExercise)
            }
            onMoveExerciseUp={(exerciseIndex) =>
              onReorderExercises(segment.id, exerciseIndex, Math.max(0, exerciseIndex - 1))
            }
            onMoveExerciseDown={(exerciseIndex) =>
              onReorderExercises(
                segment.id,
                exerciseIndex,
                Math.min(segment.exercises.length - 1, exerciseIndex + 1),
              )
            }
          />
        ))}
      </div>
    </section>
  )
}
