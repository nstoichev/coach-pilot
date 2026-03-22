/**
 * Composed Tailwind utility strings — semantic tokens from tailwind.config.js only.
 */
import { cn } from './cn.ts'

export const pageShell = 'w-full'

export const builderShell = 'grid gap-6'

export const exerciseDatabaseGrid =
  'grid gap-6 [grid-template-columns:minmax(280px,1fr)_minmax(360px,1.3fr)] max-[720px]:grid-cols-1'

export const modalOverlay =
  'fixed inset-0 z-20 flex items-center justify-center bg-overlay p-6'

export const modalPanel =
  'w-full max-w-[760px] rounded-2xl border border-primary bg-surface-elevated p-6 shadow-modal'

const panelSurface =
  'rounded-2xl border border-primary bg-surface-panel text-text-secondary shadow-surface'

export const panel = cn(panelSurface, 'p-4')

export const segmentCardBase = cn(panelSurface, 'grid gap-4 p-4 transition-all duration-200 ease-in-out')

export const segmentCardEmpty =
  'border-warning-border bg-surface-secondary/75 hover:border-warning-borderHover'

export const segmentCardHasExercises = 'border-success-border'

export const segmentCardSelected = 'border-accent-soft'

export const segmentCardHeader = 'flex items-center justify-between gap-3'

export const segmentCardHeaderLeft =
  'flex min-w-0 flex-wrap items-center gap-3 max-[720px]:flex-col max-[720px]:items-start'

export const segmentTypeBadge =
  'rounded-full border border-accent-soft bg-accent-tint px-2.5 py-1 text-xs font-bold uppercase text-accent-foreground'

export const segmentNameField = 'grid min-w-[12rem] max-[720px]:min-w-full'

export const segmentGeneratedName = 'font-semibold text-text-secondary'

export const emomInterval =
  'mx-0.5 rounded-md bg-action/50 px-0.5 py-0.5 font-[inherit] tabular-nums'

export const panelHeader =
  'flex items-center justify-between gap-3 max-[720px]:flex-wrap'

export const exercisePicker = cn(panelHeader, 'flex-wrap justify-start')

export const inlineActions = panelHeader

export const eyebrow =
  'm-0 text-xs font-bold uppercase tracking-widest text-accent'

export const panelTitle =
  'my-1 mb-3 mt-0.5 text-text-primary first:mt-0' // h2 / h3 in panels

export const formGrid =
  'mt-4 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4'

export const formGridWorkoutDetails = 'w-full grid-cols-1'

export const segmentList = 'grid gap-4'

export const segmentCardBody = 'grid gap-4'

export const field = 'grid gap-[0.45rem]'

export const fieldSpanLabel =
  'text-sm font-semibold text-text-secondary' // .field span

export const fieldInput =
  'w-full rounded-xl border border-primary bg-surface-input px-3.5 py-3 font-inherit text-text-secondary transition-colors duration-200 ease-in-out'

export const fieldInputSelect = fieldInput

export const fieldGroup = 'my-4 grid gap-3'

export const fieldGroupLabel = 'text-sm font-semibold text-text-secondary'

export const rangeInput = 'p-0'

/** Range sliders: token border/background + thumb accent */
export const rangeSlider = cn(fieldInput, rangeInput, 'w-full accent-action')

export const primaryButton =
  'rounded-xl border-0 bg-gradient-to-br from-action to-action-hover px-4 py-3 font-inherit font-medium text-action-foreground transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] hover:brightness-110'

export const dangerButton =
  'rounded-xl border-0 bg-danger px-4 py-3 font-inherit font-medium text-action-foreground transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] hover:bg-danger-hover'

export const secondaryButton =
  'rounded-xl border border-primary bg-surface-tertiary px-4 py-3 font-inherit font-medium text-text-secondary shadow-insetShallow transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] hover:border-primary hover:bg-surface-quaternary'

export const segmentIconButton = cn(
  secondaryButton,
  'inline-flex items-center justify-center px-2.5 py-2',
)

export const builderDoneRow = 'mt-2'

export const builderDoneButton = cn(
  primaryButton,
  'w-full disabled:cursor-not-allowed disabled:opacity-60',
)

export const boardShell = 'grid gap-6'

