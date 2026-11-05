import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { TextMorph } from "torph/react"
import { cn } from "@/lib/utils"

type DateInput = Date | null | undefined

export interface CalendarDateRange {
  from?: Date
  to?: Date
}

export interface CalendarProps {
  /** Selected date. Pass `null` to control an empty selection. */
  selected?: DateInput
  /** Highlight a selected date span while keeping `selected` as the active date. */
  selectedRange?: CalendarDateRange
  defaultSelected?: Date
  onSelect?: (date: Date | undefined) => void
  /** Visible month. Pass a value to control month navigation. */
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  minDate?: Date
  maxDate?: Date
  isDateDisabled?: (date: Date) => boolean
  locale?: string
  /** Day on which the week begins; 0 is Sunday and 1 is Monday. */
  weekStartsOn?: number
  /** Whether to show a shortcut that selects today. */
  showToday?: boolean
  autoFocus?: boolean
  className?: string
}

function atNoon(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12)
}

function addDays(date: Date, amount: number) {
  const next = atNoon(date)
  next.setDate(next.getDate() + amount)
  return next
}

function addMonths(date: Date, amount: number) {
  const nextMonth = new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1,
    12
  )
  const lastDay = new Date(
    nextMonth.getFullYear(),
    nextMonth.getMonth() + 1,
    0
  ).getDate()
  return new Date(
    nextMonth.getFullYear(),
    nextMonth.getMonth(),
    Math.min(date.getDate(), lastDay),
    12
  )
}

