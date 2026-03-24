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
  /** Below `md`: 2-column grid for long option lists (e.g. exercise measure). */
  twoColumnMobile?: boolean
}

const faceBase =
  'flex min-h-[3.6rem] w-full min-w-0 flex-1 items-center justify-center border-l border-primary bg-surface-muted/55 px-3 py-1.5 text-base font-semibold uppercase tracking-wide text-text-muted transition-all duration-200 ease-in-out peer-focus-visible:z-10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-accent peer-checked:bg-surface-primary peer-checked:text-text-primary peer-checked:shadow-insetSegment peer-disabled:opacity-40'

const faceBaseGridMobile = cn(
  faceBase,
  'max-md:border-t max-md:border-primary md:border-t-0',
)

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
  twoColumnMobile = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-primary-strong bg-surface-secondary shadow-insetShallow',
        twoColumnMobile
          ? cn(
              'grid w-full grid-cols-2 md:inline-flex md:w-auto',
              'max-md:[&>label:nth-child(odd)>span]:border-l-0 max-md:[&>label:nth-child(-n+2)>span]:border-t-0 md:[&>label>span]:border-t-0 md:[&>label:first-child>span]:border-l-0',
            )
          : 'inline-flex [&>label:first-child>span]:border-l-0',
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'relative flex min-w-0 cursor-pointer',
            twoColumnMobile ? 'w-full md:flex-1' : 'flex-1',
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
          <span className={twoColumnMobile ? faceBaseGridMobile : faceBase}>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
