import { useCallback, useEffect, useRef, useState } from 'react'
import { applyRepSequenceToSetsRepsRepetitions } from '../../services/workout-domain.ts'
import {
  buildRepSequence,
  correctRepSchemeConfig,
  defaultRepSchemeForPattern,
  isSegmentRepGenActive,
  nearestOddRounds,
  segmentHasTimingLockedRounds,
  segmentSupportsRepetitionGeneration,
} from '../../services/repetition-generation.ts'
import type { RepSchemeConfig, RepSchemePattern, Segment } from '../../types/segment.ts'

type SegmentRepGenerationPanelProps = {
  segment: Segment
  onCommit: (segment: Segment) => void
}

const PATTERN_OPTIONS: { id: RepSchemePattern; label: string }[] = [
  { id: 'linear', label: 'Linear' },
  { id: 'pyramid', label: 'Pyramid' },
  { id: 'fixed', label: 'Fixed' },
]

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

/** T011: empty / invalid token → fallback; no errors thrown. */
function parseOptionalInt(s: string, fallback: number): number {
  const t = s.trim()
  if (t === '') return fallback
  const n = Number.parseInt(t, 10)
  return Number.isFinite(n) ? n : fallback
}

function sequencesEqual(a: number[] | undefined, b: number[]): boolean {
  if (!a || a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

function repConfigsEffectivelyEqual(a: RepSchemeConfig, b: RepSchemeConfig): boolean {
  return (
    a.pattern === b.pattern &&
    a.rounds === b.rounds &&
    a.start === b.start &&
    a.end === b.end &&
    a.peak === b.peak &&
    a.reps === b.reps
  )
}

export function SegmentRepGenerationPanel({ segment, onCommit }: SegmentRepGenerationPanelProps) {
  if (!segmentSupportsRepetitionGeneration(segment)) {
    return null
  }

  const segmentRef = useRef(segment)
  segmentRef.current = segment
  const onCommitRef = useRef(onCommit)
  onCommitRef.current = onCommit

  /** EMOM / For Time: rounds come from segment timing controls (single source of truth). */
  const timingRoundsLocked = segmentHasTimingLockedRounds(segment)
  const lockedRounds = segment.rounds ?? 1
  const repGenActive = isSegmentRepGenActive(segment)

  const [pattern, setPattern] = useState<RepSchemePattern>('linear')
  const [roundsInput, setRoundsInput] = useState('5')
  const [startInput, setStartInput] = useState('10')
  const [endInput, setEndInput] = useState('10')
  const [peakInput, setPeakInput] = useState('20')
  const [repsInput, setRepsInput] = useState('10')
  /** Shown when blur/commit would persist invalid pyramid parity (T016 — no toast). */
  const [pyramidOddHint, setPyramidOddHint] = useState('')

  const syncFromSegment = useCallback(() => {
    const rs = segment.repScheme
    if (timingRoundsLocked) {
      setRoundsInput(String(segment.rounds ?? lockedRounds))
    } else {
      const r = rs?.rounds ?? segment.rounds ?? 5
      setRoundsInput(String(r))
    }
    setPattern(rs?.pattern ?? 'linear')
    setStartInput(String(rs?.start ?? 10))
    setEndInput(String(rs?.end ?? 10))
    setPeakInput(String(rs?.peak ?? 20))
    setRepsInput(String(rs?.reps ?? 10))
  }, [lockedRounds, segment.repScheme, segment.rounds, timingRoundsLocked])

  useEffect(() => {
    if (!repGenActive) return
    syncFromSegment()
  }, [segment.id, repGenActive, syncFromSegment])

  const rs = segment.repScheme
  const roundsSyncKey = [
    segment.id,
    segment.rounds,
    segment.segmentType,
    segment.repGenerationEnabled,
    rs?.pattern,
    rs?.rounds,
    rs?.start,
    rs?.end,
    rs?.peak,
    rs?.reps,
    segment.repSequence?.join(','),
    segment.exercises.map((a) => a.id).join(','),
  ].join('|')

  /**
   * When segment timing rounds (or other source of `rounds`) change, rebuild sequence from the last
   * committed `repScheme` so preview stays in sync without re-blurring numeric fields.
   */
  useEffect(() => {
    const seg = segmentRef.current
    if (!isSegmentRepGenActive(seg) || !seg.repScheme) return

    const locked = segmentHasTimingLockedRounds(seg)
    const roundsForGen =
      locked && seg.rounds !== undefined ? seg.rounds : seg.repScheme.rounds

    const raw: RepSchemeConfig = {
      ...seg.repScheme,
      rounds: roundsForGen,
    }
    const corrected = correctRepSchemeConfig(raw)
    if (locked && seg.rounds !== undefined) {
      corrected.rounds = seg.rounds
    }

    const built = buildRepSequence(corrected)
    if (!built.ok) return

    const seq = built.sequence
    if (
      sequencesEqual(seg.repSequence, seq) &&
      seg.repScheme &&
      repConfigsEffectivelyEqual(seg.repScheme, corrected)
    ) {
      return
    }

    let next: Segment = {
      ...seg,
      repGenerationEnabled: true,
      repScheme: corrected,
      repSequence: seq,
    }
    if (seg.segmentType === 'custom') {
      next = { ...next, rounds: corrected.rounds }
    }
    next = applyRepSequenceToSetsRepsRepetitions(next, seq)
    onCommitRef.current(next)
  }, [roundsSyncKey])

  const pushCommit = useCallback(
    (raw: RepSchemeConfig) => {
      const corrected = correctRepSchemeConfig(raw)
      const built = buildRepSequence(corrected)

      if (!built.ok && built.reason === 'pyramid_even_rounds') {
        syncFromSegment()
        setPyramidOddHint('Pyramid requires an odd number of rounds. Change rounds or pick another pattern.')
        return
      }

      setPyramidOddHint('')

      setPattern(corrected.pattern)
      setStartInput(String(corrected.start ?? 10))
      if (corrected.end !== undefined) setEndInput(String(corrected.end))
      if (corrected.peak !== undefined) setPeakInput(String(corrected.peak))
      if (corrected.reps !== undefined) setRepsInput(String(corrected.reps))
      if (!timingRoundsLocked) setRoundsInput(String(corrected.rounds))

      const nextSequence = built.ok ? built.sequence : segment.repSequence

      let next: Segment = {
        ...segment,
        repGenerationEnabled: true,
        repScheme: corrected,
        repSequence: nextSequence,
      }

      if (built.ok && segment.segmentType === 'custom') {
        next = { ...next, rounds: corrected.rounds }
      }

      if (built.ok && nextSequence && nextSequence.length > 0) {
        next = applyRepSequenceToSetsRepsRepetitions(next, nextSequence)
      }

      onCommit(next)
    },
    [onCommit, segment, syncFromSegment, timingRoundsLocked],
  )

  const handleEnableToggle = (checked: boolean) => {
    setPyramidOddHint('')
    if (!checked) {
      onCommit({
        ...segment,
        repGenerationEnabled: false,
        repScheme: undefined,
        repSequence: undefined,
        ...(segment.segmentType === 'custom' ? { rounds: undefined } : {}),
      })
      return
    }

    const rounds = timingRoundsLocked ? (segment.rounds ?? 10) : 5
    const defaults = defaultRepSchemeForPattern('linear', rounds)
    const corrected = correctRepSchemeConfig(defaults)
    const built = buildRepSequence(corrected)
    if (!built.ok) {
      return
    }

    let next: Segment = {
      ...segment,
      repGenerationEnabled: true,
      repScheme: corrected,
      repSequence: built.sequence,
    }
    if (segment.segmentType === 'custom') {
      next = { ...next, rounds: corrected.rounds }
    }
    next = applyRepSequenceToSetsRepsRepetitions(next, built.sequence)
    onCommit(next)
  }

  const pyramidRadioDisabled = timingRoundsLocked && lockedRounds % 2 === 0

  const handlePatternChange = (next: RepSchemePattern) => {
    if (next === 'pyramid' && pyramidRadioDisabled) return

    let rounds = timingRoundsLocked
      ? lockedRounds
      : clamp(parseOptionalInt(roundsInput, 5), 1, 50)

    if (next === 'pyramid' && !timingRoundsLocked && rounds % 2 === 0) {
      rounds = nearestOddRounds(rounds)
      setRoundsInput(String(rounds))
    }
    if (next !== 'pyramid') {
      setPyramidOddHint('')
    }

    setPattern(next)
    const defaults = defaultRepSchemeForPattern(next, rounds)
    setStartInput(String(defaults.start ?? 10))
    setEndInput(String(defaults.end ?? 10))
    setPeakInput(String(defaults.peak ?? 20))
    setRepsInput(String(defaults.reps ?? 10))
    pushCommit(defaults)
  }

  const handleBlurCommit = () => {
    const rounds = timingRoundsLocked
      ? lockedRounds
      : clamp(parseOptionalInt(roundsInput, 5), 1, 50)
    const raw: RepSchemeConfig = {
      pattern,
      rounds,
      start: parseOptionalInt(startInput, 10),
      end: parseOptionalInt(endInput, 10),
      peak: parseOptionalInt(peakInput, 20),
      reps: parseOptionalInt(repsInput, 10),
    }
    pushCommit(raw)
  }

  const pyramidEvenBlocked = pattern === 'pyramid' && timingRoundsLocked && lockedRounds % 2 === 0

  const previewSequence = segment.repSequence
  /** Hide stale sequence while pyramid + even timing rounds (or blur parity error) until user fixes rounds. */
  const hideRepSequencePreview = pyramidEvenBlocked || Boolean(pyramidOddHint)
  const showPreview =
    repGenActive &&
    Boolean(previewSequence && previewSequence.length > 0) &&
    !hideRepSequencePreview
  const previewLine = previewSequence?.join('-') ?? ''

  return (
    <div className="rep-generation-panel" onClick={(e) => e.stopPropagation()}>
      <label className="rep-generation-enable-row">
        <input
          type="checkbox"
          checked={repGenActive}
          onChange={(e) => handleEnableToggle(e.target.checked)}
        />
        <span>Reps per round</span>
      </label>

      {repGenActive ? (
        <>
          <div className="rep-generation-pattern-row" role="radiogroup" aria-label="Repetition pattern">
            {PATTERN_OPTIONS.map(({ id, label }) => {
              const disabled = id === 'pyramid' && pyramidRadioDisabled
              return (
                <label
                  key={id}
                  className={`rep-generation-pattern-option${disabled ? ' rep-generation-option-disabled' : ''}`}
                >
                  <input
                    type="radio"
                    name={`rep-pattern-${segment.id}`}
                    checked={pattern === id}
                    disabled={disabled}
                    aria-disabled={disabled}
                    title={
                      disabled
                        ? 'Pyramid needs an odd number of segment rounds. Change EMOM or For Time rounds first.'
                        : undefined
                    }
                    onChange={() => handlePatternChange(id)}
                  />
                  <span>{label}</span>
                </label>
              )
            })}
          </div>

          {!timingRoundsLocked ? (
            <label className="field">
              <span>Rounds{pattern === 'pyramid' ? ' (odd only)' : ''}</span>
              <input
                type="number"
                min={1}
                max={50}
                step={pattern === 'pyramid' ? 2 : 1}
                value={roundsInput}
                onChange={(e) => setRoundsInput(e.target.value)}
                onBlur={handleBlurCommit}
              />
            </label>
          ) : null}

          {pyramidOddHint ? <p className="rep-generation-hint">{pyramidOddHint}</p> : null}

          {pyramidEvenBlocked ? (
            <p className="field-help">
              Pyramid requires an odd number of rounds. Change segment rounds (EMOM / For Time) or pick
              another pattern.
            </p>
          ) : null}

          {pattern === 'linear' ? (
            <div className="segment-config-grid">
              <label className="field">
                <span>Start reps</span>
                <input
                  type="number"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  onBlur={handleBlurCommit}
                />
              </label>
              <label className="field">
                <span>End reps</span>
                <input
                  type="number"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  onBlur={handleBlurCommit}
                />
              </label>
            </div>
          ) : null}

          {pattern === 'pyramid' && !pyramidEvenBlocked ? (
            <div className="segment-config-grid">
              <label className="field">
                <span>Start reps</span>
                <input
                  type="number"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  onBlur={handleBlurCommit}
                />
              </label>
              <label className="field">
                <span>Peak reps</span>
                <input
                  type="number"
                  value={peakInput}
                  onChange={(e) => setPeakInput(e.target.value)}
                  onBlur={handleBlurCommit}
                />
              </label>
            </div>
          ) : null}

          {pattern === 'fixed' ? (
            <label className="field">
              <span>Reps per round (fixed)</span>
              <input
                type="number"
                min={1}
                value={repsInput}
                onChange={(e) => setRepsInput(e.target.value)}
                onBlur={handleBlurCommit}
              />
            </label>
          ) : null}

          {showPreview ? (
            <p
              className="rep-generation-sequence-line"
              aria-label={`Repetitions per round: ${previewLine}`}
            >
              {previewLine}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
