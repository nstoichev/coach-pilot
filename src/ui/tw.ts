/**
 * Composed Tailwind utility strings — semantic tokens from tailwind.config.js only.
 */
import { cn } from './cn.ts'

export const pageShell = 'w-full'

/** Fills #root content area below padding (use with board so main can flex-1 without 100dvh + padding overflow) */
export const pageShellFill = 'flex min-h-0 flex-1 flex-col'

export const builderShell = 'grid gap-6'

export const exerciseDatabaseGrid =
  'grid gap-6 [grid-template-columns:minmax(280px,1fr)_minmax(360px,1.3fr)] max-[720px]:grid-cols-1'

export const modalOverlay =
  'fixed inset-0 z-50 flex items-center justify-center bg-overlay p-6'

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

/** Segments block: no panel chrome; cards supply their own surfaces */
export const segmentListSection = 'w-full'

/** Side inset for “Segments” / “Workout flow” headings only */
export const segmentListSectionHeader = cn(
  panelHeader,
  'px-3 max-[720px]:px-2',
)

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

/** Range sliders: same chrome as text fields but flush to edges (no horizontal padding on the track). */
export const rangeSlider =
  'w-full rounded-xl border border-primary bg-surface-input px-0 py-0 font-inherit text-text-secondary transition-colors duration-200 ease-in-out accent-action'

export const primaryButton =
  'rounded-xl border-0 bg-gradient-to-br from-action to-action-hover px-4 py-3 font-inherit font-medium text-action-foreground transition-colors transition-opacity duration-200 ease-in-out hover:opacity-90 active:opacity-80 disabled:opacity-60'

export const dangerButton =
  'rounded-xl border-0 bg-danger px-4 py-3 font-inherit font-medium text-action-foreground transition-colors transition-opacity duration-200 ease-in-out hover:bg-danger-hover hover:opacity-95 active:opacity-85 disabled:opacity-60'

export const secondaryButton =
  'rounded-xl border border-primary bg-surface-tertiary px-4 py-3 font-inherit font-medium text-text-secondary shadow-insetShallow transition-colors transition-opacity duration-200 ease-in-out hover:border-primary hover:bg-surface-quaternary hover:text-text-primary active:opacity-90 disabled:opacity-60'

/**
 * Flush icon group — same chrome as `SegmentedControl` (measure / rep pattern radios).
 * Parent: `builderSegmentedActionGroup`; children: `builderSegmentedActionFace`.
 */
export const builderSegmentedActionGroup =
  'inline-flex shrink-0 overflow-hidden rounded-lg border border-primary-strong bg-surface-secondary shadow-insetShallow [&>button:first-child]:border-l-0'

export const builderSegmentedActionFace =
  'flex min-h-[2.25rem] min-w-[2.5rem] flex-1 items-center justify-center border-l border-primary bg-surface-muted/55 px-2 py-1.5 text-text-muted transition-all duration-200 ease-in-out hover:bg-surface-quaternary/65 hover:text-text-secondary focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-muted/55'

/**
 * Stacked Add segment + Done — fixed to viewport bottom (below #root padding visually).
 * z-10 keeps all modals (`modalOverlay` z-50) above this bar.
 */
export const builderStickyActionsBar =
  'pointer-events-auto fixed inset-x-0 bottom-0 z-10 border-t border-primary bg-surface-primary/95 pt-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-sm'

/** Horizontal inset matches `#root` padding so buttons align with builder content */
export const builderStickyActionsStack =
  'mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-8 max-[720px]:px-4'

/** Outlined / neutral — pairs with primary Done */
export const builderStickyAddSegmentButton = cn(
  secondaryButton,
  'w-full py-3.5 font-semibold',
)

export const builderStickyDoneButton = cn(
  primaryButton,
  'w-full py-3.5 font-semibold disabled:cursor-not-allowed',
)

/** Space below builder content so it isn’t hidden under fixed Add / Done bar */
export const builderMainWithStickyFooter =
  'pb-[max(11rem,calc(env(safe-area-inset-bottom,0px)+10rem))]'

export const boardShell = 'grid gap-6'

/** Board column: header, segments, optional equipment / start footer (page scroll) */
export const boardMainLayout =
  'relative flex min-h-0 flex-1 flex-col gap-6'

export const boardOrderHeader = 'shrink-0'

/** Segment list is content-sized; page scrolls. Extra bottom pad when fixed timer dock is on `main`. */
export const boardMainWithTimerDock = 'pb-[min(42vh,17.5rem)]'

export const boardOrderEquipment = 'shrink-0'

export const boardOrderFooter = 'shrink-0'

