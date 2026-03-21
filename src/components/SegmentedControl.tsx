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
      className={['segmented-control', className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={[
            'segmented-control__item',
            opt.disabled ? 'segmented-control__item--disabled' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled}
            className="segmented-control__input"
            title={opt.title}
            onChange={() => {
              if (!opt.disabled) onChange(opt.value)
            }}
          />
          <span className="segmented-control__face">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
