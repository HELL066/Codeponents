import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import { EventListItem } from "@/components/ui/event-list-item"
import { cn } from "@/lib/utils"

export type EventCalendarTone = "accent" | "positive" | "warning" | "neutral"
export type EventCalendarView = "month" | "week" | "day" | "agenda"

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
  /** Initial calendar view. */
  defaultView?: EventCalendarView
  /** Heading level for the month title when the calendar is composed in a page. */
  headingLevel?: 2 | 3 | 4
  /** Day on which the week begins; 0 is Sunday and 1 is Monday. */
  weekStartsOn?: number
  onEventSelect?: (event: EventCalendarEvent) => void
  /** Called after a timed event is dragged or moved with the arrow keys in week view. */
  onEventChange?: (
    nextEvent: EventCalendarEvent,
    previousEvent: EventCalendarEvent
  ) => void
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

function startOfWeek(date: Date, weekStartsOn: number) {
  const offset = (date.getDay() - weekStartsOn + 7) % 7
  return addDays(date, -offset)
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12)
}

const fadeTextAtEndStyle: React.CSSProperties = {
  maskImage:
    "linear-gradient(to right, #000 0%, #000 calc(100% - 1rem), transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, #000 0%, #000 calc(100% - 1rem), transparent 100%)",
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
  onEventChange,
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
  const weekStartDate = startOfWeek(activeDate ?? today, normalizedWeekStart)
  const weekDates = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => addDays(weekStartDate, index)),
    [weekStartDate]
  )

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
  const dayHeadingFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
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
    if (view === "week") {
      const nextDate = addDays(activeDate ?? today, amount * 7)
      if (
        nextDate.getMonth() !== displayedMonth.getMonth() ||
        nextDate.getFullYear() !== displayedMonth.getFullYear()
      ) {
        changeMonth(monthStart(nextDate), false)
      }
      selectDate(nextDate)
      return
    }

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
      "group/event flex min-h-6 min-w-0 items-center gap-1 rounded-md px-1 py-0 text-left text-xs leading-4 text-code-muted transition-[background-color,color] hover:bg-code-accent-soft/45 hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-ring/50 focus-visible:outline-none"
    )

  const monthLabel = monthFormatter.format(displayedMonth)
  const dayViewDate = activeDate ?? today
  const dayViewEvents = eventsByDate.get(dateKey(dayViewDate)) ?? []
  const weekEndDate = weekDates[weekDates.length - 1]!
  const weekStartBoundary = new Date(
    weekDates[0]!.getFullYear(),
    weekDates[0]!.getMonth(),
    weekDates[0]!.getDate()
  )
  const weekEndBoundary = new Date(
    weekStartBoundary.getFullYear(),
    weekStartBoundary.getMonth(),
    weekStartBoundary.getDate() + 7
  )
  const weekLabel = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).formatRange(
    weekStartBoundary,
    new Date(
      weekEndDate.getFullYear(),
      weekEndDate.getMonth(),
      weekEndDate.getDate()
    )
  )
  const weekEvents = events.filter(
    (event) => event.start >= weekStartBoundary && event.start < weekEndBoundary
  )
  const headerLabel =
    view === "day"
      ? dayHeadingFormatter.format(dayViewDate)
      : view === "week"
        ? weekLabel
        : monthLabel
  const headerEventCount =
    view === "day"
      ? dayViewEvents.length
      : view === "week"
        ? weekEvents.length
        : eventsInMonth.length
  const MonthHeading =
    headingLevel === 4 ? "h4" : headingLevel === 3 ? "h3" : "h2"
  const activeDateLabel = activeDate
    ? longDateFormatter.format(activeDate)
    : "Choose a day"
  const renderMonthEvents = (listClassName?: string) =>
    eventsInMonth.length > 0 ? (
      <ol className={cn("divide-y divide-code-line/25", listClassName)}>
        {eventsInMonth.map((event) => {
          const eventSummary = [
            event.title,
            eventTimeRange(event),
            event.category,
            event.location,
          ]
            .filter(Boolean)
            .join(" · ")

          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => handleEventSelect(event)}
                aria-label={eventSummary}
                title={eventSummary}
                className="grid min-h-10 w-full grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-code-canvas focus-visible:ring-2 focus-visible:ring-code-ring/50 focus-visible:outline-none"
              >
                <span className="text-xs leading-4 text-code-muted tabular-nums">
                  {new Intl.DateTimeFormat(locale, {
                    month: "short",
                    day: "numeric",
                  }).format(event.start)}
                </span>
                <span
                  className="block min-w-0 overflow-hidden text-xs leading-4 whitespace-nowrap text-code-ink"
                  style={fadeTextAtEndStyle}
                >
                  {eventSummary}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    ) : (
      <p className="py-2 text-sm text-code-muted">No events this month</p>
    )

  return (
    <section
      aria-labelledby={titleId}
      data-slot="events-calendar"
      className={cn(
        "@container w-full min-w-0 rounded-2xl bg-code-surface p-4 text-code-ink shadow-[0_1px_2px_color-mix(in_srgb,var(--code-ink)_5%,transparent),0_18px_48px_-36px_color-mix(in_srgb,var(--code-hero)_36%,transparent)] @sm:p-5 @xl:p-6",
        className
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 @xl:gap-x-5 @xl:gap-y-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <MonthHeading
            id={titleId}
            className="[font-family:var(--font-heading)] text-code-compact leading-tight font-normal text-code-ink @sm:text-code-group @xl:text-code-section"
          >
            <TextMorph
              as="span"
              duration={280}
              ease="cubic-bezier(0.22, 1, 0.36, 1)"
              respectReducedMotion
            >
              {headerLabel}
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
              {`${headerEventCount} ${headerEventCount === 1 ? "event" : "events"}`}
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
                { value: "week", label: "Week" },
                { value: "day", label: "Day" },
                { value: "agenda", label: "Agenda" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={view === option.value}
                onClick={() => {
                  if (
                    (option.value === "day" || option.value === "week") &&
                    !activeDate
                  ) {
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
              aria-label={`Previous ${view === "day" ? "day" : view === "week" ? "week" : "month"}`}
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
              aria-label={`Next ${view === "day" ? "day" : view === "week" ? "week" : "month"}`}
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

      <div
        className={cn(
          "mt-4 grid min-w-0 gap-4 @sm:mt-5 @xl:gap-5",
          view !== "day" &&
            view !== "week" &&
            "@2xl:grid-cols-[minmax(0,1fr)_15rem] @2xl:gap-4"
        )}
      >
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
                                      "h-12 overflow-hidden border-r border-b border-code-line/25 p-1 align-top last:border-r-0 @sm:p-1.5 @2xl:h-20"
                                    )}
                                  >
                                    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg px-0 py-1.5 transition-colors @sm:px-1 @sm:py-2 @xl:px-1.5">
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
                                            <span
                                              className="block min-w-0 overflow-hidden text-xs leading-4 font-normal whitespace-nowrap text-code-ink/90"
                                              style={fadeTextAtEndStyle}
                                            >
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
              ) : view === "week" ? (
                <motion.div
                  key={`week-${dateKey(weekDates[0]!)}`}
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
                  <WeekTimeline
                    dates={weekDates}
                    events={events}
                    formatEventRange={eventTimeRange}
                    formatEventTime={eventTime}
                    locale={locale}
                    onDateSelect={selectDate}
                    onEventChange={onEventChange}
                    onEventSelect={handleEventSelect}
                    selectedDate={activeDate ?? today}
                  />
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
            view === "day" || view === "week" ? "hidden" : "hidden @2xl:flex"
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
                    <EventListItem
                      allDay={event.allDay}
                      category={event.category}
                      className="hover:bg-code-canvas/60"
                      end={event.end}
                      locale={locale}
                      onSelect={() => handleEventSelect(event)}
                      start={event.start}
                      title={event.title}
                      location={event.location}
                    />
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
  overlapsDay: boolean
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
      const rawStartMinute = Math.floor(
        (event.start.getTime() - dayStart) / 60_000
      )
      const rawEndMinute = event.end
        ? Math.ceil((event.end.getTime() - dayStart) / 60_000)
        : rawStartMinute + 60
      const startMinute = Math.max(0, rawStartMinute)
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
        overlapsDay: rawStartMinute < MINUTES_PER_DAY && rawEndMinute > 0,
      }
    })
    .filter((event) => event.overlapsDay)
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

interface WeekTimelineProps {
  dates: readonly Date[]
  events: readonly EventCalendarEvent[]
  selectedDate?: Date
  locale?: string
  formatEventTime: (event: EventCalendarEvent) => string
  formatEventRange: (event: EventCalendarEvent) => string
  onDateSelect?: (date: Date) => void
  onEventSelect?: (event: EventCalendarEvent) => void
  onEventChange?: (
    nextEvent: EventCalendarEvent,
    previousEvent: EventCalendarEvent
  ) => void
}

interface WeekDropTarget {
  dayIndex: number
  minute: number
  event: EventCalendarEvent
}

interface EventDragState {
  event: EventCalendarEvent
  pointerId: number
  startX: number
  startY: number
  moved: boolean
  target?: WeekDropTarget
}

const WEEK_MIN_WIDTH = 42 * 16
const EVENT_TONE_CLASSES: Record<EventCalendarTone, string> = {
  accent: "border-code-accent/20 bg-code-accent-soft text-code-ink",
  positive: "border-code-positive/20 bg-code-positive/10 text-code-ink",
  warning: "border-code-warning/25 bg-code-warning/15 text-code-ink",
  neutral: "border-code-line/40 bg-code-quiet/70 text-code-ink",
}

function WeekTimeline({
  dates,
  events,
  selectedDate,
  locale,
  formatEventTime,
  formatEventRange,
  onDateSelect,
  onEventSelect,
  onEventChange,
}: WeekTimelineProps) {
  const reducedMotion = useReducedMotion()
  const instructionsId = React.useId()
  const layoutGroupId = React.useId()
  const gridRef = React.useRef<HTMLDivElement>(null)
  const dayColumnRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const eventButtonRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const dragRef = React.useRef<EventDragState | null>(null)
  const suppressClickRef = React.useRef(false)
  const pendingKeyboardFocusRef = React.useRef<string | null>(null)
  const [dropTarget, setDropTarget] = React.useState<WeekDropTarget | null>(
    null
  )
  const [announcement, setAnnouncement] = React.useState("")
  const [now, setNow] = React.useState(() => new Date())
  const weekdays = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short" }),
    [locale]
  )
  const hours = React.useMemo(
    () => Array.from({ length: HOURS_PER_DAY }, (_, hour) => hour),
    []
  )
  const hourFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { hour: "numeric" }),
    [locale]
  )
  const dayFormatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [locale]
  )
  const shortDateFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric" }),
    [locale]
  )
  const days = React.useMemo(
    () =>
      dates.map((date) => {
        const start = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        )
        const end = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1
        )
        const dayEvents = events.filter((event) => {
          if (event.allDay) return dateKey(event.start) === dateKey(date)
          const eventEnd =
            event.end ?? new Date(event.start.getTime() + 60 * 60_000)
          return event.start < end && eventEnd > start
        })

        return {
          date,
          events: dayEvents,
          allDayEvents: dayEvents.filter((event) => event.allDay),
          timedEvents: positionTimedEvents(dayEvents, date),
        }
      }),
    [dates, events]
  )
  const nowDayIndex = dates.findIndex((date) => dateKey(date) === dateKey(now))
  const currentMinute = now.getHours() * 60 + now.getMinutes()

  React.useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  React.useEffect(() => {
    const eventId = pendingKeyboardFocusRef.current
    if (!eventId) return
    eventButtonRefs.current.get(eventId)?.focus()
    pendingKeyboardFocusRef.current = null
  }, [events])

  const attachTimelineRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollTop = DAY_VIEW_START_HOUR * HOUR_HEIGHT
  }, [])

  const targetAtPoint = (clientX: number, clientY: number) => {
    const grid = gridRef.current
    if (!grid) return null
    const gridRect = grid.getBoundingClientRect()
    const firstColumn = dayColumnRefs.current[0]?.getBoundingClientRect()
    const lastColumn = dayColumnRefs.current.at(-1)?.getBoundingClientRect()
    if (
      !firstColumn ||
      !lastColumn ||
      clientY < gridRect.top ||
      clientY > gridRect.bottom ||
      clientX < firstColumn.left ||
      clientX > lastColumn.right
    ) {
      return null
    }
    const column = dayColumnRefs.current.findIndex((element) => {
      if (!element) return false
      const rect = element.getBoundingClientRect()
      return clientX >= rect.left && clientX < rect.right
    })
    const rowY = clientY - gridRect.top
    const slotMinutes = 15
    const rawMinute = (rowY / HOUR_HEIGHT) * 60
    const minute = Math.min(
      MINUTES_PER_DAY - slotMinutes,
      Math.max(0, Math.round(rawMinute / slotMinutes) * slotMinutes)
    )
    const dayIndex = column < 0 ? 0 : column

    return { dayIndex, minute }
  }

  const movedEventAt = (
    event: EventCalendarEvent,
    date: Date,
    minute: number
  ): EventCalendarEvent => {
    const nextStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Math.floor(minute / 60),
      minute % 60
    )
    const duration = event.end
      ? Math.max(30 * 60_000, event.end.getTime() - event.start.getTime())
      : 60 * 60_000
    return {
      ...event,
      start: nextStart,
      ...(event.end ? { end: new Date(nextStart.getTime() + duration) } : {}),
    }
  }

  const moveEvent = (event: EventCalendarEvent, date: Date, minute: number) => {
    const nextEvent = movedEventAt(event, date, minute)
    const nextStart = nextEvent.start
    onEventChange?.(nextEvent, event)
    onDateSelect?.(nextStart)
    setAnnouncement(
      `${event.title} moved to ${dayFormatter.format(nextStart)} at ${formatEventTime(nextEvent)}`
    )
  }

  const beginDrag = (
    event: EventCalendarEvent,
    pointerEvent: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!onEventChange || pointerEvent.button !== 0) return
    dragRef.current = {
      event,
      pointerId: pointerEvent.pointerId,
      startX: pointerEvent.clientX,
      startY: pointerEvent.clientY,
      moved: false,
    }
    pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId)
  }

  const updateDrag = (pointerEvent: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== pointerEvent.pointerId) return
    if (
      !drag.moved &&
      Math.hypot(
        pointerEvent.clientX - drag.startX,
        pointerEvent.clientY - drag.startY
      ) < 5
    ) {
      return
    }

    drag.moved = true
    pointerEvent.preventDefault()
    const target = targetAtPoint(pointerEvent.clientX, pointerEvent.clientY)
    if (!target) return
    drag.target = { ...target, event: drag.event }
    setDropTarget(drag.target)
  }

  const finishDrag = (pointerEvent: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== pointerEvent.pointerId) return
    if (drag.moved) {
      const target = targetAtPoint(pointerEvent.clientX, pointerEvent.clientY)
      drag.target = target ? { ...target, event: drag.event } : undefined
    }
    dragRef.current = null
    setDropTarget(null)

    if (!drag.moved) return
    suppressClickRef.current = true
    window.setTimeout(() => {
      suppressClickRef.current = false
    }, 0)
    if (drag.target) {
      moveEvent(drag.event, dates[drag.target.dayIndex]!, drag.target.minute)
    }
  }

  const handleEventKeyDown = (
    keyboardEvent: React.KeyboardEvent<HTMLButtonElement>,
    item: PositionedEvent,
    date: Date
  ) => {
    if (!onEventChange) return
    const nextDate = new Date(date)
    let nextMinute = item.startMinute
    if (keyboardEvent.key === "ArrowUp") nextMinute -= 15
    else if (keyboardEvent.key === "ArrowDown") nextMinute += 15
    else if (keyboardEvent.key === "ArrowLeft") {
      nextDate.setDate(nextDate.getDate() - 1)
    } else if (keyboardEvent.key === "ArrowRight") {
      nextDate.setDate(nextDate.getDate() + 1)
    } else return

    keyboardEvent.preventDefault()
    if (nextMinute < 0) {
      nextDate.setDate(nextDate.getDate() - 1)
      nextMinute += MINUTES_PER_DAY
    } else if (nextMinute >= MINUTES_PER_DAY) {
      nextDate.setDate(nextDate.getDate() + 1)
      nextMinute -= MINUTES_PER_DAY
    }
    if (
      dateKey(nextDate) < dateKey(dates[0]!) ||
      dateKey(nextDate) > dateKey(dates[dates.length - 1]!)
    ) {
      return
    }
    pendingKeyboardFocusRef.current = item.event.id
    moveEvent(item.event, nextDate, nextMinute)
  }

  return (
    <section aria-label="Week schedule">
      {onEventChange ? (
        <p id={instructionsId} className="sr-only">
          Drag a timed event to move it. You can also focus an event and use the
          arrow keys to move it by fifteen minutes or one day.
        </p>
      ) : null}

      <LayoutGroup id={layoutGroupId}>
        <div
          role="region"
          aria-label="Seven-day schedule, scroll horizontally to see each day"
          tabIndex={0}
          className="overflow-x-auto overscroll-x-contain rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-code-ring/60"
        >
          <div style={{ minWidth: WEEK_MIN_WIDTH }}>
            <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] items-end pb-2 text-center">
              <span aria-hidden="true" />
              {dates.map((date, index) => {
                const today = sameDate(date, now)
                const selected = sameDate(date, selectedDate)

                return (
                  <button
                    key={dateKey(date)}
                    type="button"
                    aria-label={`Select ${dayFormatter.format(date)}${days[index]!.events.length ? `, ${days[index]!.events.length} events` : ""}`}
                    aria-pressed={selected}
                    onClick={() => onDateSelect?.(date)}
                    className="flex min-w-0 flex-col items-center gap-1 rounded-lg py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-code-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-code-surface"
                  >
                    <span className="text-code-muted">
                      {weekdays.format(date)}
                    </span>
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full text-sm tabular-nums transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                        today && !selected && "font-semibold text-code-accent",
                        selected &&
                          "bg-code-accent font-semibold text-code-accent-foreground shadow-sm"
                      )}
                    >
                      {shortDateFormatter.format(date)}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="grid min-h-11 grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] items-start rounded-lg bg-code-canvas/65 py-1">
              <span className="px-2 pt-1 text-[0.68rem] leading-4 text-code-muted">
                All day
              </span>
              {days.map((day) => (
                <div
                  key={dateKey(day.date)}
                  className="min-w-0 space-y-0.5 border-l border-code-line/25 px-1"
                >
                  {day.allDayEvents.slice(0, 2).map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      aria-label={`${event.title}, all day`}
                      onClick={() => onEventSelect?.(event)}
                      className="block min-h-6 w-full truncate rounded-md bg-code-accent-soft px-1.5 text-left text-[0.68rem] font-medium text-code-ink transition-colors outline-none hover:bg-code-accent-soft/75 focus-visible:ring-2 focus-visible:ring-code-ring/60 focus-visible:outline-none"
                    >
                      {event.title}
                    </button>
                  ))}
                  {day.allDayEvents.length > 2 ? (
                    <span className="block truncate px-1 text-[0.65rem] text-code-muted">
                      +{day.allDayEvents.length - 2} more
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <div
              ref={attachTimelineRef}
              role="group"
              aria-label="Hourly schedule"
              className="mt-2 max-h-[30rem] overflow-auto overscroll-contain pr-1"
            >
              <div
                ref={gridRef}
                className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]"
                style={{ height: `${HOURS_PER_DAY * HOUR_HEIGHT}px` }}
              >
                <div className="relative" aria-hidden="true">
                  {hours.map((hour) => (
                    <span
                      key={hour}
                      className={cn(
                        "absolute right-2 text-[0.68rem] leading-none text-code-muted tabular-nums",
                        hour > 0 && "-translate-y-1/2"
                      )}
                      style={{ top: `${hour * HOUR_HEIGHT}px` }}
                    >
                      {hourFormatter.format(
                        new Date(
                          dates[0]!.getFullYear(),
                          dates[0]!.getMonth(),
                          dates[0]!.getDate(),
                          hour
                        )
                      )}
                    </span>
                  ))}
                </div>

                {days.map((day, dayIndex) => {
                  const isToday = dayIndex === nowDayIndex
                  const target =
                    dropTarget?.dayIndex === dayIndex ? dropTarget : null

                  return (
                    <div
                      key={dateKey(day.date)}
                      ref={(node) => {
                        dayColumnRefs.current[dayIndex] = node
                      }}
                      className="relative border-l border-code-line/35"
                    >
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          aria-hidden="true"
                          className="absolute inset-x-0 border-t border-code-line/25"
                          style={{ top: `${hour * HOUR_HEIGHT}px` }}
                        />
                      ))}

                      {target ? (
                        <motion.div
                          aria-hidden="true"
                          className="pointer-events-none absolute z-10 overflow-hidden rounded-md border border-dashed border-code-accent/70 bg-code-accent-soft/60 px-2 py-1 text-xs text-code-ink"
                          initial={false}
                          animate={{
                            top: `${(target.minute / 60) * HOUR_HEIGHT}px`,
                            height: `${Math.max(24, ((target.event.end ? target.event.end.getTime() - target.event.start.getTime() : 60 * 60_000) / 60_000 / 60) * HOUR_HEIGHT)}px`,
                            opacity: 1,
                          }}
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { type: "spring", duration: 0.24, bounce: 0 }
                          }
                          style={{ left: 4, right: 4 }}
                        >
                          <span className="block truncate font-semibold">
                            {target.event.title}
                          </span>
                          <span className="block truncate text-[0.68rem] text-code-muted">
                            {formatEventRange(
                              movedEventAt(
                                target.event,
                                day.date,
                                target.minute
                              )
                            )}
                          </span>
                        </motion.div>
                      ) : null}

                      {isToday ? (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 z-20 border-t border-code-accent"
                          style={{
                            top: `${(currentMinute / 60) * HOUR_HEIGHT}px`,
                          }}
                        >
                          <span className="absolute -top-[0.28rem] -left-1 size-2 rounded-full bg-code-accent" />
                        </div>
                      ) : null}

                      {day.timedEvents.map((item) => {
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
                        const dragging = dropTarget?.event.id === item.event.id

                        return (
                          <motion.button
                            key={item.event.id}
                            layout="position"
                            layoutId={`event-${item.event.id}`}
                            ref={(node) => {
                              if (node) {
                                eventButtonRefs.current.set(item.event.id, node)
                              } else {
                                eventButtonRefs.current.delete(item.event.id)
                              }
                            }}
                            data-event-id={item.event.id}
                            type="button"
                            aria-label={description}
                            aria-describedby={
                              onEventChange ? instructionsId : undefined
                            }
                            aria-keyshortcuts={
                              onEventChange
                                ? "ArrowUp ArrowDown ArrowLeft ArrowRight"
                                : undefined
                            }
                            title={description}
                            onClick={() => {
                              if (suppressClickRef.current) {
                                suppressClickRef.current = false
                                return
                              }
                              onEventSelect?.(item.event)
                            }}
                            onKeyDown={(event) =>
                              handleEventKeyDown(event, item, day.date)
                            }
                            onPointerDown={(event) =>
                              beginDrag(item.event, event)
                            }
                            onPointerMove={updateDrag}
                            onPointerUp={finishDrag}
                            onPointerCancel={() => {
                              dragRef.current = null
                              setDropTarget(null)
                            }}
                            transition={
                              reducedMotion
                                ? { duration: 0 }
                                : { type: "spring", duration: 0.3, bounce: 0 }
                            }
                            className={cn(
                              "absolute z-[1] overflow-hidden rounded-md border px-1.5 py-1 text-left shadow-[0_2px_6px_-4px_color-mix(in_srgb,var(--code-hero)_22%,transparent)] transition-[opacity,box-shadow,background-color] duration-150 ease-out outline-none hover:shadow-sm focus-visible:z-30 focus-visible:ring-2 focus-visible:ring-code-ring/60 focus-visible:outline-none motion-reduce:transition-none",
                              EVENT_TONE_CLASSES[item.event.tone ?? "accent"],
                              onEventChange &&
                                "cursor-grab touch-none active:cursor-grabbing",
                              dragging && "opacity-35"
                            )}
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
                          </motion.button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </LayoutGroup>

      <p aria-live="polite" role="status" className="sr-only">
        {announcement}
      </p>
    </section>
  )
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
    <section aria-label={`${dayLabel} timeline`}>
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