export const boardHeader =
  'flex flex-nowrap items-center justify-between gap-4 max-[520px]:flex-wrap'

export const boardHeaderTitleBlock = 'min-w-0 flex-1 max-[520px]:basis-full'

export const boardTitle =
  'm-0 truncate text-xl font-bold leading-tight text-text-primary'

export const boardActions =
  'flex shrink-0 flex-wrap gap-3 max-[520px]:ml-auto'

export const boardContent = 'grid gap-6'

export const boardSegmentWrapper = 'grid gap-0'

export const boardSegment =
  'rounded-2xl border border-primary bg-surface-panel px-5 py-4'

export const boardSegmentActive = cn(
  boardSegment,
  'border-danger-border bg-danger-surface shadow-[0_0_0_2px] shadow-danger-glow',
)

export const boardRestSeparator =
  'mt-2 rounded-lg border border-primary bg-surface-tertiary px-4 py-2 text-center text-sm font-semibold text-text-secondary'

export const boardRestSeparatorActive = cn(
  boardRestSeparator,
  'border-success-strong bg-success-surface text-success-foreground shadow-[0_0_0_2px] shadow-success-glow',
)

export const boardSegmentTitle = 'mb-3 mt-0 text-lg text-text-primary'

export const boardRepSequenceLine =
  '-mt-1 mb-2.5 text-base font-semibold tracking-wide text-text-secondary'

export const boardExerciseList = 'mb-2 list-none p-0'

export const boardExerciseLine =
  'my-1 py-0 pl-2 text-base text-text-secondary'

export const boardExerciseLineWithRepBullet = cn(
  boardExerciseLine,
  'relative pl-0 before:mr-1 before:inline before:font-semibold before:text-text-muted before:content-["*"]',
)

export const boardRest = 'my-1 text-sm text-text-muted'

export const timerStrip =
  'rounded-2xl border border-primary bg-surface-panel p-4 shadow-surface'

export const timerStripHeader =
  'flex flex-wrap items-center justify-between gap-3 border-b border-primary pb-3'

export const timerStripWork = ''

export const timerStripRest = ''

export const timerStripLabelWork = 'm-0 text-lg font-semibold text-accent'

export const timerStripLabelRest = 'm-0 text-lg font-semibold text-success-foreground'

export const timerDisplay =
  'flex flex-col items-center gap-2 py-4 text-center'

export const timerDisplayLarge = 'py-6'

export const timerTime = 'm-0 text-4xl font-semibold tabular-nums text-text-primary'

export const timerFinish = 'text-success-foreground'

export const timerActions =
  'flex w-full max-w-[14rem] flex-col items-center gap-3'

export const timerStopButton = cn(primaryButton, 'min-w-[8rem]')

export const timerView = ''

export const segmentConfigGrid =
  'grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4'

export const segmentConfigStack = 'grid grid-cols-1 gap-4'

export const repGenerationPanel =
  'grid gap-3 rounded-[0.65rem] border border-accent/20 bg-surface-soft p-3.5 sm:p-4'

export const repGenerationEnableToggle = 'text-[0.95rem] font-semibold text-text-secondary'

export const repGenerationHint = 'm-0 text-sm text-warning-foreground'

export const repGenerationSequenceLine =
  'm-0 border-t border-primary pt-3 text-[0.95rem] tabular-nums tracking-wide text-text-secondary'

export const fieldHelp = 'text-sm text-text-muted'

export const fieldLabelRow =
  'flex items-center justify-between gap-2 text-text-secondary'

export const stackedActions =
  'flex flex-wrap justify-end gap-2 max-[720px]:justify-stretch'

export const segmentAddExerciseRow = 'flex items-center gap-3'

export const segmentAddExerciseButton = cn(primaryButton, 'w-full')

export const panelAddSegmentRow =
  'mt-4 flex w-full flex-col gap-3 max-[720px]:justify-stretch'

export const panelAddSegmentButton = cn(primaryButton, 'w-full')

export const panelLoadWorkoutButton = cn(secondaryButton, 'w-full')

export const builderStatusPanel = 'py-3.5'

export const builderStatusMessage = 'm-0'

export const pickerSummary = 'basis-full'

export const searchPicker = 'relative grid w-full gap-2.5'

export const searchInput = fieldInput

