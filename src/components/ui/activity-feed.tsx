import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface ActivityFeedActor {
  name: string
  avatarUrl?: string
  initials?: string
}

export interface ActivityFeedEntry {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  timestamp: string
  dateTime?: string
  actor?: ActivityFeedActor
  href?: string
  action?: React.ReactNode
}

export interface ActivityFeedProps extends Omit<
  React.ComponentProps<"section">,
  "title"
> {
  items: ActivityFeedEntry[]
  title?: React.ReactNode
  action?: React.ReactNode
  emptyMessage?: React.ReactNode
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toLocaleUpperCase()
}

function ActivityFeedContent({ item }: { item: ActivityFeedEntry }) {
  const content = (
    <>
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs leading-4 text-code-muted">
        {item.actor && <span className="font-medium">{item.actor.name}</span>}
        <time dateTime={item.dateTime}>{item.timestamp}</time>
      </div>
      <div className="mt-1 text-sm leading-5 font-medium text-pretty text-code-ink">
        {item.title}
      </div>
      {item.description && (
        <div className="mt-0.5 text-sm leading-5 text-pretty text-code-muted">
          {item.description}
        </div>
      )}
    </>
  )

  if (item.href) {
    return (
      <a
        href={item.href}
        className="group min-w-0 rounded-md transition-colors outline-none hover:bg-code-quiet/35 focus-visible:ring-2 focus-visible:ring-code-ring focus-visible:ring-offset-2 focus-visible:ring-offset-code-surface motion-reduce:transition-none"
      >
        <span className="block min-h-10 px-2 py-1.5">{content}</span>
      </a>
    )
  }

  return <div className="min-w-0 px-2 py-1.5">{content}</div>
}

function ActivityFeed({
  items,
  title = "Recent activity",
  action,
  emptyMessage = "No activity yet",
  className,
  ...props
}: ActivityFeedProps) {
  const headingId = React.useId()

  return (
    <section
      data-slot="activity-feed"
      aria-labelledby={headingId}
      className={cn(
        "min-w-0 rounded-xl bg-code-surface p-4 shadow-[0_1px_2px_color-mix(in_srgb,var(--code-hero)_10%,transparent)] sm:p-5",
        className
      )}
      {...props}
    >
      <header className="flex min-w-0 items-center justify-between gap-4">
        <h3
          id={headingId}
          className="min-w-0 text-base leading-6 font-semibold text-balance text-code-ink"
        >
          {title}
        </h3>
        {action && <div className="shrink-0">{action}</div>}
      </header>

      {items.length > 0 ? (
        <ol className="mt-3.5">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="relative grid min-w-0 grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-x-2.5 py-2 sm:gap-x-3"
            >
              {index < items.length - 1 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-7 bottom-[-1.75rem] left-4 z-0 w-px bg-code-line/45"
                />
              )}
              <span className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-code-surface">
                {item.actor ? (
                  <Avatar className="size-8 ring-2 ring-code-surface">
                    {item.actor.avatarUrl && (
                      <AvatarImage
                        src={item.actor.avatarUrl}
                        alt={item.actor.name}
                      />
                    )}
                    <AvatarFallback>
                      {item.actor.initials || getInitials(item.actor.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full bg-code-accent ring-[3px] ring-code-surface"
                  />
                )}
              </span>
              <div className="col-start-2 min-w-0">
                <ActivityFeedContent item={item} />
              </div>
              {item.action && (
                <div className="relative z-10 col-start-3 row-start-1 mt-0.5 shrink-0">
                  {item.action}
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3.5 rounded-lg bg-code-canvas px-4 py-5 text-sm leading-5 text-code-muted">
          {emptyMessage}
        </p>
      )}
    </section>
  )
}

export { ActivityFeed }
