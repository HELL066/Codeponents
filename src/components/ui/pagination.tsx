import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

function Pagination({
  className,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      aria-label={ariaLabel}
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="pagination-item"
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  )
}

export interface PaginationLinkProps extends Omit<
  React.ComponentProps<"a">,
  "href"
> {
  href: string
  isActive?: boolean
  size?: "default" | "icon"
}

function PaginationLink({
  className,
  isActive = false,
  size = "icon",
  "aria-current": ariaCurrent,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      data-slot="pagination-link"
      data-active={isActive || undefined}
      aria-current={ariaCurrent ?? (isActive ? "page" : undefined)}
      className={cn(
        "inline-flex min-h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium text-code-muted transition-[background-color,color] outline-none hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent/30 aria-[current=page]:bg-code-accent-soft aria-[current=page]:text-code-ink motion-reduce:transition-none",
        size === "icon" && "size-9 px-0",
        className
      )}
      {...props}
    />
  )
}

type PaginationControlProps =
  | ({ href: string; disabled?: boolean } & Omit<
      React.ComponentProps<"a">,
      "href" | "aria-disabled"
    >)
  | ({ href?: undefined; disabled?: boolean } & React.ComponentProps<"button">)

function PaginationPrevious({
  className,
  children = "Previous",
  ...props
}: PaginationControlProps) {
  const contents = (
    <>
      <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />
      <span>{children}</span>
    </>
  )

  if ("href" in props && props.href) {
    const { href, disabled = false, onClick, tabIndex, ...anchorProps } = props
    return (
      <a
        data-slot="pagination-previous"
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          onClick?.(event)
        }}
        className={cn(
          "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-code-ink transition-colors outline-none hover:bg-code-quiet focus-visible:ring-2 focus-visible:ring-code-accent/30 disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 motion-reduce:transition-none",
          className
        )}
        {...anchorProps}
      >
        {contents}
      </a>
    )
  }

  const {
    disabled = false,
    type = "button",
    ...buttonProps
  } = props as Extract<PaginationControlProps, { href?: undefined }>
  return (
    <button
      data-slot="pagination-previous"
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-code-ink transition-colors outline-none hover:bg-code-quiet focus-visible:ring-2 focus-visible:ring-code-accent/30 disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none",
        className
      )}
      {...buttonProps}
    >
      {contents}
    </button>
  )
}

function PaginationNext({
  className,
  children = "Next",
  ...props
}: PaginationControlProps) {
  const contents = (
    <>
      <span>{children}</span>
      <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
    </>
  )

  if ("href" in props && props.href) {
    const { href, disabled = false, onClick, tabIndex, ...anchorProps } = props
    return (
      <a
        data-slot="pagination-next"
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          onClick?.(event)
        }}
        className={cn(
          "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-code-ink transition-colors outline-none hover:bg-code-quiet focus-visible:ring-2 focus-visible:ring-code-accent/30 aria-disabled:pointer-events-none aria-disabled:opacity-45 motion-reduce:transition-none",
          className
        )}
        {...anchorProps}
      >
        {contents}
      </a>
    )
  }

  const {
    disabled = false,
    type = "button",
    ...buttonProps
  } = props as Extract<PaginationControlProps, { href?: undefined }>
  return (
    <button
      data-slot="pagination-next"
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-code-ink transition-colors outline-none hover:bg-code-quiet focus-visible:ring-2 focus-visible:ring-code-accent/30 disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none",
        className
      )}
      {...buttonProps}
    >
      {contents}
    </button>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "inline-flex size-9 items-center justify-center text-code-muted",
        className
      )}
      {...props}
    >
      <MoreHorizontal aria-hidden="true" className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