export const searchResults =
  'max-h-[19rem] overflow-y-auto rounded-[0.85rem] border border-primary bg-surface-elevated p-2 shadow-dropdown'

export const searchResultItem =
  'grid w-full cursor-pointer justify-items-start gap-0.5 rounded-lg bg-surface-muted/70 p-2 text-left text-text-secondary transition-colors duration-200 ease-in-out hover:bg-surface-tertiary'

export const searchResultTitle = 'font-semibold text-text-primary'

export const searchResultMeta = 'text-sm text-text-secondary'

export const exerciseList = 'm-0 grid list-none gap-3 p-0'

export const exerciseListItem =
  'flex items-center justify-between gap-4 rounded-[0.85rem] bg-surface-muted/75 p-3.5 sm:p-4 max-[720px]:flex-col max-[720px]:items-stretch'

export const exerciseListItemStacked = cn(
  exerciseListItem,
  'flex-col items-stretch gap-4',
)

export const exerciseItemHeader =
  'flex w-full items-start justify-between gap-3'

export const exerciseItemTitle = 'min-w-0'

export const exerciseItemTitleMeta = 'm-0 mt-1 text-text-muted'

export const prescriptionStack =
  'grid grid-cols-1 gap-4 border-t border-primary-faint pt-3'

export const prescriptionGrid =
  'grid min-w-0 grid-cols-2 gap-3 max-[520px]:grid-cols-1'

export const advancedSettingsBlock = 'grid gap-3'

export const advancedSettingsTrigger =
  'cursor-pointer rounded-lg border border-dashed border-primary bg-transparent px-3 py-2 text-left text-sm text-text-muted transition-all duration-200 ease-in-out hover:border-primary hover:text-text-secondary'

export const segmentFooter =
  'mt-1 border-t border-primary-faint pt-3.5'

export const mutedText = 'm-0 mt-1 text-text-muted'

export const warningText = 'mt-2 text-danger-light'

export const successText = 'text-success-foreground'

export const exerciseRecord =
  'flex justify-between gap-4 rounded-[0.85rem] border border-primary-faint bg-surface-muted/75 p-4 text-text-secondary'

export const exerciseRecordSelected = 'border-accent-soft'

export const exerciseRecordCopy = 'min-w-0 flex-1'

export const validationList = 'm-0 grid list-none gap-3 p-0'

export const validationListItem =
  'rounded-lg border-l-4 border-danger-light bg-danger-soft py-3.5 pl-4 pr-4 text-text-secondary'

export const emptyState = 'text-left text-text-secondary'

export const emptyStateStrong = 'text-text-primary'

export const bordered =
  'rounded-[0.85rem] border border-dashed border-primary p-4 text-accent-foreground'

export const grow = 'min-w-0 flex-1'

export const scheduleDatePicker = 'relative'

export const scheduleDatePickerInputRow =
  'grid grid-cols-[1fr_auto] overflow-hidden rounded-xl border border-primary bg-surface-input'

export const scheduleDatePickerInput = cn(
  'border-0 bg-transparent px-3.5 py-3 text-left font-inherit text-text-secondary transition-colors duration-200 ease-in-out hover:bg-surface-muted/35',
)

export const scheduleDatePickerTrigger = cn(
  secondaryButton,
  'rounded-none border-0 border-l border-primary py-2.5',
)

export const scheduleDatePickerPopover = cn(
  'absolute z-40 mt-2 rounded-[0.9rem] border border-primary bg-surface-elevated p-3 shadow-popover',
  "[&_.rdp-root]:[--rdp-accent-color:theme('colors.rdp.accent')]",
  "[&_.rdp-root]:[--rdp-accent-background-color:theme('colors.rdp.accentMuted')]",
  '[&_.rdp-month_caption]:text-text-secondary',
  '[&_.rdp-weekday]:text-text-secondary',
  '[&_.rdp-day_button]:text-text-secondary',
)

export const segmentMeta =
  'grid justify-items-end gap-1 max-[720px]:justify-items-start'

export const toggleSwitchRow = 'flex flex-col gap-2.5'

export const toggleSwitchRowInline =
  'flex flex-row flex-wrap items-center gap-x-5 gap-y-2'

// SegmentedControl layout helper (visual styling lives in component utilities)
export const segmentedControlWrap = 'max-w-full flex-wrap'
