/**
 * With `html { font-size: 62.5% }`, 1rem = 10px (browser default 16px).
 * Tailwind’s defaults assume 1rem ≈ 16px. Scale rem-based theme tokens by 1.6 so
 * utilities (e.g. `text-base`, `p-4`, `gap-8`) match the previous visual size.
 */
const ROOT_REM_SCALE = 1.6

const scaledSpacing = (() => {
  const baseRem = {
    0.5: 0.125,
    1: 0.25,
    1.5: 0.375,
    2: 0.5,
    2.5: 0.625,
    3: 0.75,
    3.5: 0.875,
    4: 1,
    5: 1.25,
    6: 1.5,
    7: 1.75,
    8: 2,
    9: 2.25,
    10: 2.5,
    11: 2.75,
    12: 3,
    14: 3.5,
    16: 4,
    20: 5,
    24: 6,
    28: 7,
    32: 8,
    36: 9,
    40: 10,
    44: 11,
    48: 12,
    52: 13,
    56: 14,
    60: 15,
    64: 16,
    72: 18,
    80: 20,
    96: 24,
  }
  return {
    px: '1px',
    0: '0px',
    ...Object.fromEntries(
      Object.entries(baseRem).map(([key, rem]) => [key, `${rem * ROOT_REM_SCALE}rem`]),
    ),
  }
})()

const R = ROOT_REM_SCALE

/** Body copy on the root font grid (1rem = 10px): `text-base` / minimum UI text = 1.6rem (16px). */
const MIN_TEXT_REM = '1.6rem'
const MIN_TEXT_LH = '2.4rem'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: scaledSpacing,
      fontSize: {
        xs: [MIN_TEXT_REM, { lineHeight: MIN_TEXT_LH }],
        sm: [MIN_TEXT_REM, { lineHeight: MIN_TEXT_LH }],
        base: [MIN_TEXT_REM, { lineHeight: MIN_TEXT_LH }],
        lg: [`${1.125 * R}rem`, { lineHeight: `${1.75 * R}rem` }],
        xl: [`${1.25 * R}rem`, { lineHeight: `${1.75 * R}rem` }],
        '2xl': [`${1.5 * R}rem`, { lineHeight: `${2 * R}rem` }],
        '3xl': [`${1.875 * R}rem`, { lineHeight: `${2.25 * R}rem` }],
        '4xl': [`${2.25 * R}rem`, { lineHeight: `${2.5 * R}rem` }],
        '5xl': [`${3 * R}rem`, { lineHeight: '1' }],
        '6xl': [`${3.75 * R}rem`, { lineHeight: '1' }],
        '7xl': [`${4.5 * R}rem`, { lineHeight: '1' }],
        '8xl': [`${6 * R}rem`, { lineHeight: '1' }],
        '9xl': [`${8 * R}rem`, { lineHeight: '1' }],
      },
      lineHeight: {
        3: `${0.75 * R}rem`,
        4: `${1 * R}rem`,
        5: `${1.25 * R}rem`,
        6: `${1.5 * R}rem`,
        7: `${1.75 * R}rem`,
        8: `${2 * R}rem`,
        9: `${2.25 * R}rem`,
        10: `${2.5 * R}rem`,
      },
      borderRadius: {
        sm: `${0.125 * R}rem`,
        DEFAULT: `${0.25 * R}rem`,
        md: `${0.375 * R}rem`,
        lg: `${0.5 * R}rem`,
        xl: `${0.75 * R}rem`,
        '2xl': `${1 * R}rem`,
        '3xl': `${1.5 * R}rem`,
      },
      maxWidth: {
        xs: `${20 * R}rem`,
        sm: `${24 * R}rem`,
        md: `${28 * R}rem`,
        lg: `${32 * R}rem`,
        xl: `${36 * R}rem`,
        '2xl': `${42 * R}rem`,
        '3xl': `${48 * R}rem`,
        '4xl': `${56 * R}rem`,
        '5xl': `${64 * R}rem`,
        '6xl': `${72 * R}rem`,
        '7xl': `${80 * R}rem`,
      },
      columns: {
        '3xs': `${16 * R}rem`,
        '2xs': `${18 * R}rem`,
        xs: `${20 * R}rem`,
        sm: `${24 * R}rem`,
        md: `${28 * R}rem`,
        lg: `${32 * R}rem`,
        xl: `${36 * R}rem`,
        '2xl': `${42 * R}rem`,
        '3xl': `${48 * R}rem`,
        '4xl': `${56 * R}rem`,
        '5xl': `${64 * R}rem`,
        '6xl': `${72 * R}rem`,
        '7xl': `${80 * R}rem`,
      },
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
