import * as React from "react"
import { Toggle as TogglePrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Toggle({
  className,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(
        "inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-code-muted transition-[background-color,color,transform] duration-150 ease-out outline-none hover:bg-code-quiet hover:text-code-ink focus-visible:ring-3 focus-visible:ring-code-ring/40 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-code-accent-soft data-[state=on]:text-code-ink motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { Toggle }
