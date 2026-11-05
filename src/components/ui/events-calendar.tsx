import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type EventCalendarTone = "accent" | "positive" | "warning" | "neutral"
export type EventCalendarView = "month" | "day" | "agenda"

export interface EventCalendarEvent {
  id: string
  title: string
  start: Date
  end?: Date
  allDay?: boolean
  category?: string
  location?: string
  tone?: EventCalendarTone
}

export interface EventsCalendarProps {
  events: readonly EventCalendarEvent[]
  /** Pass a value to control the selected day; pass null to keep it empty. */
  selectedDate?: Date | null
  defaultSelectedDate?: Date
  onDateChange?: (date: Date) => void
  /** Pass a value to control month navigation. */
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  locale?: string
  /** Start in the month grid or event list. */
  defaultView?: EventCalendarView
  /** Heading level for the month title when the calendar is composed in a page. */
  headingLevel?: 2 | 3 | 4
  /** Day on which the week begins; 0 is Sunday and 1 is Monday. */
  weekStartsOn?: number
  onEventSelect?: (event: EventCalendarEvent) => void
  onCreateEvent?: (date: Date) => void
  className?: string
}

function atNoon(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function sameDate(a: Date | null | undefined, b: Date | null | undefined) {
  return Boolean(a && b && dateKey(a) === dateKey(b))
}

function addDays(date: Date, amount: number) {
  const next = atNoon(date)
  next.setDate(next.getDate() + amount)
  return next
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12)
}

function addMonths(date: Date, amount: number) {
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12)
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  return new Date(
    next.getFullYear(),
    next.getMonth(),
    Math.min(date.getDate(), lastDay),
    12
  )
}

