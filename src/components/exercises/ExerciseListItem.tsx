import type { Exercise } from '../../types/exercise.ts'
import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'

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
  <article
    className={cn(tw.exerciseRecord, isSelected && tw.exerciseRecordSelected)}
  >
    <div className={tw.exerciseRecordCopy}>
      <div className={tw.panelHeader}>
        <div>
          <h3 className={tw.panelTitle}>{exercise.name}</h3>
          <p className={tw.mutedText}>{exercise.type.join(', ')}</p>
        </div>
      </div>

      <p className={tw.mutedText}>
        Equipment: {exercise.equipment?.join(', ') || 'None'}
      </p>
      <p className={tw.mutedText}>
        Primary muscles: {exercise.muscles?.primary.join(', ') || 'None'}
      </p>
      <p className={tw.mutedText}>
        Stabilizing muscles: {exercise.muscles?.stabilizing.join(', ') || 'None'}
      </p>
      <p className={tw.mutedText}>
        Working weight:{' '}
        {exercise.workingWeight
          ? `${exercise.workingWeight.mode} (${exercise.workingWeight.value})`
          : 'Not set'}
      </p>

      {deleteMessage ? <p className={tw.warningText}>{deleteMessage}</p> : null}
    </div>

    <div className={tw.stackedActions}>
      <button type="button" className={tw.secondaryButton} onClick={onEdit}>
        Edit
      </button>
      <button
        type="button"
        className={tw.dangerButton}
        onClick={onDelete}
        title={deleteMessage ?? 'Delete exercise'}
      >
        Delete
      </button>
    </div>
  </article>
)
