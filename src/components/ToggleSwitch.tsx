type ToggleSwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  ariaLabel?: string
  /** Extra class on the root &lt;label&gt; (e.g. layout wrappers). */
  className?: string
  disabled?: boolean
}

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
  <label className={['toggle-switch', className].filter(Boolean).join(' ')}>
    <span className="toggle-switch__label">{label}</span>
    <input
      type="checkbox"
      role="switch"
      aria-label={ariaLabel ?? label}
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className="toggle-switch__track" aria-hidden="true" />
  </label>
)
