import * as React from "react"
import { CalendarDays, ChevronDown } from "lucide-react"
import { TextMorph } from "torph/react"
import { Calendar, type CalendarDateRange } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type DateRangeValue = {
  from?: Date
  to?: Date
}

export interface DateRangePickerProps {
  /** Pass a value to control the range; pass `null` to keep it empty. */
  value?: DateRangeValue | null
  defaultValue?: DateRangeValue
  onValueChange?: (range: DateRangeValue) => void
  minDate?: Date
  maxDate?: Date
  isDateDisabled?: (date: Date) => boolean
  locale?: string
  startName?: string
  endName?: string
  /** Associate the hidden date values with a form outside the component's DOM parent. */
  form?: string
  required?: boolean
  invalid?: boolean
  disabled?: boolean
  className?: string
}

type SelectionStep = "start" | "end"

function dayNumber(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function addCalendarDays(date: Date, amount: number) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
  next.setDate(next.getDate() + amount)
  return next
}

function dateSpan(first: Date, last: Date) {
  const days = Math.round((dayNumber(last) - dayNumber(first)) / 86_400_000)
  return Math.max(0, days)
}

function toInputValue(date: Date | undefined) {
  if (!date) return ""
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function normalizeRange(range: DateRangeValue): DateRangeValue {
  if (range.from && range.to && dayNumber(range.from) > dayNumber(range.to)) {
    return { from: range.to, to: range.from }
  }
  return range
}

function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  minDate,
  maxDate,
  isDateDisabled,
  locale,
  startName,
  endName,
  form,
  required = false,
  invalid = false,
  disabled = false,
  className,
}: DateRangePickerProps) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<DateRangeValue>(() => normalizeRange({ ...defaultValue }))
  const range = normalizeRange(isControlled ? (value ?? {}) : uncontrolledValue)
  const hasRange = Boolean(range.from || range.to)
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<SelectionStep>("start")
  const [announcement, setAnnouncement] = React.useState("")
  const [requiredError, setRequiredError] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const triggerId = React.useId()
  const errorId = React.useId()
  const isComplete = Boolean(range.from && range.to)
  const showRequiredError = required && requiredError && !isComplete
  const hasError = invalid || showRequiredError
  const dateFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale]
  )
  const formattedRange = isComplete
    ? `${dateFormatter.format(range.from!)} – ${dateFormatter.format(range.to!)}`
    : range.from
      ? dateFormatter.format(range.from)
      : range.to
        ? dateFormatter.format(range.to)
        : "Choose dates"
  const activeMonth = range.from ?? range.to ?? new Date()
  const today = addCalendarDays(new Date(), 0)
  const todayDisabled =
    disabled ||
    Boolean(minDate && dayNumber(today) < dayNumber(minDate)) ||
    Boolean(maxDate && dayNumber(today) > dayNumber(maxDate)) ||
    Boolean(isDateDisabled?.(today))

  React.useEffect(() => {
    if (!disabled || !open) return
    const frame = window.requestAnimationFrame(() => setOpen(false))
    return () => window.cancelAnimationFrame(frame)
  }, [disabled, open])

  const updateRange = (next: DateRangeValue, nextAnnouncement: string) => {
    const normalized = normalizeRange(next)
    if (!isControlled) setUncontrolledValue(normalized)
    onValueChange?.(normalized)
    setAnnouncement(nextAnnouncement)
    if (normalized.from && normalized.to) setRequiredError(false)
  }

  const updateStart = (from: Date) => {
    const previousSpan =
      range.from && range.to ? dateSpan(range.from, range.to) : 0
    let to =
      range.from && range.to ? addCalendarDays(from, previousSpan) : range.to

    if (to) {
      if (minDate && dayNumber(to) < dayNumber(minDate))
        to = addCalendarDays(minDate, 0)
      if (maxDate && dayNumber(to) > dayNumber(maxDate))
        to = addCalendarDays(maxDate, 0)
      if (dayNumber(to) < dayNumber(from)) to = addCalendarDays(from, 0)
    }

    updateRange(
      { from, to },
      `Start date ${dateFormatter.format(from)} selected. Choose an end date.`
    )
    setStep("end")
  }

  const updateEnd = (to: Date) => {
    const start = range.from ?? to
    const next =
      dayNumber(to) < dayNumber(start)
        ? { from: to, to: start }
        : { from: start, to }
    const normalized = normalizeRange(next)
    updateRange(
      normalized,
      normalized.from && normalized.to
        ? `Date range from ${dateFormatter.format(normalized.from)} to ${dateFormatter.format(normalized.to)} selected.`
        : "Date range updated."
    )
    setOpen(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled && nextOpen) return
    setOpen(nextOpen)
    if (nextOpen) {
      const nextStep =
        range.from && range.to ? "start" : range.from ? "end" : "start"
      setStep(nextStep)
      setAnnouncement(
        nextStep === "start" ? "Choose a start date." : "Choose an end date."
      )
    }
  }

  const chooseStep = (nextStep: SelectionStep) => {
    setStep(nextStep)
    setAnnouncement(
      nextStep === "start" ? "Choose a start date." : "Choose an end date."
    )
  }

  const clearRange = () => {
    updateRange({}, "Date range cleared.")
    setStep("start")
    setOpen(false)
  }

  const handleInvalid = (event: React.InvalidEvent<HTMLInputElement>) => {
    event.preventDefault()
    setRequiredError(true)
    setStep(range.from ? "end" : "start")
    setOpen(true)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <fieldset
      className={cn("grid min-w-0 gap-1.5 border-0 p-0", className)}
      data-slot="date-range-picker"
      disabled={disabled}
    >
      <legend className="sr-only">Date range</legend>
      <label
        className="text-xs font-medium text-code-muted"
        htmlFor={triggerId}
      >
        Date range
      </label>
      <Popover open={open && !disabled} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            data-slot="date-range-picker-trigger"
            data-invalid={hasError || undefined}
            aria-describedby={showRequiredError ? errorId : undefined}
            aria-haspopup="dialog"
            aria-expanded={open && !disabled}
            aria-label={`Date range, ${formattedRange}`}
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            disabled={disabled}
            className={cn(
              "group/date-range-trigger inline-flex h-10 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-code-line/55 bg-code-surface px-3 text-left text-sm text-code-ink transition-[border-color,box-shadow,background-color] outline-none hover:border-code-muted/55 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:bg-code-quiet disabled:text-code-muted data-[invalid=true]:border-code-danger data-[invalid=true]:focus-visible:ring-code-danger/15 motion-reduce:transition-none"
            )}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <CalendarDays
                aria-hidden="true"
                className="size-4 shrink-0 text-code-muted"
              />
              <TextMorph
                as="span"
                className={cn(
                  "min-w-0 truncate tabular-nums",
                  !hasRange && "text-code-muted/75"
                )}
                duration={240}
                numbers
                respectReducedMotion
              >
                {formattedRange}
              </TextMorph>
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-code-muted transition-transform duration-150 group-data-[state=open]/date-range-trigger:rotate-180 motion-reduce:transition-none"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          aria-label="Choose a date range"
          className="w-[min(23rem,calc(100vw-1.5rem))] min-w-0 p-3"
          sideOffset={6}
        >
          <div className="flex items-center justify-between gap-2 px-1 pb-1">
            <div
              aria-label="Date range endpoint"
              className="flex items-center gap-1"
              role="group"
            >
              <button
                aria-pressed={step === "start"}
                className="relative min-h-10 px-2 text-xs text-code-muted transition-colors after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-code-accent after:transition-transform after:content-[''] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-code-accent/35 focus-visible:outline-none aria-pressed:text-code-ink aria-pressed:after:scale-x-100 motion-reduce:transition-none"
                onClick={() => chooseStep("start")}
                type="button"
              >
                Start
              </button>
              <button
                aria-pressed={step === "end"}
                className="relative min-h-10 px-2 text-xs text-code-muted transition-colors after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-code-accent after:transition-transform after:content-[''] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-code-accent/35 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 aria-pressed:text-code-ink aria-pressed:after:scale-x-100 motion-reduce:transition-none"
                disabled={!range.from}
                onClick={() => chooseStep("end")}
                type="button"
              >
                End
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-hidden={!hasRange || undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-md px-2 text-xs text-code-muted transition-colors hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
                  !hasRange && "invisible"
                )}
                disabled={disabled || !hasRange}
                onClick={clearRange}
                tabIndex={hasRange ? undefined : -1}
                type="button"
              >
                Clear
              </button>
              <button
                className="inline-flex min-h-10 items-center rounded-md px-2 text-xs text-code-muted transition-colors hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                disabled={todayDisabled}
                onClick={() => {
                  if (step === "start") updateStart(today)
                  else updateEnd(today)
                }}
                type="button"
              >
                Today
              </button>
            </div>
          </div>
          <Calendar
            key={step}
            selected={
              step === "start"
                ? (range.from ?? range.to ?? null)
                : (range.to ?? null)
            }
            selectedRange={
              step === "end" && range.from && !range.to
                ? { from: range.from, to: range.from }
                : (range as CalendarDateRange)
            }
            defaultMonth={
              step === "end"
                ? (range.to ??
                  (range.from ? addCalendarDays(range.from, 1) : activeMonth))
                : activeMonth
            }
            defaultSelected={
              step === "end" && range.from && !range.to
                ? addCalendarDays(range.from, 1)
                : undefined
            }
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
            locale={locale}
            showToday={false}
            autoFocus
            onSelect={(date) => {
              if (!date) return
              if (step === "start") updateStart(date)
              else updateEnd(date)
            }}
            className="w-full rounded-none bg-transparent p-0 shadow-none [&_[role=columnheader]]:h-6 [&_[role=gridcell]]:aspect-auto [&_[role=gridcell]]:h-10 [&>div:first-child]:mb-2 [&>div:first-child>button]:size-9"
          />
        </PopoverContent>
      </Popover>
      <span aria-atomic="true" aria-live="polite" className="sr-only">
        {announcement ||
          (isComplete
            ? `Date range from ${dateFormatter.format(range.from!)} to ${dateFormatter.format(range.to!)}`
            : range.from
              ? `Start date ${dateFormatter.format(range.from)} selected; choose an end date`
              : range.to
                ? `End date ${dateFormatter.format(range.to)} selected; choose a start date`
                : "")}
      </span>
      {required && !isComplete ? (
        <>
          <input
            aria-hidden="true"
            aria-label="Start date"
            className="sr-only"
            disabled={disabled}
            form={form}
            onChange={() => undefined}
            onInvalid={handleInvalid}
            required
            tabIndex={-1}
            type="text"
            value={toInputValue(range.from)}
          />
          <input
            aria-hidden="true"
            aria-label="End date"
            className="sr-only"
            disabled={disabled}
            form={form}
            onChange={() => undefined}
            onInvalid={handleInvalid}
            required
            tabIndex={-1}
            type="text"
            value={toInputValue(range.to)}
          />
        </>
      ) : null}
      {startName ? (
        <input
          disabled={disabled}
          form={form}
          name={startName}
          type="hidden"
          value={toInputValue(range.from)}
        />
      ) : null}
      {endName ? (
        <input
          disabled={disabled}
          form={form}
          name={endName}
          type="hidden"
          value={toInputValue(range.to)}
        />
      ) : null}
      {showRequiredError ? (
        <span className="text-xs text-code-danger" id={errorId} role="alert">
          Choose both dates
        </span>
      ) : null}
    </fieldset>
  )
}

export { DateRangePicker }
