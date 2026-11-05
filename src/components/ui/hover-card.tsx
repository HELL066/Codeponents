import * as React from "react"
import { HoverCard as HoverCardPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root
const HoverCardTrigger = HoverCardPrimitive.Trigger

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 8,
  collisionPadding = 12,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-[min(24rem,calc(100dvh-1.5rem))] w-[min(18rem,calc(100vw-1.5rem))] origin-[var(--radix-hover-card-content-transform-origin)] overflow-y-auto overscroll-contain rounded-xl bg-code-surface-raised p-4 text-sm text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_30%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.64)]",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

function HoverCardArrow({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Arrow>) {
  return (
    <HoverCardPrimitive.Arrow
      data-slot="hover-card-arrow"
      className={cn("fill-code-surface-raised", className)}
      {...props}
    />
  )
}

export { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger }
