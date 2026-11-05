import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-lg bg-code-quiet/70 p-1 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "relative inline-flex min-h-9 min-w-9 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-code-muted transition-[background-color,color,transform] duration-150 ease-out outline-none after:pointer-events-none after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-code-accent after:transition-transform after:duration-[180ms] hover:bg-code-surface/60 hover:text-code-ink focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-code-ring/40 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-code-surface data-[state=on]:text-code-ink data-[state=on]:after:scale-x-100 motion-reduce:transition-none motion-reduce:after:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