/** Fixed timer shell: light frosted blur; work/rest use neutral shell — phase color only on timer digits (`timerDockTime*`). */
export const boardTimerDock =
  'pointer-events-auto fixed inset-x-0 bottom-0 z-40 border-t border-primary/40 p-0 pb-[max(0px,env(safe-area-inset-bottom))] backdrop-blur-[5px]'

/** Complete / between phases — neutral glass */
export const boardTimerDockPhaseNeutral =
  'bg-surface-primary/30 text-text-secondary [&_.timer-dock-round]:text-text-muted'

/** Work phase — same neutral glass as idle; countdown color via `timerDockTimeWork` on the readout */
export const boardTimerDockPhaseWork = boardTimerDockPhaseNeutral

/** Rest phase — same neutral glass; countdown color via `timerDockTimeRest` */
export const boardTimerDockPhaseRest = boardTimerDockPhaseNeutral

export const boardTimerDockInner =
  'mx-auto w-full max-w-lg overflow-hidden bg-transparent shadow-none'

/** Horizontal inset aligns with dock header / Complete block */
export const boardTimerDockDisplay = 'px-5'

/** Embedded dock: counter + Complete — extra vertical padding around the primary button */
export const timerEmbeddedUserCompleteStack = 'flex w-full flex-col gap-4 pb-5 pt-2'

export const timerEmbeddedCompleteButton = cn(
  primaryButton,
  'w-full rounded-xl py-3.5 text-base font-semibold',
)

export const boardTimerDockActions = 'border-0 bg-transparent p-0'

export const boardHeader =
  'flex flex-nowrap items-center justify-between gap-3'

export const boardHeaderTitleBlock = 'min-w-0 flex-1'

export const boardTitle =
  'm-0 truncate text-xl font-bold leading-tight text-text-primary'

export const boardActions = 'flex shrink-0 gap-3'

/** Segment list: no row stretch when scroll area is taller than content (flex-1 parent) */
export const boardContent = 'grid content-start items-start gap-6'

/** Card + rest in one row group; gap matches boardContent so rest↔segment spacing is uniform */
export const boardSegmentWrapper = 'grid content-start items-start gap-6'

export const boardSegment =
  'rounded-2xl border border-primary bg-surface-panel px-5 py-4'

export const boardSegmentActive = cn(
  boardSegment,
  'border-danger-border bg-danger-surface shadow-[0_0_0_2px] shadow-danger-glow',
)

/** Timer has passed this segment (read-only / done) */
export const boardSegmentCompleted = cn(
  'opacity-[0.55] saturate-[0.65] border-primary/25 bg-surface-secondary/70',
)

export const boardRestSeparator =
  'rounded-lg border border-primary bg-surface-tertiary px-4 py-2 text-center text-sm font-semibold text-text-secondary'

export const boardRestSeparatorActive = cn(
  boardRestSeparator,
  'border-success-strong bg-success-surface text-success-foreground shadow-[0_0_0_2px] shadow-success-glow',
)

export const boardSegmentTitle = 'mb-3 mt-0 text-lg text-text-primary'

export const boardRepSequenceLine =
  '-mt-1 mb-2.5 text-base font-semibold tracking-wide text-text-secondary'

export const boardExerciseList = 'mb-2 list-none p-0'

/** Full-width Done inside segment card (For Time / Chipper / Death by) */
export const boardSegmentDoneButton = cn(
  primaryButton,
  'mt-4 w-full',
)

export const boardExerciseLine =
  'my-1 py-0 pl-2 text-base text-text-secondary'

export const boardExerciseLineWithRepBullet = cn(
  boardExerciseLine,
  'relative pl-0 before:mr-1 before:inline before:font-semibold before:text-text-muted before:content-["*"]',
)

/** Below segment list on Workout Board — FR-031 (vertical gap from `boardMainLayout`) */
export const boardEquipmentSection = cn(boardSegment, 'border-dashed')

export const boardEquipmentTitle =
  'mb-2 mt-0 text-sm font-bold uppercase tracking-wide text-text-primary'

export const boardEquipmentList = 'mb-0 list-none space-y-1 p-0'

export const boardEquipmentItem = 'text-base text-text-secondary'

export const boardRest = 'my-1 text-sm text-text-muted'

export const timerStrip =
  'rounded-2xl border border-primary bg-surface-panel p-4 shadow-surface'

export const timerStripHeader =
  'flex flex-wrap items-center justify-between gap-3 border-b border-primary pb-3'

/** Embedded dock: centered Work / Rest / complete title */
export const timerStripHeaderDocked =
  'flex w-full flex-wrap items-center justify-center border-b-0 pb-3 pt-4'

export const timerStripWork = ''

export const timerStripRest = ''

export const timerStripLabelWork = 'm-0 text-lg font-semibold text-accent'

export const timerStripLabelRest = 'm-0 text-lg font-semibold text-success-foreground'

