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
        "relative inline-flex min-h-11 min-w-10 cursor-pointer items-center gap-3 rounded-xl border border-code-line bg-code-surface px-3 text-sm font-medium text-code-ink shadow-sm shadow-code-ink/5 transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out outline-none before:order-1 before:h-6 before:w-10 before:flex-none before:rounded-full before:border before:border-transparent before:bg-code-line before:content-[''] before:transition-colors before:duration-150 before:ease-out after:absolute after:right-3 after:top-1/2 after:size-5 after:-translate-y-1/2 after:-translate-x-[18px] after:rounded-full after:bg-code-surface after:shadow-[0_1px_3px_color-mix(in_srgb,var(--code-ink)_20%,transparent)] after:transition-transform after:duration-150 after:ease-out hover:border-code-accent/40 hover:bg-code-quiet focus-visible:ring-3 focus-visible:ring-code-ring/40 active:scale-[0.96] disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-code-accent/50 data-[state=on]:bg-code-accent-soft data-[state=on]:before:border-code-accent data-[state=on]:before:bg-code-accent data-[state=on]:after:translate-x-0 data-[state=on]:hover:bg-code-accent-soft motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:after:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { Toggle }