function sameDate(a: DateInput, b: DateInput) {
  return Boolean(
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function isBefore(a: Date, b: Date) {
  return dateKey(a) < dateKey(b)
}

function isAfter(a: Date, b: Date) {
  return dateKey(a) > dateKey(b)
}

function Calendar({
  selected,
  selectedRange,
  defaultSelected,
  onSelect,
  month,
  defaultMonth,
  onMonthChange,
  minDate,
  maxDate,
  isDateDisabled,
  locale,
  weekStartsOn = 0,
  showToday = true,
  autoFocus = false,
  className,
}: CalendarProps) {
  const initialDate = atNoon(
    selected instanceof Date ? selected : (defaultSelected ?? new Date())
  )
  const [uncontrolledSelection, setUncontrolledSelection] = React.useState<
    Date | undefined
  >(defaultSelected ? atNoon(defaultSelected) : undefined)
  const selectedDate =
    selected === undefined ? uncontrolledSelection : (selected ?? undefined)
  const selectedKey = selectedDate ? dateKey(selectedDate) : null
  const [uncontrolledMonth, setUncontrolledMonth] = React.useState(
    monthStart(defaultMonth ?? initialDate)
  )
  const [monthDirection, setMonthDirection] = React.useState<1 | -1>(1)
  const reduceMotion = useReducedMotion()
  const displayedMonth = React.useMemo(
    () => monthStart(month ?? uncontrolledMonth),
    [month, uncontrolledMonth]
  )
  const [activeDate, setActiveDate] = React.useState(initialDate)
  const [previousSelectedKey, setPreviousSelectedKey] =
    React.useState(selectedKey)
  const buttonRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const pendingFocus = React.useRef(false)
  const didAutoFocus = React.useRef(false)
  const titleId = React.useId()
  const normalizedWeekStart = Number.isFinite(weekStartsOn)
    ? ((Math.trunc(weekStartsOn) % 7) + 7) % 7
    : 0

  if (selectedKey !== previousSelectedKey) {
    setPreviousSelectedKey(selectedKey)
    if (selectedDate) setActiveDate(atNoon(selectedDate))
  }

  const dates = React.useMemo(() => {
    const firstDay = monthStart(displayedMonth)
    const offset = (firstDay.getDay() - normalizedWeekStart + 7) % 7
    const gridStart = addDays(firstDay, -offset)
    const daysInMonth = new Date(
      firstDay.getFullYear(),
      firstDay.getMonth() + 1,
      0
    ).getDate()
    const weekCount = Math.max(5, Math.ceil((offset + daysInMonth) / 7))
    return Array.from({ length: weekCount * 7 }, (_, index) =>
      addDays(gridStart, index)
    )
  }, [displayedMonth, normalizedWeekStart])

  const dateFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [locale]
  )
  const monthFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }),
    [locale]
  )
  const weekdayFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short" }),
    [locale]
  )
  const weekdayNames = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const day = (normalizedWeekStart + index) % 7
        const date = new Date(2024, 0, 7 + day, 12)
        return {
          short: weekdayFormatter.format(date),
          full: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
            date
          ),
        }
      }),
    [locale, normalizedWeekStart, weekdayFormatter]
  )

  const isDisabled = (date: Date) =>
    (minDate ? isBefore(date, minDate) : false) ||
    (maxDate ? isAfter(date, maxDate) : false) ||
    Boolean(isDateDisabled?.(date))

  const activeVisibleDate =
    dates.find((date) => sameDate(date, activeDate) && !isDisabled(date)) ??
    dates.find((date) => sameDate(date, selectedDate) && !isDisabled(date)) ??
    dates.find(
      (date) =>
        date.getMonth() === displayedMonth.getMonth() && !isDisabled(date)
    ) ??
    dates.find((date) => !isDisabled(date)) ??
    dates[0]!
  const activeKey = dateKey(activeVisibleDate)

  const nextMonthRef = React.useRef<HTMLButtonElement>(null)
  const focusActiveButton = React.useCallback(() => {
    const activeButton = buttonRefs.current.get(activeKey)
    if (
      !activeButton ||
      activeButton.disabled ||
      activeButton.dataset.outsideMonth === "true"
    ) {
      return false
    }
    activeButton.focus()
    pendingFocus.current = false
    return true
  }, [activeKey])

  React.useEffect(() => {
    const shouldAutoFocus = autoFocus && !didAutoFocus.current
    if (!pendingFocus.current && !shouldAutoFocus) return
    if (shouldAutoFocus) didAutoFocus.current = true
    if (focusActiveButton()) return
    if (pendingFocus.current) return
    nextMonthRef.current?.focus()
  }, [activeKey, autoFocus, displayedMonth, focusActiveButton])

  const changeMonth = (next: Date) => {
    const normalized = monthStart(next)
    const currentMonthIndex =
      displayedMonth.getFullYear() * 12 + displayedMonth.getMonth()
    const nextMonthIndex = normalized.getFullYear() * 12 + normalized.getMonth()
    if (currentMonthIndex !== nextMonthIndex) {
      setMonthDirection(nextMonthIndex > currentMonthIndex ? 1 : -1)
    }
    if (month === undefined) setUncontrolledMonth(normalized)
    onMonthChange?.(normalized)
  }

  const findEnabledDate = (date: Date, direction: -1 | 1): Date | undefined => {
    let candidate = atNoon(date)
    for (let index = 0; index < 370; index += 1) {
      if (!isDisabled(candidate)) return candidate
      candidate = addDays(candidate, direction)
    }
    return undefined
  }

  const moveFocus = (
    target: Date,
    direction: -1 | 1 = target >= activeVisibleDate ? 1 : -1
  ) => {
    const enabledDate = findEnabledDate(target, direction)
    if (!enabledDate) return
    pendingFocus.current = true
    setActiveDate(enabledDate)
    if (
      enabledDate.getMonth() !== displayedMonth.getMonth() ||
      enabledDate.getFullYear() !== displayedMonth.getFullYear()
    ) {
      changeMonth(enabledDate)
    }
  }

  const handleDayKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    date: Date
  ) => {
    let target: Date | undefined
    switch (event.key) {
      case "ArrowLeft":
        target = addDays(date, -1)
        break
      case "ArrowRight":
        target = addDays(date, 1)
        break
      case "ArrowUp":
        target = addDays(date, -7)
        break
      case "ArrowDown":
        target = addDays(date, 7)
        break
      case "Home": {
        const offset = (date.getDay() - normalizedWeekStart + 7) % 7
        target = addDays(date, -offset)
        event.preventDefault()
        moveFocus(target, 1)
        return
      }
      case "End": {
        const offset = (date.getDay() - normalizedWeekStart + 7) % 7
        target = addDays(date, 6 - offset)
        event.preventDefault()
        moveFocus(target, -1)
        return
      }
      case "PageUp":
        target = addMonths(date, event.shiftKey ? -12 : -1)
        break
      case "PageDown":
        target = addMonths(date, event.shiftKey ? 12 : 1)
        break
      default:
        return
    }

    event.preventDefault()
    moveFocus(target)
  }

  const chooseDate = (date: Date) => {
    if (isDisabled(date)) return
    const chosen = atNoon(date)
    if (selected === undefined) setUncontrolledSelection(chosen)
    onSelect?.(chosen)
    if (
      chosen.getMonth() !== displayedMonth.getMonth() ||
      chosen.getFullYear() !== displayedMonth.getFullYear()
    ) {
      changeMonth(chosen)
    }
    setActiveDate(chosen)
  }

  const today = atNoon(new Date())
  const displayedMonthIndex =
    displayedMonth.getFullYear() * 12 + displayedMonth.getMonth()
  const previousMonthDisabled = minDate
    ? displayedMonthIndex <= minDate.getFullYear() * 12 + minDate.getMonth()
    : false
  const nextMonthDisabled = maxDate
    ? displayedMonthIndex >= maxDate.getFullYear() * 12 + maxDate.getMonth()
    : false

  return (
    <div
      data-slot="calendar"
      className={cn(
        "w-[21.5rem] max-w-full rounded-2xl bg-code-surface-raised p-3.5 text-code-ink shadow-[0_1px_2px_color-mix(in_srgb,var(--code-ink)_6%,transparent),0_8px_20px_-16px_color-mix(in_srgb,var(--code-hero)_32%,transparent)]",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          aria-label="Previous month"
          disabled={previousMonthDisabled}
          onClick={() => changeMonth(addMonths(displayedMonth, -1))}
          className="inline-flex size-10 items-center justify-center rounded-lg text-code-muted transition-[background-color,color,transform] outline-none hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent focus-visible:ring-offset-2 focus-visible:ring-offset-code-surface-raised active:scale-[0.96] disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        <h2
          id={titleId}
          aria-live="polite"
          aria-atomic="true"
          className="[font-family:var(--font-heading)] text-base font-normal text-code-ink select-none"
        >
          <TextMorph
            as="span"
            duration={320}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            numbers
            respectReducedMotion
          >
            {monthFormatter.format(displayedMonth)}
          </TextMorph>
        </h2>
        <button
          type="button"
          aria-label="Next month"
          ref={nextMonthRef}
          disabled={nextMonthDisabled}
          onClick={() => changeMonth(addMonths(displayedMonth, 1))}
          className="inline-flex size-10 items-center justify-center rounded-lg text-code-muted transition-[background-color,color,transform] outline-none hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent focus-visible:ring-offset-2 focus-visible:ring-offset-code-surface-raised active:scale-[0.96] disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div role="grid" aria-labelledby={titleId} className="select-none">
        <div role="row" className="mb-1 grid grid-cols-7">
          {weekdayNames.map((weekday, index) => (
            <div
              role="columnheader"
              aria-label={weekday.full}
              key={`${weekday.full}-${index}`}
              className="flex h-7 items-center justify-center text-xs font-medium text-code-muted"
            >
              {weekday.short}
            </div>
          ))}
        </div>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={
              reduceMotion
                ? undefined
                : {
                    opacity: 0,
                    x: monthDirection * -8,
                    filter: "blur(2px)",
                  }
            }
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: monthDirection * 8,
                    filter: "blur(2px)",
                  }
            }
            key={dateKey(displayedMonth)}
            role="rowgroup"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {Array.from({ length: dates.length / 7 }, (_, weekIndex) => (
              <div role="row" className="grid grid-cols-7" key={weekIndex}>
                {dates.slice(weekIndex * 7, weekIndex * 7 + 7).map((date) => {
                  const key = dateKey(date)
                  const outsideMonth =
                    date.getMonth() !== displayedMonth.getMonth()
                  const isSelected = sameDate(selectedDate, date)
                  const inSelectedRange = Boolean(
                    selectedRange?.from &&
                    selectedRange.to &&
                    !isBefore(date, selectedRange.from) &&
                    !isAfter(date, selectedRange.to)
                  )
                  const isRangeStart = Boolean(
                    inSelectedRange && sameDate(selectedRange?.from, date)
                  )
                  const isRangeEnd = Boolean(
                    inSelectedRange && sameDate(selectedRange?.to, date)
                  )
                  const isToday = sameDate(today, date)
                  const disabled = isDisabled(date)

                  return (
                    <button
                      ref={(node) => {
                        if (!node) {
                          buttonRefs.current.delete(key)
                          return
                        }

                        buttonRefs.current.set(key, node)
                        if (
                          key === activeKey &&
                          !outsideMonth &&
                          pendingFocus.current
                        ) {
                          window.requestAnimationFrame(() => {
                            if (node.isConnected && pendingFocus.current) {
                              node.focus()
                              pendingFocus.current = false
                            }
                          })
                        }
                      }}
                      type="button"
                      role="gridcell"
                      aria-label={dateFormatter.format(date)}
                      aria-selected={isSelected}
                      aria-current={isToday ? "date" : undefined}
                      aria-disabled={disabled || undefined}
                      tabIndex={key === activeKey ? 0 : -1}
                      data-outside-month={outsideMonth || undefined}
                      data-selected={isSelected || undefined}
                      data-in-range={inSelectedRange || undefined}
                      data-range-start={isRangeStart || undefined}
                      data-range-end={isRangeEnd || undefined}
                      data-today={isToday || undefined}
                      key={key}
                      disabled={disabled}
                      onClick={() => chooseDate(date)}
                      onFocus={() => setActiveDate(date)}
                      onKeyDown={(event) => handleDayKeyDown(event, date)}
                      className={cn(
                        "relative inline-flex aspect-square h-auto w-full items-center justify-center rounded-lg text-sm font-normal tabular-nums transition-[background-color,color,box-shadow,transform] outline-none hover:bg-code-quiet hover:text-code-ink focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-code-accent focus-visible:ring-offset-1 focus-visible:ring-offset-code-surface-raised active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-35 disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100",
                        "data-[outside-month]:text-code-muted/40 data-[outside-month]:hover:text-code-muted/70",
                        "data-[in-range=true]:rounded-none data-[in-range=true]:bg-code-accent/12 data-[in-range=true]:text-code-ink data-[range-end=true]:rounded-r-lg data-[range-start=true]:rounded-l-lg",
                        "data-[today=true]:font-medium data-[today=true]:after:absolute data-[today=true]:after:bottom-1.5 data-[today=true]:after:size-1 data-[today=true]:after:rounded-full data-[today=true]:after:bg-code-accent",
                        "data-[selected=true]:bg-code-accent data-[selected=true]:font-medium data-[selected=true]:text-code-accent-foreground data-[selected=true]:after:bottom-1 data-[selected=true]:after:bg-code-accent-foreground data-[selected=true]:hover:bg-code-accent/90 data-[selected=true]:hover:text-code-accent-foreground"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      {showToday ? (
        <div className="mt-1 flex justify-end px-1">
          <button
            type="button"
            disabled={isDisabled(today)}
            onClick={() => chooseDate(today)}
            className="inline-flex min-h-9 items-center rounded-md px-2 text-xs font-medium text-code-muted transition-[color,background-color,transform] hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-ring focus-visible:outline-none active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            Today
          </button>
        </div>
      ) : null}
    </div>
  )
}

export { Calendar }
