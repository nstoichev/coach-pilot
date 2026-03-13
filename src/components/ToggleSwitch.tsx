type ToggleSwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  ariaLabel?: string
}

export const ToggleSwitch = ({ label, checked, onChange, ariaLabel }: ToggleSwitchProps) => (
  <label className="max-toggle">
    <span className="max-toggle-text">{label}</span>
    <input
      type="checkbox"
      role="switch"
      aria-label={ariaLabel ?? label}
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className="max-toggle-switch" aria-hidden="true" />
  </label>
)

