import * as React from "react"
import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex min-h-5 min-w-5 items-center justify-center rounded border border-code-line bg-code-surface px-1.5 font-sans text-[11px] leading-none text-code-muted shadow-[inset_0_-1px_0_var(--code-line)]",
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
