# Coach Pilot – Project Constitution

This document defines the engineering principles that guide the development of the Coach Pilot fitness application.

All specifications, plans, and tasks MUST align with this constitution.

---

## Core Principles

### I. Domain First Architecture

The core of the system is the **Workout Domain Model**.

The following entities are considered fundamental and must remain clearly defined and stable:

- Exercise
- Segment
- Workout
- Equipment
- Muscle Group

All new features must integrate with these domain entities rather than introducing parallel structures.

Requirements:

- Domain objects must be defined as **TypeScript types or interfaces**
- Business logic must live outside UI components
- UI should consume domain logic, not implement it

---

### II. Simplicity Over Cleverness

The system must favor **clarity and maintainability** over complex abstractions.

Guidelines:

- Prefer simple React patterns (`useState`, `useReducer`)
- Avoid premature optimization
- Avoid unnecessary libraries
- Prefer readable code over compact code

A future developer should be able to understand the system quickly.

---

### III. Modular Feature Design

Features must be implemented as **independent modules** whenever possible.

Examples:

- Workout Builder
- Exercise Database
- Timer Generator
- Fatigue System
- Calendar / Scheduling
- Segment repetition generation (per-round rep sequences in the builder)

Modules must:

- Have clearly defined inputs/outputs
- Avoid tight coupling with other modules
- Expose small, predictable APIs

This allows the application to evolve without large refactors.

---

### IV. Deterministic Logic

Core workout logic must be **deterministic and testable**.

Examples of deterministic systems:

- Timer generation
- Equipment aggregation
- Fatigue calculation

Requirements:

- Logic must be implemented in pure functions when possible
- Core algorithms should be testable without UI
- Avoid hidden side effects

---

### V. Progressive Complexity

The application will evolve through **layers of complexity**.

Development order:

1. Static workout builder
2. Exercise database
3. Timer generation
4. Calendar and scheduling (workouts attached to dates; calendar view and execution)
4a. Segment repetition generation (linear / pyramid / fixed; extends Segment; see `specs/004-segment-repetition-generation/`)
5. Equipment aggregation
6. Fatigue calculation
7. Adaptive training features

Features should not be implemented before their prerequisite systems exist.

---

## Technical Standards

### Frontend

- React
- TypeScript
- Vite

Rules:

- Components should remain small and focused
- Shared logic belongs in hooks or utility modules
- Avoid deeply nested component trees

#### UI styling system (Tailwind + semantic tokens)

**Normative rules (for AI and human implementers):**

1. **Tailwind CSS is the only allowed styling method** for product UI. Components MUST be styled using Tailwind utility classes only.
2. **No custom CSS classes** (including ad-hoc class names in stylesheets) unless explicitly approved by a constitution amendment that names the exception and its scope.
3. **No default Tailwind palette utilities** in product UI (e.g. `gray-*`, `blue-*`, `slate-*`). Only **design tokens** defined in `tailwind.config.js` (or `tailwind.config.ts` if adopted) are allowed for colors, shadows, and other tokenized theme keys.
4. **No inline styles** (`style={...}`) in components for presentation.
5. **No hardcoded color values** in components (no hex, `rgb()`, or `hsl()` literals in JSX/TSX for UI appearance).

**Semantic color groups** (tokens MUST be defined in Tailwind config under these meanings):

| Group | Role |
|--------|------|
| **surface** | primary, secondary, tertiary — layered backgrounds and panels |
| **text** | primary, secondary, muted — foreground copy hierarchy |
| **primary** | structure — chrome, key structural emphasis (not the same as “brand primary” unless aliased in config) |
| **action** | CTA — primary interactive emphasis |
| **success** | progress — positive completion / OK states |
| **danger** | errors / intensity — failures, warnings, high-intensity emphasis where spec calls for it |
| **accent** | highlights — secondary emphasis and highlights |

Variants such as **soft** (e.g. `success-soft`) are allowed **only** when defined as named tokens in `tailwind.config.js`.

**Utility naming conventions** (map tokens to classes):

- Background: `bg-{token}` — e.g. `bg-surface-secondary`, `bg-action`, `bg-success-soft`
- Text: `text-{token}` — e.g. `text-text-primary`, `text-text-muted`
- Border: `border-{token}`
- Shadow: `shadow-{token}`

**Component rules:**

- Style only with Tailwind utilities; use semantic tokens from config, not raw palette names.

**State rules:**

- **Active** / pressed emphasis → **action** (or dedicated **active** tokens if defined in config).
- **Success** → **success** tokens.
- **Error** → **danger** tokens.
- **Disabled** → combine semantic surfaces/text with **opacity** utilities and **text-muted** (or equivalent muted token).

**Interaction and UX rules:**

- All interactive elements MUST define **hover** and **active** (pressed) visual states.
- Use transitions: **`duration-200`** and **`ease-in-out`** (or equivalent token-backed transition utilities if defined).
- Use **subtle scale** (or equivalent) on press where appropriate for buttons and tappable controls.
- Provide **immediate visual feedback** on user actions (loading/disabled/success/error affordances must be visible without delay beyond normal paint).

**Note:** The build may adopt Tailwind incrementally; until `tailwind.config.*` exists, new UI work MUST still follow this document so implementation matches once Tailwind is wired. Token names MUST live in `tailwind.config.js` (or `.ts`) as the single source of truth.

#### UI — form controls (checkboxes & single-choice radios)

- **Binary checkboxes** (on/off): use the shared **`ToggleSwitch`** component (`src/components/ToggleSwitch.tsx`). Do not use native square checkboxes in product UI unless a documented exception applies (e.g. third-party embeds). **Visual implementation MUST comply with the UI styling system** above (Tailwind utilities + semantic tokens only). Legacy class-based styling in this component is **technical debt** and MUST be migrated to tokens when the file is changed.
- **Mutually exclusive choices** (radio behavior): prefer the shared **`SegmentedControl`** component (`src/components/SegmentedControl.tsx`) — flush segments, selected state visually “pressed” (inset), no floating pill gaps unless wrapping is required. **Visual implementation MUST comply with the UI styling system** above. Legacy class-based styling is **technical debt** to migrate when touched.
- New screens should reuse these patterns before introducing one-off control styles.

---

### Data Model

Core entities must be represented with **strict TypeScript types**.

Examples:

- `Exercise`
- `WorkoutSegment`
- `Workout`
- `Equipment`
- `MuscleGroup`

These types represent the **source of truth for the application**.

---

### Backend

Backend will use:

- Supabase
- PostgreSQL

During early development:

- Mock data or local JSON may be used
- API integration can be introduced incrementally

---

## Development Workflow

The project follows a **spec-driven development workflow**.

Feature development should follow this order:

1. Spec (`spec.md`)
2. Plan (`plan.md`)
3. Tasks (`tasks.md`)
4. Implementation

This ensures AI agents and developers follow the same process.

---

## Testing Philosophy

Testing focuses on **core business logic**.

Priority areas:

- Timer generation
- Fatigue calculation
- Equipment aggregation
- Workout data transformations

UI testing is optional during early development.

---

## Governance

This constitution acts as the **engineering contract** of the project.

All specs, plans, and implementations should align with these principles.

Changes to this document must include:

- Version update
- Date
- Short description of the change

---

Version: 0.3.0  
Ratified: 2026-03-11  
Last amended: 2026-03-22  
Amendment: UI styling system — Tailwind-only, semantic design tokens in `tailwind.config.js`; form controls must comply (ToggleSwitch / SegmentedControl).
