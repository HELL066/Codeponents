import * as React from "react"
import { cn } from "@/lib/utils"

export interface EventListItemProps {
  title: string
  start: Date
  end?: Date
  /** Include a date when the event appears outside a day-specific list. */
  date?: Date
  locale?: string
  allDay?: boolean
  category?: string
  location?: string
  organizer?: string
  participants?: readonly string[]
  /** Optional action rendered beside the event details. */
  action?: React.ReactNode
  href?: string
  onSelect?: () => void
  className?: string
}

function formatTimeRange(start: Date, end: Date | undefined, locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  })

  if (!end) return formatter.format(start)

  try {
    return formatter.formatRange(start, end)
  } catch {
    return `${formatter.format(start)}–${formatter.format(end)}`
  }
}

function EventListItem({
  title,
  start,
  end,
  date,
  locale = "en-PH",
  allDay = false,
  category,
  location,
  organizer,
  participants,
  action,
  href,
  onSelect,
  className,
}: EventListItemProps) {
  const timeLabel = allDay ? "All day" : formatTimeRange(start, end, locale)
  const dateLabel = date
    ? new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(date)
    : undefined
  const attendeeLabel = participants?.length
    ? `With ${participants.slice(0, 2).join(", ")}${
        participants.length > 2 ? ` +${participants.length - 2}` : ""
      }`
    : undefined
  const details = [
    dateLabel,
    timeLabel,
    category,
    location,
    organizer ? `Hosted by ${organizer}` : undefined,
    attendeeLabel,
  ].filter((detail): detail is string => Boolean(detail))
  const accessibleLabel = [title, ...details].join(", ")

  const mainClassName = cn(
    "grid min-h-10 min-w-0 flex-1 grid-cols-[max-content_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-md px-1.5 py-1 text-left outline-none",
    (href || onSelect) &&
      "cursor-pointer rounded-md transition-colors hover:bg-code-quiet/30 focus-visible:ring-2 focus-visible:ring-code-ring/60 focus-visible:outline-none motion-reduce:transition-none"
  )

  const content = (
    <>
      <span className="row-span-2 min-w-[4.75rem] pt-0.5 text-xs leading-5 font-medium whitespace-nowrap text-code-muted tabular-nums">
        {timeLabel}
        {dateLabel ? (
          <span className="mt-0.5 block text-[0.7rem] leading-4 font-normal text-code-muted/90">
            {dateLabel}
          </span>
        ) : null}
      </span>

      <span className="block min-w-0 truncate text-sm leading-5 font-semibold text-code-ink">
        {title}
      </span>

      {category || location || organizer || attendeeLabel ? (
        <span className="col-start-2 min-w-0 truncate text-xs leading-4 text-code-muted">
          {[
            category,
            location,
            organizer ? `Hosted by ${organizer}` : undefined,
            attendeeLabel,
          ]
            .filter(Boolean)
            .join(" · ")}
        </span>
      ) : null}
    </>
  )

  return (
    <article
      data-slot="event-list-item"
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg px-2 py-2",
        className
      )}
    >
      {href ? (
        <a aria-label={accessibleLabel} className={mainClassName} href={href}>
          {content}
        </a>
      ) : onSelect ? (
        <button
          type="button"
          aria-label={accessibleLabel}
          className={mainClassName}
          onClick={onSelect}
        >
          {content}
        </button>
      ) : (
        <div className={mainClassName}>{content}</div>
      )}

      {action ? <div className="shrink-0">{action}</div> : null}
    </article>
  )
}

export { EventListItem, formatTimeRange }
