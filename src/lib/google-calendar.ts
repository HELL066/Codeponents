export interface GoogleCalendarTemplateEvent {
  title: string
  start: Date
  end?: Date
  allDay?: boolean
  details?: string
  location?: string
}

function formatLocalDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("")
}

function formatUtcDateTime(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "")
}

export function googleCalendarTemplateUrl(event: GoogleCalendarTemplateEvent) {
  const end =
    event.end ??
    new Date(event.start.getTime() + (event.allDay ? 86_400_000 : 3_600_000))
  const dates = event.allDay
    ? `${formatLocalDate(event.start)}/${formatLocalDate(end)}`
    : `${formatUtcDateTime(event.start)}/${formatUtcDateTime(end)}`
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
  })

  if (event.details) params.set("details", event.details)
  if (event.location) params.set("location", event.location)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
