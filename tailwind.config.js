/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          primary: '#020617',
          secondary: '#0f172a',
          tertiary: '#1e293b',
          quaternary: '#334155',
          elevated: 'rgba(15, 23, 42, 0.98)',
          panel: 'rgba(15, 23, 42, 0.88)',
          muted: 'rgba(30, 41, 59, 0.75)',
          input: 'rgba(15, 23, 42, 0.85)',
          card: 'rgba(30, 41, 59, 0.82)',
          soft: 'rgba(2, 6, 23, 0.45)',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#e2e8f0',
          muted: '#94a3b8',
        },
        primary: {
          DEFAULT: 'rgba(148, 163, 184, 0.35)',
          subtle: 'rgba(148, 163, 184, 0.25)',
          faint: 'rgba(148, 163, 184, 0.16)',
          strong: 'rgba(100, 116, 139, 0.45)',
        },
        action: {
          DEFAULT: '#2563eb',
          hover: '#3b82f6',
          foreground: '#eff6ff',
        },
        success: {
          DEFAULT: '#22c55e',
          soft: 'rgba(34, 197, 94, 0.15)',
          border: 'rgba(34, 197, 94, 0.4)',
          strong: 'rgba(34, 197, 94, 0.6)',
          foreground: '#86efac',
          glow: 'rgba(34, 197, 94, 0.35)',
          surface: 'rgba(20, 35, 25, 0.95)',
        },
        danger: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          soft: 'rgba(127, 29, 29, 0.25)',
          border: 'rgba(239, 68, 68, 0.7)',
          light: '#fca5a5',
          glow: 'rgba(239, 68, 68, 0.35)',
          surface: 'rgba(30, 23, 23, 0.95)',
        },
        accent: {
          DEFAULT: '#38bdf8',
          soft: 'rgba(56, 189, 248, 0.35)',
          foreground: '#bae6fd',
          tint: 'rgba(14, 165, 233, 0.16)',
        },
        warning: {
          border: 'rgba(251, 191, 36, 0.5)',
          borderHover: 'rgba(251, 191, 36, 0.7)',
          foreground: '#fbbf24',
        },
        overlay: 'rgba(2, 6, 23, 0.68)',
        rdp: {
          accent: '#2563eb',
          accentMuted: 'rgba(37, 99, 235, 0.25)',
        },
      },
      boxShadow: {
        surface: '0 20px 45px rgba(15, 23, 42, 0.25)',
        modal: '0 24px 60px rgba(15, 23, 42, 0.45)',
        dropdown: '0 18px 40px rgba(15, 23, 42, 0.35)',
        popover: '0 20px 45px rgba(2, 6, 23, 0.6)',
        insetSegment: 'inset 0 2px 5px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(0, 0, 0, 0.2)',
        insetShallow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        knob: '0 0 0 1px rgba(15, 23, 42, 0.75)',
        knobActive: '0 0 0 1px rgba(15, 23, 42, 0.8)',
      },
    },
  },
  plugins: [],
}
