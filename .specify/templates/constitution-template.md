# Fitness Web App Constitution (Minimal, Dev Phase)

## Core Principles

### I. Simplicity and Maintainability
Focus on clear, modular React patterns for early development.  
Minimum requirements: reusable components, predictable state management, consistent linting/formatting.

### II. Rapid Iteration and MVP Delivery
The app must allow fast feature development and experimentation.  
Minimum requirements: working UI for workout builder, ability to add/edit segments and exercises, testable core logic.

### III. Early UX Considerations
Provide basic usability without full accessibility or production polish.  
Minimum requirements: basic labels for inputs, buttons clearly visible, intuitive navigation.

## Technical Baseline

- Frontend: React + TypeScript + Vite.
- Component state should be predictable; prefer simple `useState`/`useReducer` patterns.
- Core domain objects (`Exercise`, `Segment`, `Workout`) defined as TypeScript types.
- API/backend interactions stubbed or mocked until actual backend exists.
- No sensitive data handling required at this stage.

## Development Workflow

- Pull requests encouraged but team size may be one (self-approval is fine).
- CI/checks optional in early dev.
- Tests recommended for core business logic, not mandatory for UI.
- Documentation: basic inline comments and type definitions for clarity.

## Governance

- This minimal constitution guides decisions during development.
- Any deviation from these principles should be noted in comments/PR description.
- Amendments are simple: update this file with date and short note.

**Version**: 0.1.0 | **Ratified**: 2026-03-11