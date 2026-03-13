import type { Exercise } from '../../types/exercise.ts'

type ExerciseListItemProps = {
  exercise: Exercise
  isSelected: boolean
  deleteMessage?: string | null
  onEdit: () => void
  onDelete: () => void
}

export const ExerciseListItem = ({
  exercise,
  isSelected,
  deleteMessage,
  onEdit,
  onDelete,
}: ExerciseListItemProps) => (
  <article className={`exercise-record${isSelected ? ' exercise-record-selected' : ''}`}>
    <div className="exercise-record-copy">
      <div className="panel-header">
        <div>
          <h3>{exercise.name}</h3>
          <p className="muted-text">{exercise.type.join(', ')}</p>
        </div>
      </div>

      <p className="muted-text">
        Equipment: {exercise.equipment?.join(', ') || 'None'}
      </p>
      <p className="muted-text">
        Primary muscles: {exercise.muscles?.primary.join(', ') || 'None'}
      </p>
      <p className="muted-text">
        Stabilizing muscles: {exercise.muscles?.stabilizing.join(', ') || 'None'}
      </p>
      <p className="muted-text">
        Working weight:{' '}
        {exercise.workingWeight
          ? `${exercise.workingWeight.mode} (${exercise.workingWeight.value})`
          : 'Not set'}
      </p>

      {deleteMessage ? <p className="warning-text">{deleteMessage}</p> : null}
    </div>

    <div className="stacked-actions">
      <button type="button" onClick={onEdit}>
        Edit
      </button>
      <button
        type="button"
        className="danger-button"
        onClick={onDelete}
        title={deleteMessage ?? 'Delete exercise'}
      >
        Delete
      </button>
    </div>
  </article>
)
