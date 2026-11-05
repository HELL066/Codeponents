import * as React from "react"
import { cn } from "@/lib/utils"

function EmptyState({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="empty-state"
      className={cn(
        "mx-auto grid min-h-48 w-full content-center justify-items-center gap-2 px-6 py-10 text-center",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="empty-state-icon"
      className={cn(
        "mb-1 grid size-10 place-items-center text-code-accent [&_svg]:size-7",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="empty-state-title"
      className={cn(
        "text-base font-semibold [text-wrap:balance] text-code-ink",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-state-description"
      className={cn(
        "max-w-sm text-sm leading-6 [text-wrap:pretty] text-code-muted",
        className
      )}
      {...props}
    />
  )
}

function EmptyStateAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-state-action"
      className={cn(
        "mt-2 flex flex-wrap items-center justify-center gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
}