/** Embedded dock labels — centered, slightly larger than strip labels */
export const timerDockLabelWork =
  'm-0 w-full text-center text-xl font-semibold text-danger-light'

export const timerDockLabelRest =
  'm-0 w-full text-center text-xl font-semibold text-success-foreground'

export const timerDockLabelComplete =
  'm-0 w-full text-center text-xl font-semibold text-success-foreground'

export const timerDisplay =
  'flex w-full max-w-full flex-col items-center gap-2 py-4 text-center'

export const timerDisplayLarge = 'gap-2 py-4'

export const timerTime = 'm-0 text-4xl font-semibold tabular-nums text-text-primary'

/** Primary timer readout — size/weight only; color via `timerTimeLargeInk` or `timerDockTime*` (`cn` does not merge Tailwind). */
export const timerTimeLarge =
  'm-0 block w-full max-w-full text-center text-[min(100px,24vw)] font-bold tabular-nums tracking-tight leading-none max-[400px]:text-[min(4.5rem,22vw)]'

/** Full-page timer / fallback digit color */
export const timerTimeLargeInk = 'text-text-primary'

/** Embedded dock: main countdown — solid phase hues */
export const timerDockTimeWork = 'text-danger-light'

export const timerDockTimeRest = 'text-success-foreground'

export const timerRoundLine =
  'timer-dock-round m-0 text-sm font-semibold uppercase tracking-wide text-text-muted'

export const timerFinish = 'text-success-foreground'

export const timerActions =
  'flex w-full max-w-[14rem] flex-col items-center gap-3'

export const timerStopButton = cn(primaryButton, 'min-w-[8rem]')

/** Timer footer: split row + optional full-width row (e.g. Done) */
export const timerBottomBar =
  'flex w-full flex-col gap-2 border-t border-primary pt-0 mt-0'

/** Footer inside fixed dock (top border on parent `boardTimerDockActions`) */
export const timerBottomBarDocked = 'flex w-full flex-col gap-0 border-0 pt-0 mt-0'

export const timerBarButton =
  '!rounded-none min-h-[3rem] min-w-[5.5rem] flex-1 px-3 py-2.5 text-sm max-[380px]:min-w-[calc(50%-0.25rem)]'

/** Play/pause | stop — flush, no gap; vertical rule via `divide-x` */
export const timerBarSplitRow =
  'grid w-full grid-cols-2 gap-0 divide-x divide-primary'

/**
 * Split control: `cn()` only concatenates — `secondaryButton` includes `rounded-xl`, so `!rounded-none`
 * is required to actually remove radius.
 */
export const timerBarSplitButton = cn(
  secondaryButton,
  'flex min-h-[4.75rem] w-full flex-col items-center justify-center gap-1.5 !rounded-none border-0 px-2 py-3 text-center shadow-none',
)

export const timerBarSplitCaption =
  'text-center text-[0.7rem] font-semibold uppercase tracking-wide text-text-secondary'

/** Full-width control when workout complete (restart) */
export const timerBarRestartButton = cn(
  secondaryButton,
  'flex min-h-[4.75rem] w-full flex-col items-center justify-center gap-1.5 !rounded-none border-0 px-3 py-3 text-center shadow-none',
)

/** Embedded dock after complete — readable on glass, not phase-tinted */
export const timerBarRestartButtonEmbedded = cn(
  secondaryButton,
  'flex min-h-[4.75rem] w-full flex-col items-center justify-center gap-1.5 !rounded-none border-0 bg-surface-tertiary/70 px-3 py-3 text-center text-text-primary shadow-none backdrop-blur-md hover:bg-surface-quaternary/80',
)

export const timerBarRestartCaption = 'text-center text-sm font-semibold text-text-secondary'

export const timerBarRestartCaptionEmbedded =
  'text-center text-sm font-semibold text-text-primary'

export const timerView = ''

/** Board: primary Start before timer session (footer) */
export const boardTimerStartFooter =
  'sticky bottom-0 z-10 mt-4 border-t border-primary bg-surface-primary/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-sm'

export const boardTimerStartButton = cn(primaryButton, 'w-full max-w-md justify-self-center')

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

export const builderStatusPanel = 'py-3.5'

export const builderStatusMessage = 'm-0'

export const pickerSummary = 'basis-full'

export const searchPicker = 'relative grid w-full gap-2.5'

export const searchInput = fieldInput

export const searchResults =
  'grid max-h-[19rem] w-full auto-rows-min gap-2 overflow-y-auto rounded-[0.85rem] border border-primary bg-surface-elevated p-2 shadow-dropdown'

export const searchResultItem =
  'grid w-full min-w-0 cursor-pointer justify-items-start gap-0.5 rounded-lg bg-surface-muted/70 p-3 text-left text-text-secondary transition-colors duration-200 ease-in-out hover:bg-surface-tertiary'

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
