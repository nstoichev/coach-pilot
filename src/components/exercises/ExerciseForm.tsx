import { useState } from 'react'
import { TRAINING_TYPES } from '../../types/domain.ts'
import type { Exercise } from '../../types/exercise.ts'
import { cn } from '../../ui/cn.ts'
import * as tw from '../../ui/tw.ts'
import { ToggleSwitch } from '../ToggleSwitch.tsx'

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

export const ExerciseForm = ({
  initialDraft,
  onSubmit,
  onCancel,
  submitLabel,
}: ExerciseFormProps) => {
  const [draft, setDraft] = useState(initialDraft)

  return (
    <section className={tw.panel}>
      <div className={tw.panelHeader}>
        <div>
          <p className={tw.eyebrow}>Exercise Database</p>
          <h2 className={tw.panelTitle}>
            {submitLabel === 'Save Exercise' ? 'Edit exercise' : 'Create exercise'}
          </h2>
        </div>
      </div>

      <div className={tw.formGrid}>
        <label className={tw.field}>
          <span className={tw.fieldSpanLabel}>Exercise name</span>
          <input
            className={tw.fieldInput}
            value={draft.name}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder="Romanian Deadlift"
          />
        </label>

        <label className={tw.field}>
          <span className={tw.fieldSpanLabel}>Equipment (comma separated)</span>
          <input
            className={tw.fieldInput}
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

        <label className={tw.field}>
          <span className={tw.fieldSpanLabel}>Primary muscles (comma separated)</span>
          <input
            className={tw.fieldInput}
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

        <label className={tw.field}>
          <span className={tw.fieldSpanLabel}>Stabilizing muscles (comma separated)</span>
          <input
            className={tw.fieldInput}
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

      <div className={tw.fieldGroup}>
        <span className={tw.fieldGroupLabel}>Training type</span>
        <div className={cn(tw.toggleSwitchRow, tw.toggleSwitchRowInline)}>
          {TRAINING_TYPES.map((type) => (
            <ToggleSwitch
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              checked={draft.type.includes(type)}
              onChange={(on) =>
                setDraft({
                  ...draft,
                  type: on
                    ? draft.type.includes(type)
                      ? draft.type
                      : [...draft.type, type]
                    : draft.type.filter((t) => t !== type),
                })
              }
            />
          ))}
        </div>
      </div>

      <div className={tw.formGrid}>
        <label className={tw.field}>
          <span className={tw.fieldSpanLabel}>Working weight mode</span>
          <select
            className={tw.fieldInputSelect}
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

        <label className={tw.field}>
          <span className={tw.fieldSpanLabel}>Working weight value</span>
          <input
            className={cn(tw.fieldInput, tw.rangeInput)}
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

      <div className={tw.inlineActions}>
        <button type="button" className={tw.primaryButton} onClick={() => onSubmit(draft)}>
          {submitLabel}
        </button>
        <button type="button" className={tw.secondaryButton} onClick={onCancel}>
          Reset
        </button>
      </div>
    </section>
  )
}
