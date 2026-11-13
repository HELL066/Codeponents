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
        "inline-flex min-h-11 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-code-line bg-code-surface px-3 text-sm font-medium text-code-ink transition-[background-color,border-color,color,scale,translate] duration-100 ease-out outline-none hover:border-code-accent/50 hover:bg-code-quiet focus-visible:ring-3 focus-visible:ring-code-ring/40 active:translate-y-px active:scale-[0.94] active:bg-code-accent-soft active:text-code-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:border-code-accent/50 data-[state=on]:bg-code-accent-soft data-[state=on]:font-semibold data-[state=on]:text-code-accent data-[state=on]:hover:bg-code-accent-soft motion-reduce:transition-none motion-reduce:active:translate-y-0 motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { Toggle }
