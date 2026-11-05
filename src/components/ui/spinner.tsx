import * as React from "react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.ComponentProps<"span"> {
  label?: string
  size?: "sm" | "default" | "lg"
}

const spinnerSizes = {
  sm: "size-3.5",
  default: "size-4",
  lg: "size-5",
}

function Spinner({
  label = "Loading",
  size = "default",
  className,
  role = "status",
  ...props
}: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      role={role}
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-current",
        className
      )}
      {...props}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        className={cn(spinnerSizes[size], "motion-safe:animate-spin")}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="3"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  )
}

export { Spinner }