function EventsCalendar({
  events,
  selectedDate,
  defaultSelectedDate,
  onDateChange,
  month,
  defaultMonth,
  onMonthChange,
  locale,
  defaultView = "month",
  headingLevel = 2,
  weekStartsOn = 0,
  onEventSelect,
  onCreateEvent,
  className,
}: EventsCalendarProps) {
  const prefersReducedMotion = useReducedMotion()
  const today = React.useMemo(() => atNoon(new Date()), [])
  const initialSelectedDate = atNoon(defaultSelectedDate ?? today)
  const [uncontrolledSelectedDate, setUncontrolledSelectedDate] =
    React.useState<Date | undefined>(initialSelectedDate)
  const [uncontrolledMonth, setUncontrolledMonth] = React.useState(() =>
    monthStart(defaultMonth ?? month ?? initialSelectedDate)
  )
  const [view, setView] = React.useState<EventCalendarView>(defaultView)
  const titleId = React.useId()
  const agendaId = React.useId()
  const isDateControlled = selectedDate !== undefined
  const activeDate = isDateControlled
    ? (selectedDate ?? undefined)
    : uncontrolledSelectedDate
  const isMonthControlled = month !== undefined
  const displayedMonth = monthStart(month ?? uncontrolledMonth)
  const normalizedWeekStart = Number.isFinite(weekStartsOn)
    ? ((Math.trunc(weekStartsOn) % 7) + 7) % 7
    : 0

  const dates = React.useMemo(() => {
    const firstDay = monthStart(displayedMonth)
    const offset = (firstDay.getDay() - normalizedWeekStart + 7) % 7
    const daysInMonth = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + 1,
      0
    ).getDate()
    const weekCount = Math.ceil((offset + daysInMonth) / 7)
    const gridStart = addDays(firstDay, -offset)
    return Array.from({ length: weekCount * 7 }, (_, index) =>
      addDays(gridStart, index)
    )
  }, [displayedMonth, normalizedWeekStart])

  const weekdayFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short" }),
    [locale]
  )
  const longDateFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [locale]
  )
  const monthFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale]
  )
  const dayFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric" }),
    [locale]
  )
  const timeFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }),
    [locale]
  )
  const weekdayNames = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const weekday = (normalizedWeekStart + index) % 7
        const referenceDate = new Date(2024, 0, 7 + weekday, 12)
        return {
          short: weekdayFormatter.format(referenceDate),
          full: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
            referenceDate
          ),
        }
      }),
    [locale, normalizedWeekStart, weekdayFormatter]
  )

  const eventsByDate = React.useMemo(() => {
    const grouped = new Map<string, EventCalendarEvent[]>()
    for (const event of events) {
      const key = dateKey(event.start)
      const dayEvents = grouped.get(key) ?? []
      dayEvents.push(event)
      grouped.set(key, dayEvents)
    }
    for (const dayEvents of grouped.values()) {
      dayEvents.sort(
        (first, second) => first.start.getTime() - second.start.getTime()
      )
    }
    return grouped
  }, [events])

  const eventsInMonth = React.useMemo(
    () =>
      events
        .filter(
          (event) =>
            event.start.getFullYear() === displayedMonth.getFullYear() &&
            event.start.getMonth() === displayedMonth.getMonth()
        )
        .slice()
        .sort(
          (first, second) => first.start.getTime() - second.start.getTime()
        ),
    [displayedMonth, events]
  )
  const activeDayEvents = activeDate
    ? (eventsByDate.get(dateKey(activeDate)) ?? [])
    : []

  const selectDate = (date: Date) => {
    const next = atNoon(date)
    if (!isDateControlled) setUncontrolledSelectedDate(next)
    onDateChange?.(next)
  }

  const changeMonth = (nextMonth: Date, syncSelection = true) => {
    const normalized = monthStart(nextMonth)
    if (!isMonthControlled) setUncontrolledMonth(normalized)
    onMonthChange?.(normalized)

    if (
      syncSelection &&
      !isDateControlled &&
      activeDate &&
      (activeDate.getMonth() !== normalized.getMonth() ||
        activeDate.getFullYear() !== normalized.getFullYear())
    ) {
      selectDate(
        new Date(normalized.getFullYear(), normalized.getMonth(), 1, 12)
      )
    }
  }

  const changePeriod = (amount: number) => {
    if (view !== "day") {
      changeMonth(addMonths(displayedMonth, amount))
      return
    }

    const nextDate = addDays(activeDate ?? today, amount)
    if (
      nextDate.getMonth() !== displayedMonth.getMonth() ||
      nextDate.getFullYear() !== displayedMonth.getFullYear()
    ) {
      changeMonth(monthStart(nextDate), false)
    }
    selectDate(nextDate)
  }

  const selectToday = () => {
    changeMonth(monthStart(today), false)
    selectDate(today)
  }

  const handleEventSelect = (event: EventCalendarEvent) => {
    selectDate(event.start)
    onEventSelect?.(event)
  }

  const eventTime = (event: EventCalendarEvent) =>
    event.allDay ? "All day" : timeFormatter.format(event.start)

  const eventTimeRange = (event: EventCalendarEvent) => {
    if (event.allDay) return "All day"
    if (!event.end) return timeFormatter.format(event.start)
    const start = timeFormatter.format(event.start)
    const end = timeFormatter.format(event.end)
    const startPeriod = start.match(/\s?(AM|PM)$/i)?.[1]
    const endPeriod = end.match(/\s?(AM|PM)$/i)?.[1]
    if (startPeriod && startPeriod.toLowerCase() === endPeriod?.toLowerCase()) {
      return `${start.replace(/\s?(AM|PM)$/i, "")}–${end}`
    }
    return `${start}–${end}`
  }

  const eventRowClass = () =>
    cn(
      "group/event flex min-h-5 min-w-0 items-center gap-1 rounded-md px-0.5 py-0 text-left text-xs leading-[1.125rem] text-code-muted transition-[background-color,color] hover:bg-code-accent-soft/45 hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-ring/50 focus-visible:outline-none @2xl:gap-2 @2xl:px-1.5"
    )

  const monthLabel = monthFormatter.format(displayedMonth)
  const MonthHeading =
    headingLevel === 4 ? "h4" : headingLevel === 3 ? "h3" : "h2"
  const activeDateLabel = activeDate
    ? longDateFormatter.format(activeDate)
    : "Choose a day"
  const dayViewDate = activeDate ?? today
  const dayViewEvents = eventsByDate.get(dateKey(dayViewDate)) ?? []
  const renderMonthEvents = (listClassName?: string) =>
    eventsInMonth.length > 0 ? (
      <ol className={cn("divide-y divide-code-line/25", listClassName)}>
        {eventsInMonth.map((event) => (
          <li key={event.id}>
            <button
              type="button"
              onClick={() => handleEventSelect(event)}
              className="grid min-h-14 w-full grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-2 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-code-canvas focus-visible:ring-2 focus-visible:ring-code-ring/50 focus-visible:outline-none @sm:grid-cols-[3.75rem_minmax(0,1fr)] @sm:gap-3 @sm:px-2 @xl:gap-4"
            >
              <span className="pt-0.5 text-xs leading-5 text-code-muted tabular-nums">
                {new Intl.DateTimeFormat(locale, {
                  month: "short",
                  day: "numeric",
                }).format(event.start)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-code-ink">
                  {event.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-code-muted">
                  {[eventTimeRange(event), event.category, event.location]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    ) : (
      <p className="py-2 text-sm text-code-muted">No events this month</p>
    )

  return (
    <section
      aria-labelledby={titleId}
      data-slot="events-calendar"
      className={cn(
        "@container w-full min-w-0 rounded-2xl bg-code-surface p-3 text-code-ink shadow-[0_1px_2px_color-mix(in_srgb,var(--code-ink)_5%,transparent),0_18px_48px_-36px_color-mix(in_srgb,var(--code-hero)_36%,transparent)] @sm:p-4 @xl:p-6",
        className
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 @xl:gap-x-5 @xl:gap-y-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <MonthHeading
            id={titleId}
            className="[font-family:var(--font-heading)] text-lg leading-tight font-normal text-code-ink @sm:text-xl @xl:text-2xl"
          >
            <TextMorph
              as="span"
              duration={280}
              ease="cubic-bezier(0.22, 1, 0.36, 1)"
              respectReducedMotion
            >
              {monthLabel}
            </TextMorph>
          </MonthHeading>
          <p className="m-0 text-xs text-code-muted tabular-nums">
            <TextMorph
              as="span"
              className="inline-block min-w-12"
              duration={180}
              numbers
              respectReducedMotion
            >
              {`${eventsInMonth.length} ${eventsInMonth.length === 1 ? "event" : "events"}`}
            </TextMorph>
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2 @xl:w-auto @xl:justify-end">
          <div
            aria-label="Calendar view"
            className="inline-flex h-9 shrink-0 items-center rounded-lg bg-code-canvas p-1"
            role="group"
          >
            {(
              [
                { value: "month", label: "Month" },
                { value: "day", label: "Day" },
                { value: "agenda", label: "Agenda" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={view === option.value}
                onClick={() => {
                  if (option.value === "day" && !activeDate) {
                    selectDate(today)
                  }
                  setView(option.value)
                }}
                className={cn(
                  "h-7 rounded-md px-1.5 text-xs font-medium text-code-muted transition-[background-color,color,box-shadow] focus-visible:ring-2 focus-visible:ring-code-ring/50 focus-visible:outline-none @sm:px-2.5",
                  view === option.value &&
                    "bg-code-surface text-code-ink shadow-sm"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              aria-label={`Previous ${view === "day" ? "day" : "month"}`}
              onClick={() => changePeriod(-1)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              className="h-9 px-2.5 text-xs @sm:px-3 @sm:text-sm"
              onClick={selectToday}
              size="sm"
              type="button"
              variant="ghost"
            >
              Today
            </Button>
            <Button
              aria-label={`Next ${view === "day" ? "day" : "month"}`}
              onClick={() => changePeriod(1)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>

          {onCreateEvent ? (
            <Button
              className="w-full @xl:w-auto"
              onClick={() => onCreateEvent(activeDate ?? today)}
              size="sm"
              type="button"
            >
              Add event
            </Button>
          ) : null}
        </div>
      </header>

      <div className="mt-4 grid min-w-0 gap-4 @sm:mt-5 @xl:gap-5 @2xl:grid-cols-[minmax(0,1fr)_15rem] @2xl:gap-4">
        <div className="min-w-0">
          {view === "month" ? (
            <div
              className="grid grid-cols-7 pb-2 text-center text-xs font-medium text-code-muted"
              aria-hidden="true"
            >
              {weekdayNames.map((weekday) => (
                <span
                  key={weekday.full}
                  className="truncate px-0.5 @sm:px-1.5 @xl:px-2"
                >
                  <span className="@sm:hidden">
                    {weekday.short.slice(0, 1)}
                  </span>
                  <span className="hidden @sm:inline">{weekday.short}</span>
                </span>
              ))}
            </div>
          ) : null}

          <div className="relative">
            <AnimatePresence initial={false} mode="wait">
              {view === "month" ? (
                <motion.div
                  key={`month-${dateKey(displayedMonth)}`}
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, x: -8 }
                  }
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <table
                    aria-label={`${monthLabel} calendar`}
                    className="w-full table-fixed border-collapse"
                  >
                    <thead className="sr-only">
                      <tr>
                        {weekdayNames.map((weekday) => (
                          <th key={weekday.full} scope="col">
                            {weekday.full}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(
                        { length: dates.length / 7 },
                        (_, weekIndex) => (
                          <tr className="align-top" key={weekIndex}>
                            {dates
                              .slice(weekIndex * 7, weekIndex * 7 + 7)
                              .map((date) => {
                                const key = dateKey(date)
                                const isCurrentMonth =
                                  date.getMonth() === displayedMonth.getMonth()
                                const selected = sameDate(date, activeDate)
                                const isToday = sameDate(date, today)
                                const dayEvents = eventsByDate.get(key) ?? []

                                return (
                                  <td
                                    key={key}
                                    className={cn(
                                      "h-12 overflow-hidden border-r border-b border-code-line/25 p-0.5 align-top last:border-r-0 @2xl:h-20"
                                    )}
                                  >
                                    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg px-0.5 py-1 transition-colors @sm:px-0 @sm:py-0.5 @xl:px-1.5">
                                      <button
                                        type="button"
                                        aria-label={`Select ${longDateFormatter.format(date)}${dayEvents.length ? `, ${dayEvents.map((event) => event.title).join(", ")}` : ""}`}
                                        aria-pressed={selected}
                                        onClick={() => selectDate(date)}
                                        className={cn(
                                          "mx-auto grid size-7 shrink-0 place-items-center rounded-full text-xs tabular-nums transition-[background-color,color,transform] outline-none hover:bg-code-quiet/75 focus-visible:ring-2 focus-visible:ring-code-ring/60 active:scale-[0.96] motion-reduce:transition-none @2xl:mx-0 @2xl:size-8 @2xl:text-sm",
                                          !isCurrentMonth &&
                                            "text-code-muted/45",
                                          isCurrentMonth && "text-code-ink",
                                          isToday &&
                                            !selected &&
                                            "font-semibold text-code-accent",
                                          selected &&
                                            "bg-code-accent font-semibold text-code-accent-foreground hover:bg-code-accent/90"
                                        )}
                                      >
                                        {dayFormatter.format(date)}
                                      </button>

                                      <div className="mt-0.5 hidden min-w-0 @2xl:block">
                                        {dayEvents.slice(0, 1).map((event) => (
                                          <button
                                            key={event.id}
                                            type="button"
                                            title={`${eventTime(event)} · ${event.title}`}
                                            onClick={() =>
                                              handleEventSelect(event)
                                            }
                                            className={eventRowClass()}
                                          >
                                            <span className="hidden shrink-0 text-[0.65rem] text-code-muted/85 tabular-nums @5xl:inline">
                                              {event.allDay
                                                ? "All day"
                                                : eventTime(event)}
                                            </span>
                                            <span className="line-clamp-2 min-w-0 leading-[1.125rem] font-medium text-code-ink/90">
                                              {event.title}
                                            </span>
                                          </button>
                                        ))}
                                      </div>

                                      {dayEvents.length > 0 ? (
                                        <span
                                          aria-hidden="true"
                                          className="mt-1 flex min-h-1.5 items-center justify-center gap-1 @2xl:hidden"
                                        >
                                          {dayEvents
                                            .slice(0, 3)
                                            .map((event) => (
                                              <span
                                                key={event.id}
                                                className={cn(
                                                  "size-1.5 rounded-full",
                                                  event.tone === "positive" &&
                                                    "bg-code-positive",
                                                  event.tone === "warning" &&
                                                    "bg-code-warning",
                                                  event.tone === "neutral" &&
                                                    "bg-code-muted",
                                                  (!event.tone ||
                                                    event.tone === "accent") &&
                                                    "bg-code-accent"
                                                )}
                                              />
                                            ))}
                                        </span>
                                      ) : null}
                                    </div>
                                  </td>
                                )
                              })}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </motion.div>
              ) : view === "day" ? (
                <motion.div
                  key="day"
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, x: -8 }
                  }
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <DayTimeline
                    date={dayViewDate}
                    events={dayViewEvents}
                    formatEventRange={eventTimeRange}
                    formatEventTime={eventTime}
                    locale={locale}
                    onEventSelect={handleEventSelect}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={`agenda-${dateKey(displayedMonth)}`}
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, x: -8 }
                  }
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <div
                    aria-labelledby={agendaId}
                    className="max-h-[24rem] overflow-y-auto overscroll-contain pr-1"
                  >
                    <h3 id={agendaId} className="sr-only">
                      Events in {monthLabel}
                    </h3>
                    {renderMonthEvents("space-y-0")}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {view === "month" ? (
            <section
              aria-labelledby={`${agendaId}-mobile`}
              className="mt-4 @2xl:hidden"
            >
              <h3
                id={`${agendaId}-mobile`}
                className="mb-1 text-sm font-semibold text-code-ink"
              >
                Events this month
              </h3>
              {renderMonthEvents()}
            </section>
          ) : null}
        </div>

        <aside
          aria-labelledby={`${agendaId}-day`}
          className={cn(
            "min-w-0 flex-col @2xl:min-h-64 @2xl:border-l @2xl:border-code-line/35 @2xl:pl-4",
            view === "day" ? "hidden" : "hidden @2xl:flex"
          )}
        >
          <div className="flex shrink-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                id={`${agendaId}-day`}
                className="text-sm font-semibold text-code-ink"
                aria-live="polite"
                aria-atomic="true"
              >
                <TextMorph
                  as="span"
                  duration={200}
                  respectReducedMotion
                  className="block truncate"
                >
                  {activeDateLabel}
                </TextMorph>
              </h3>
              <p className="mt-1 text-xs text-code-muted" aria-live="polite">
                {activeDayEvents.length === 0
                  ? "No events"
                  : `${activeDayEvents.length} ${activeDayEvents.length === 1 ? "event" : "events"}`}
              </p>
            </div>
          </div>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            {activeDayEvents.length > 0 ? (
              <ol className="divide-y divide-code-line/25">
                {activeDayEvents.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => handleEventSelect(event)}
                      className="grid min-h-12 w-full grid-cols-[max-content_minmax(0,1fr)] items-start gap-2 rounded-sm px-1.5 py-2 text-left transition-colors hover:bg-code-canvas/60 focus-visible:ring-2 focus-visible:ring-code-ring/55 focus-visible:outline-none focus-visible:ring-inset @sm:gap-3 @sm:px-2"
                    >
                      <span className="text-xs leading-5 font-medium whitespace-nowrap text-code-muted tabular-nums">
                        {eventTimeRange(event)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm leading-5 font-medium text-code-ink">
                          {event.title}
                        </span>
                        {event.category || event.location ? (
                          <span className="mt-0.5 block truncate text-xs text-code-muted">
                            {[event.category, event.location]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="py-2 text-sm text-code-muted">
                No events on this day
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

interface DayTimelineProps {
  date: Date
  events: readonly EventCalendarEvent[]
  locale?: string
  formatEventTime: (event: EventCalendarEvent) => string
  formatEventRange: (event: EventCalendarEvent) => string
  onEventSelect?: (event: EventCalendarEvent) => void
}

interface PositionedEvent {
  event: EventCalendarEvent
  startMinute: number
  endMinute: number
  column: number
  columnCount: number
}

const HOURS_PER_DAY = 24
const MINUTES_PER_DAY = HOURS_PER_DAY * 60
const HOUR_HEIGHT = 48
const DAY_VIEW_START_HOUR = 7.5

function positionTimedEvents(
  events: readonly EventCalendarEvent[],
  date: Date
): PositionedEvent[] {
  const dayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime()
  const positioned = events
    .filter((event) => !event.allDay)
    .map((event) => {
      const startMinute = Math.max(
        0,
        Math.floor((event.start.getTime() - dayStart) / 60_000)
      )
      const rawEndMinute = event.end
        ? Math.ceil((event.end.getTime() - dayStart) / 60_000)
        : startMinute + 60
      const endMinute = Math.min(
        MINUTES_PER_DAY,
        Math.max(startMinute + 30, rawEndMinute)
      )

      return {
        event,
        startMinute,
        endMinute,
        column: 0,
        columnCount: 1,
      }
    })
    .filter((event) => event.startMinute < MINUTES_PER_DAY)
    .sort(
      (first, second) =>
        first.startMinute - second.startMinute ||
        first.endMinute - second.endMinute
    )

  const result: PositionedEvent[] = []
  let cluster: PositionedEvent[] = []
  let clusterEnd = -1

  const finishCluster = () => {
    if (cluster.length === 0) return

    const columnEnds: number[] = []
    for (const event of cluster) {
      let column = columnEnds.findIndex(
        (endMinute) => endMinute <= event.startMinute
      )
      if (column < 0) {
        column = columnEnds.length
        columnEnds.push(event.endMinute)
      } else {
        columnEnds[column] = event.endMinute
      }
      event.column = column
    }

    for (const event of cluster) event.columnCount = columnEnds.length
    result.push(...cluster)
    cluster = []
    clusterEnd = -1
  }

  for (const event of positioned) {
    if (cluster.length > 0 && event.startMinute >= clusterEnd) finishCluster()
    cluster.push(event)
    clusterEnd = Math.max(clusterEnd, event.endMinute)
  }
  finishCluster()

  return result
}

function DayTimeline({
  date,
  events,
  locale,
  formatEventTime,
  formatEventRange,
  onEventSelect,
}: DayTimelineProps) {
  const hasInitializedScroll = React.useRef(false)
  const attachTimelineRef = React.useCallback(
    (container: HTMLDivElement | null) => {
      if (!container || hasInitializedScroll.current) return
      container.scrollTop = DAY_VIEW_START_HOUR * HOUR_HEIGHT
      hasInitializedScroll.current = true
    },
    []
  )
  const titleId = React.useId()
  const allDayEvents = React.useMemo(
    () => events.filter((event) => event.allDay),
    [events]
  )
  const positionedEvents = React.useMemo(
    () => positionTimedEvents(events, date),
    [date, events]
  )
  const hours = React.useMemo(
    () => Array.from({ length: HOURS_PER_DAY }, (_, hour) => hour),
    []
  )
  const dayLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
  const hourFormatter = new Intl.DateTimeFormat(locale, { hour: "numeric" })

  return (
    <section aria-labelledby={titleId}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3
          id={titleId}
          className="[font-family:var(--font-heading)] text-lg leading-tight font-normal text-code-ink @sm:text-xl"
        >
          <TextMorph as="span" duration={180} respectReducedMotion>
            {dayLabel}
          </TextMorph>
        </h3>
        <span className="text-xs text-code-muted tabular-nums">
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      </div>

      {allDayEvents.length > 0 ? (
        <div className="mb-3 grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-2">
          <span className="pt-2 text-xs text-code-muted">All day</span>
          <div className="space-y-1">
            {allDayEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => onEventSelect?.(event)}
                className="flex min-h-8 w-full items-center rounded-md bg-code-accent-soft px-2 text-left text-xs font-medium text-code-ink transition-colors hover:bg-code-accent-soft/75 focus-visible:ring-2 focus-visible:ring-code-ring/50 focus-visible:outline-none"
              >
                <span className="truncate">{event.title}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        ref={attachTimelineRef}
        aria-label={`${dayLabel} timeline`}
        className="max-h-[30rem] overflow-y-auto overscroll-contain pr-1"
      >
        <div
          className="grid grid-cols-[3.5rem_minmax(0,1fr)]"
          style={{ height: `${HOURS_PER_DAY * HOUR_HEIGHT}px` }}
        >
          <div className="relative" aria-hidden="true">
            {hours.map((hour) => {
              const hourDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hour
              )
              return (
                <span
                  key={hour}
                  className={cn(
                    "absolute right-2 text-[0.68rem] leading-none text-code-muted tabular-nums",
                    hour > 0 && "-translate-y-1/2"
                  )}
                  style={{ top: `${hour * HOUR_HEIGHT}px` }}
                >
                  {hourFormatter.format(hourDate)}
                </span>
              )
            })}
          </div>

          <div
            className="relative border-l border-code-line/35"
            style={{ height: `${HOURS_PER_DAY * HOUR_HEIGHT}px` }}
          >
            {hours.map((hour) => (
              <div
                key={hour}
                aria-hidden="true"
                className="absolute inset-x-0 border-t border-code-line/25"
                style={{ top: `${hour * HOUR_HEIGHT}px` }}
              />
            ))}

            {positionedEvents.map((item) => {
              const duration = item.endMinute - item.startMinute
              const blockHeight = Math.min(
                HOURS_PER_DAY * HOUR_HEIGHT -
                  (item.startMinute / 60) * HOUR_HEIGHT,
                Math.max(24, (duration / 60) * HOUR_HEIGHT)
              )
              const columnWidth = 100 / item.columnCount
              const description = [
                item.event.title,
                formatEventRange(item.event),
                item.event.category,
                item.event.location,
              ]
                .filter(Boolean)
                .join(" · ")

              return (
                <button
                  key={item.event.id}
                  type="button"
                  aria-label={description}
                  title={description}
                  onClick={() => onEventSelect?.(item.event)}
                  className="absolute overflow-hidden rounded-md border border-code-line/30 bg-code-accent-soft px-2 py-1 text-left text-code-ink shadow-[0_2px_6px_-4px_color-mix(in_srgb,var(--code-hero)_22%,transparent)] transition-colors hover:bg-code-accent-soft/75 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-code-ring/60 focus-visible:outline-none"
                  style={{
                    top: `${(item.startMinute / 60) * HOUR_HEIGHT}px`,
                    left: `calc(${columnWidth * item.column}% + 4px)`,
                    width: `calc(${columnWidth}% - 8px)`,
                    height: `${blockHeight}px`,
                  }}
                >
                  <span className="block truncate text-xs leading-4 font-semibold">
                    {item.event.title}
                  </span>
                  {blockHeight >= 40 ? (
                    <span className="block truncate text-[0.68rem] leading-4 text-code-muted">
                      {formatEventTime(item.event)}
                    </span>
                  ) : null}
                  {blockHeight >= 68 &&
                  (item.event.category || item.event.location) ? (
                    <span className="block truncate text-[0.68rem] leading-4 text-code-muted">
                      {[item.event.category, item.event.location]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export { EventsCalendar }
