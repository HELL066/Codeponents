import * as React from "react"
import { CalendarDays, ChevronDown } from "lucide-react"
import { Popover } from "radix-ui"
import { TextMorph } from "torph/react"
import { cn } from "@/lib/utils"
import { Calendar, type CalendarDateRange } from "@/components/ui/calendar"

export interface DatePickerProps extends Omit<
  React.ComponentProps<"button">,
  "type" | "value" | "defaultValue" | "onChange" | "onClick"
> {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (date: Date | undefined) => void
  name?: string
  required?: boolean
  invalid?: boolean
  placeholder?: string
  locale?: string
  minDate?: Date
  maxDate?: Date
  isDateDisabled?: (date: Date) => boolean
  /** Highlight a surrounding range without changing this picker’s selected date. */
  selectedRange?: CalendarDateRange
  calendarClassName?: string
}

function toInputValue(date: Date | undefined) {
  if (!date) return ""
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function DatePicker({
  className,
  calendarClassName,
  value,
  defaultValue,
  onValueChange,
  name,
  required,
  invalid,
  placeholder = "Choose a date",
  locale,
  minDate,
  maxDate,
  isDateDisabled,
  selectedRange,
  disabled,
  id,
  form,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...buttonProps
}: DatePickerProps) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    Date | undefined
  >(
    defaultValue instanceof Date
      ? new Date(
          defaultValue.getFullYear(),
          defaultValue.getMonth(),
          defaultValue.getDate(),
          12
        )
      : undefined
  )
  const [open, setOpen] = React.useState(false)
  const [requiredError, setRequiredError] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const requiredValidationId = React.useId()
  const selectedDate = isControlled ? (value ?? undefined) : uncontrolledValue
  const initialCalendarMonth = React.useMemo(() => {
    const referenceDate = selectedDate ?? new Date()
    const referenceKey = toInputValue(referenceDate)
    if (minDate && referenceKey < toInputValue(minDate)) return minDate
    if (maxDate && referenceKey > toInputValue(maxDate)) return maxDate
    return referenceDate
  }, [selectedDate, minDate, maxDate])
  const hasError = Boolean(invalid || requiredError)
  const describedBy =
    [ariaDescribedBy, requiredError ? requiredValidationId : null]
      .filter(Boolean)
      .join(" ") || undefined
  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
        selectedDate
      )
    : placeholder
  const isOpen = open && !disabled

  React.useEffect(() => {
    if (!disabled) return
    const frame = window.requestAnimationFrame(() => setOpen(false))
    return () => window.cancelAnimationFrame(frame)
  }, [disabled])

  const handleSelect = (date: Date | undefined) => {
    if (!isControlled) setUncontrolledValue(date)
    onValueChange?.(date)
    setRequiredError(false)
    setOpen(false)
  }

  return (
    <>
      <Popover.Root
        open={isOpen}
        onOpenChange={(nextOpen) => setOpen(nextOpen && !disabled)}
      >
        <Popover.Trigger asChild>
          <button
            ref={triggerRef}
            id={id}
            form={form}
            type="button"
            data-slot="date-picker-trigger"
            data-invalid={hasError || undefined}
            aria-label={ariaLabel}
            aria-describedby={describedBy}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            disabled={disabled}
            className={cn(
              "group/date-picker-trigger inline-flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-code-line/55 bg-code-surface px-3 text-left text-sm text-code-ink transition-[border-color,box-shadow,background-color] outline-none hover:border-code-muted/55 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:bg-code-quiet disabled:text-code-muted data-[invalid=true]:border-code-danger data-[invalid=true]:focus-visible:ring-code-danger/15 motion-reduce:transition-none",
              className
            )}
            {...buttonProps}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <CalendarDays
                aria-hidden="true"
                className="size-4 shrink-0 text-code-muted"
              />
              <span
                className={cn(
                  "truncate",
                  !selectedDate && "text-code-muted/75"
                )}
              >
                <TextMorph as="span" duration={240} respectReducedMotion>
                  {formattedDate}
                </TextMorph>
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-code-muted transition-transform duration-150 group-data-[state=open]/date-picker-trigger:rotate-180 motion-reduce:transition-none"
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            data-slot="date-picker-content"
            align="start"
            side="bottom"
            collisionPadding={8}
            sideOffset={6}
            aria-label={ariaLabel ? `${ariaLabel} calendar` : "Choose a date"}
            className="z-50 max-h-[min(var(--radix-popover-content-available-height),calc(100dvh-1rem))] max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain origin-[var(--radix-popover-content-transform-origin)] outline-none data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-exit-scale:0.99] data-[state=closed]:slide-out-to-top-1 data-[state=open]:animate-in data-[state=open]:duration-180 data-[state=open]:fade-in-0 data-[state=open]:[--tw-enter-scale:0.99] data-[state=open]:slide-in-from-top-1 motion-reduce:animate-none"
          >
            <Calendar
              selected={selectedDate ?? null}
              selectedRange={selectedRange}
              defaultMonth={initialCalendarMonth}
              minDate={minDate}
              maxDate={maxDate}
              isDateDisabled={isDateDisabled}
              locale={locale}
              autoFocus
              onSelect={handleSelect}
              className={calendarClassName}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {required ? (
        <input
          aria-hidden="true"
          autoComplete="off"
          className="sr-only"
          disabled={disabled}
          onChange={() => undefined}
          onInvalid={(event) => {
            event.preventDefault()
            setRequiredError(true)
            setOpen(true)
            triggerRef.current?.focus()
          }}
          required
          form={form}
          tabIndex={-1}
          type="text"
          value={toInputValue(selectedDate)}
        />
      ) : null}
      {name ? (
        <input
          disabled={disabled}
          form={form}
          type="hidden"
          name={name}
          value={toInputValue(selectedDate)}
        />
      ) : null}
      {requiredError ? (
        <span
          className="mt-1 block text-xs text-code-danger"
          id={requiredValidationId}
          role="alert"
        >
          Choose a date
        </span>
      ) : null}
    </>
  )
}

export { DatePicker }
