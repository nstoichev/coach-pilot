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

/** Track + thumb use theme spacing so size stays correct with root 62.5% + scaled Tailwind. */
const track =
  'relative h-6 w-10 shrink-0 rounded-full border border-primary bg-surface-primary transition-colors duration-200 ease-in-out before:pointer-events-none before:absolute before:left-1 before:top-1/2 before:size-4 before:-translate-y-1/2 before:rounded-full before:bg-text-secondary before:shadow-knob before:transition-transform before:duration-200 before:ease-in-out peer-checked:border-action peer-checked:bg-action peer-checked:before:translate-x-4 peer-checked:before:bg-action-foreground peer-checked:before:shadow-knobActive peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:opacity-45'

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
      'inline-flex cursor-pointer items-center gap-2 text-base text-text-secondary transition-opacity duration-200 ease-in-out hover:opacity-90',
      disabled && 'cursor-not-allowed opacity-60',
      className,
    )}
  >
    <span className="text-base text-text-secondary">{label}</span>
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
