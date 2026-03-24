import { cn } from '../ui/cn.ts'

export type SegmentedOption<T extends string> = {
  value: T
  label: string
  disabled?: boolean
  title?: string
}

type SegmentedControlProps<T extends string> = {
  name: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  ariaLabel?: string
  className?: string
}

const faceBase =
  'flex min-h-[3.6rem] w-full min-w-0 flex-1 items-center justify-center border-l border-primary bg-surface-muted/55 px-3 py-1.5 text-base font-semibold text-text-muted transition-all duration-200 ease-in-out peer-focus-visible:z-10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-accent peer-checked:bg-surface-primary peer-checked:text-text-primary peer-checked:shadow-insetSegment peer-disabled:opacity-40'

/**
 * Single-choice control: flush segments, selected segment looks pressed (inset).
 * Use for small mutually exclusive option sets (see constitution: UI form controls).
 */
export function SegmentedControl<T extends string>({
  name,
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex overflow-hidden rounded-lg border border-primary-strong bg-surface-secondary shadow-insetShallow [&>label:first-child>span]:border-l-0',
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'relative flex min-w-0 flex-1 cursor-pointer',
            opt.disabled ? 'cursor-not-allowed' : 'hover:[&_span]:bg-surface-quaternary/65 hover:[&_span]:text-text-secondary',
          )}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled}
            className="peer sr-only"
            title={opt.title}
            onChange={() => {
              if (!opt.disabled) onChange(opt.value)
            }}
          />
          <span className={faceBase}>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
