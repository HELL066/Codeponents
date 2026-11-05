import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-64 origin-[var(--radix-tooltip-content-transform-origin)] rounded-md bg-code-surface-raised px-2.5 py-1.5 text-xs leading-5 text-code-ink shadow-[0_8px_24px_-16px_color-mix(in_srgb,var(--code-ink)_35%,transparent)] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:duration-75 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-[0_8px_24px_-16px_rgba(0,0,0,0.65)]",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}

function TooltipArrow({
  className,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Arrow>) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn("fill-code-surface-raised", className)}
      {...props}
    />
  )
}

export {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
}
