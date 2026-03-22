import type { ExerciseMetric } from '../types/domain.ts'

/** Slider ranges for assigned metric exercises; mins are > 0 where a numeric target is required. */
export const METRIC_RANGES: Record<
  ExerciseMetric,
  { min: number; max: number; step: number; unit: string }
> = {
  calories: { min: 5, max: 500, step: 5, unit: 'kcal' },
  distance: { min: 100, max: 10000, step: 100, unit: 'm' },
  speed: { min: 1, max: 50, step: 1, unit: 'km/h' },
  time: { min: 15, max: 3600, step: 15, unit: 's' },
  /** Custom uses text, not the numeric slider; value stays 0 in domain. */
  custom: { min: 0, max: 1, step: 1, unit: '' },
}

/** Row / bike advanced sliders — mins > 0. */
export const ADVANCED_METRIC_RANGES: Record<
  'speed' | 'watts',
  { min: number; max: number; step: number; unit: string }
> = {
  speed: { min: 1, max: 50, step: 1, unit: 'km/h' },
  watts: { min: 10, max: 500, step: 10, unit: 'W' },
}
