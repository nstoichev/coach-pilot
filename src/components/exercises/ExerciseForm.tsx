import { useState } from 'react'
import { TRAINING_TYPES, type TrainingType } from '../../types/domain.ts'
import type { Exercise } from '../../types/exercise.ts'

type ExerciseFormProps = {
  initialDraft: Exercise
  onSubmit: (draft: Exercise) => void
  onCancel: () => void
  submitLabel: string
}

const parseCsv = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const toggleTrainingType = (types: TrainingType[], type: TrainingType) =>
  types.includes(type) ? types.filter((item) => item !== type) : [...types, type]

export const ExerciseForm = ({
  initialDraft,
  onSubmit,
  onCancel,
  submitLabel,
}: ExerciseFormProps) => {
  const [draft, setDraft] = useState(initialDraft)

  return (
    <section className="panel">
    <div className="panel-header">
      <div>
        <p className="eyebrow">Exercise Database</p>
        <h2>{submitLabel === 'Save Exercise' ? 'Edit exercise' : 'Create exercise'}</h2>
      </div>
    </div>

    <div className="form-grid">
      <label className="field">
        <span>Exercise name</span>
        <input
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          placeholder="Romanian Deadlift"
        />
      </label>

      <label className="field">
        <span>Equipment (comma separated)</span>
        <input
          value={draft.equipment?.join(', ') ?? ''}
          onChange={(event) =>
            setDraft({
              ...draft,
              equipment: parseCsv(event.target.value),
            })
          }
          placeholder="barbell, plates"
        />
      </label>

      <label className="field">
        <span>Primary muscles (comma separated)</span>
        <input
          value={draft.muscles?.primary.join(', ') ?? ''}
          onChange={(event) =>
            setDraft({
              ...draft,
              muscles: {
                primary: parseCsv(event.target.value),
                stabilizing: draft.muscles?.stabilizing ?? [],
              },
            })
          }
          placeholder="hamstrings, glutes"
        />
      </label>

      <label className="field">
        <span>Stabilizing muscles (comma separated)</span>
        <input
          value={draft.muscles?.stabilizing.join(', ') ?? ''}
          onChange={(event) =>
            setDraft({
              ...draft,
              muscles: {
                primary: draft.muscles?.primary ?? [],
                stabilizing: parseCsv(event.target.value),
              },
            })
          }
          placeholder="core, lats"
        />
      </label>
    </div>

    <div className="field-group">
      <span className="field-group-label">Training type</span>
      <div className="chip-row">
        {TRAINING_TYPES.map((type) => (
          <label key={type} className="checkbox-chip">
            <input
              checked={draft.type.includes(type)}
              type="checkbox"
              onChange={() =>
                setDraft({
                  ...draft,
                  type: toggleTrainingType(draft.type, type),
                })
              }
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="form-grid">
      <label className="field">
        <span>Working weight mode</span>
        <select
          value={draft.workingWeight?.mode ?? ''}
          onChange={(event) => {
            const nextMode = event.target.value

            setDraft({
              ...draft,
              workingWeight: nextMode
                ? {
                    mode: nextMode as 'weight' | 'repMax',
                    value: draft.workingWeight?.value ?? 0,
                  }
                : undefined,
            })
          }}
        >
          <option value="">None</option>
          <option value="weight">Weight</option>
          <option value="repMax">Rep Max</option>
        </select>
      </label>

      <label className="field">
        <span>Working weight value</span>
        <input
          min={0}
          type="number"
          value={draft.workingWeight?.value ?? ''}
          onChange={(event) =>
            setDraft({
              ...draft,
              workingWeight: draft.workingWeight
                ? {
                    ...draft.workingWeight,
                    value: Number(event.target.value),
                  }
                : undefined,
            })
          }
          placeholder="Optional"
        />
      </label>
    </div>

    <div className="inline-actions">
      <button type="button" className="primary-button" onClick={() => onSubmit(draft)}>
        {submitLabel}
      </button>
      <button type="button" onClick={onCancel}>
        Reset
      </button>
    </div>
  </section>
  )
}
