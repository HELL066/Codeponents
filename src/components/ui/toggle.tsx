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
        "inline-flex min-h-11 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-code-line bg-code-surface px-3 text-sm font-medium text-code-ink shadow-[0_3px_0_color-mix(in_srgb,var(--code-line)_85%,var(--code-ink)),0_5px_9px_-4px_color-mix(in_srgb,var(--code-ink)_24%,transparent)] transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out outline-none hover:border-code-accent/50 hover:bg-code-quiet focus-visible:ring-3 focus-visible:ring-code-ring/40 active:translate-y-[2px] active:scale-[0.96] active:shadow-[inset_0_2px_4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 data-[state=on]:translate-y-[2px] data-[state=on]:border-code-accent/50 data-[state=on]:bg-code-accent-soft data-[state=on]:shadow-[inset_0_2px_5px_color-mix(in_srgb,var(--code-ink)_18%,transparent),0_1px_0_color-mix(in_srgb,var(--code-ink)_10%,transparent)] data-[state=on]:hover:bg-code-accent-soft motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { Toggle }
