import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <span className="group/native-select relative block min-w-0">
      <select
        data-slot="native-select"
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-code-line/55 bg-code-surface px-3 pr-9 text-sm text-code-ink transition-[border-color,box-shadow] outline-none hover:border-code-muted/55 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:bg-code-quiet disabled:text-code-muted aria-invalid:border-code-danger aria-invalid:ring-3 aria-invalid:ring-code-danger/15 motion-reduce:transition-none",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-code-muted transition-colors duration-150 group-focus-within/native-select:text-code-accent group-hover/native-select:text-code-ink motion-reduce:transition-none"
      />
    </span>
  )
}

export { NativeSelect }
