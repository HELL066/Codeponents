import * as React from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-code-line/55 bg-code-surface px-3 text-sm text-code-ink transition-[border-color,box-shadow,background-color] outline-none placeholder:text-code-muted/75 hover:border-code-muted/55 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:bg-code-quiet disabled:text-code-muted aria-invalid:border-code-danger aria-invalid:ring-3 aria-invalid:ring-code-danger/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
