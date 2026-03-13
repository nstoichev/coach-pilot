import type { Exercise } from '../../types/exercise.ts'
import type { AssignedExercise, Segment } from '../../types/segment.ts'
import { SegmentExercisePicker } from './SegmentExercisePicker.tsx'

type SegmentEditorProps = {
  segment: Segment
  availableExercises: Exercise[]
  isSelected: boolean
  onNameChange: (segment: Segment) => void
  onSelect: () => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAssignExercise: (exerciseId: string) => void
  onRemoveExercise: (exerciseIndex: number) => void
  onUpdateAssignedExercise: (assignedExercise: AssignedExercise) => void
  onMoveExerciseUp: (exerciseIndex: number) => void
  onMoveExerciseDown: (exerciseIndex: number) => void
}

export const SegmentEditor = ({
  segment,
  availableExercises,
  isSelected,
  onNameChange,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAssignExercise,
  onRemoveExercise,
  onUpdateAssignedExercise,
  onMoveExerciseUp,
  onMoveExerciseDown,
}: SegmentEditorProps) => (
  <article
    className={`segment-card${isSelected ? ' segment-card-selected' : ''}`}
    onClick={onSelect}
  >
    <div className="segment-card-header">
      <label className="field grow">
        <span>Segment name</span>
        <input
          value={segment.name}
          onChange={(event) =>
            onNameChange({
              ...segment,
              name: event.target.value,
            })
          }
          onClick={(event) => event.stopPropagation()}
        />
      </label>

      <div className="stacked-actions" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onMoveUp}>
          Move Up
        </button>
        <button type="button" onClick={onMoveDown}>
          Move Down
        </button>
        <button type="button" className="danger-button" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>

    <div className="segment-card-body" onClick={(event) => event.stopPropagation()}>
      <SegmentExercisePicker
        availableExercises={availableExercises}
        onAssignExercise={onAssignExercise}
      />

      {segment.exercises.length === 0 ? (
        <p className="muted-text">No exercises assigned yet.</p>
      ) : (
        <ul className="exercise-list">
          {segment.exercises.map((assignedExercise, index) => (
            <li
              key={`${segment.id}-${assignedExercise.id}-${index}`}
              className="exercise-list-item exercise-list-item-detailed"
            >
              <div>
                <strong>{assignedExercise.exercise.name}</strong>
                <p>{assignedExercise.exercise.type.join(', ')}</p>
              </div>

              <div className="prescription-grid">
                <label className="field">
                  <span>Sets</span>
                  <input
                    min={1}
                    type="number"
                    value={assignedExercise.sets ?? ''}
                    onChange={(event) =>
                      onUpdateAssignedExercise({
                        ...assignedExercise,
                        sets:
                          event.target.value === '' ? undefined : Number(event.target.value),
                      })
                    }
                  />
                </label>

                <label className="field">
                  <span>Reps</span>
                  <input
                    min={1}
                    type="number"
                    value={assignedExercise.repetitions ?? ''}
                    onChange={(event) =>
                      onUpdateAssignedExercise({
                        ...assignedExercise,
                        repetitions:
                          event.target.value === '' ? undefined : Number(event.target.value),
                      })
                    }
                  />
                </label>
              </div>

              <div className="inline-actions">
                <button type="button" onClick={() => onMoveExerciseUp(index)}>
                  Up
                </button>
                <button type="button" onClick={() => onMoveExerciseDown(index)}>
                  Down
                </button>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => onRemoveExercise(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </article>
)
