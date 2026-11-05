import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor
const PopoverClose = PopoverPrimitive.Close

function PopoverContent({
  className,
  align = "start",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        collisionPadding={12}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-[var(--radix-popover-content-available-height)] max-w-[calc(100vw-2rem)] min-w-[min(14rem,calc(100vw-2rem))] origin-[var(--radix-popover-content-transform-origin)] overflow-y-auto overscroll-contain rounded-xl bg-code-surface-raised p-4 text-sm text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_30%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.64)]",
          "data-[side=bottom]:data-[state=closed]:slide-out-to-top-1 data-[side=left]:data-[state=closed]:slide-out-to-right-1 data-[side=right]:data-[state=closed]:slide-out-to-left-1 data-[side=top]:data-[state=closed]:slide-out-to-bottom-1",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverArrow({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Arrow>) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn("fill-code-surface-raised", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
}
