import { cn } from '../ui/cn.ts'

type ToggleSwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  ariaLabel?: string
  /** Extra classes on the root &lt;label&gt; (e.g. layout wrappers). */
  className?: string
  disabled?: boolean
}

const track =
  'relative h-[1.1rem] w-8 shrink-0 rounded-full border border-primary bg-surface-primary transition-all duration-200 ease-in-out before:absolute before:left-[0.15rem] before:top-1/2 before:h-3 before:w-3 before:-translate-y-1/2 before:rounded-full before:bg-text-secondary before:shadow-knob before:transition-all before:duration-200 before:ease-in-out peer-checked:border-success peer-checked:bg-success peer-checked:before:translate-x-[0.9rem] peer-checked:before:bg-surface-secondary peer-checked:before:shadow-knobActive peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:opacity-45'

/**
 * Binary on/off control — use for all boolean checkboxes in the app (see constitution: UI form controls).
 */
export const ToggleSwitch = ({
  label,
  checked,
  onChange,
  ariaLabel,
  className,
  disabled,
}: ToggleSwitchProps) => (
  <label
    className={cn(
      'inline-flex cursor-pointer items-center gap-1.5 text-sm text-text-secondary transition-opacity duration-200 ease-in-out hover:opacity-90',
      disabled && 'cursor-not-allowed opacity-60',
      className,
    )}
  >
    <span className="text-sm text-text-secondary">{label}</span>
    <input
      type="checkbox"
      role="switch"
      aria-label={ariaLabel ?? label}
      checked={checked}
      disabled={disabled}
      className="peer sr-only"
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className={track} aria-hidden="true" />
  </label>
)
