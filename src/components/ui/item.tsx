import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const itemVariants = cva(
  "group/item flex w-full min-w-0 items-center gap-3 text-left text-code-ink transition-[background-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-code-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-code-surface data-[interactive=true]:cursor-pointer data-[interactive=true]:hover:bg-code-quiet/30 data-[interactive=true]:active:bg-code-accent-soft/45 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "rounded-xl border border-code-line/30 bg-code-surface",
        muted: "rounded-xl bg-code-quiet/35",
      },
      size: {
        default: "min-h-16 px-3.5 py-3",
        sm: "min-h-12 gap-2.5 px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant,
  size,
  asChild = false,
  interactive = false,
  onClick,
  onClickCapture,
  onKeyDown,
  onKeyDownCapture,
  role,
  tabIndex,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & {
    asChild?: boolean
    interactive?: boolean
  }) {
  const Component = asChild ? Slot.Root : "div"
  const ariaDisabled =
    props["aria-disabled"] === true || props["aria-disabled"] === "true"
  const keyboardButton = !asChild && typeof onClick === "function"
  const isInteractive = interactive || keyboardButton || asChild

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (keyboardButton && ariaDisabled) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    onClick?.(event)
  }

  const handleClickCapture: React.MouseEventHandler<HTMLDivElement> = (
    event
  ) => {
    onClickCapture?.(event)
    if (event.defaultPrevented || !ariaDisabled) return
    event.preventDefault()
    event.stopPropagation()
  }

  const handleKeyDownCapture: React.KeyboardEventHandler<HTMLDivElement> = (
    event
  ) => {
    onKeyDownCapture?.(event)
    if (
      event.defaultPrevented ||
      !ariaDisabled ||
      !["Enter", " ", "Spacebar"].includes(event.key)
    ) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !keyboardButton || ariaDisabled) {
      return
    }

    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault()
      if (!event.repeat) event.currentTarget.click()
    }
  }

  return (
    <Component
      data-slot="item"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      data-interactive={isInteractive || undefined}
      className={cn(
        itemVariants({ variant, size, className }),
        ariaDisabled && "pointer-events-none cursor-not-allowed opacity-55"
      )}
      onClickCapture={handleClickCapture}
      onClick={asChild ? onClick : handleClick}
      onKeyDownCapture={handleKeyDownCapture}
      onKeyDown={handleKeyDown}
      role={role ?? (keyboardButton ? "button" : undefined)}
      tabIndex={
        tabIndex ?? (keyboardButton ? (ariaDisabled ? -1 : 0) : undefined)
      }
      {...props}
    />
  )
}

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-group"
      className={cn("grid min-w-0 gap-2", className)}
      {...props}
    />
  )
}

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "avatar"
}) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden text-code-muted",
        variant === "avatar" ? "size-9 rounded-full" : "size-9",
        className
      )}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("grid min-w-0 flex-1 gap-0.5", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("truncate text-sm leading-5 font-medium", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("min-w-0 text-xs leading-5 text-code-muted", className)}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
}
