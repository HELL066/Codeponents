import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import "./progress.css"

export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>

function Progress({ className, value, max = 100, ...props }: ProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100
  const isIndeterminate = value == null
  const normalizedValue = isIndeterminate
    ? null
    : Number.isFinite(value)
      ? Math.min(safeMax, Math.max(0, value))
      : 0
  const percentage =
    normalizedValue == null ? 0 : (normalizedValue / safeMax) * 100

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      max={safeMax}
      value={normalizedValue}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-code-quiet",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full origin-left bg-code-accent transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          isIndeterminate && "code-progress-indeterminate w-1/3 origin-center"
        )}
        style={
          isIndeterminate
            ? undefined
            : { width: "100%", transform: `scaleX(${percentage / 100})` }
        }
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
