import type { ComponentProps } from "react"
import { CircleX, LoaderCircle } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export type SuccessCheckState = "loading" | "success" | "error"

export interface SuccessCheckProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  /** Current state to show. */
  state: SuccessCheckState
  /** Accessible status text. Defaults to a short label for the current state. */
  label?: string
}

const stateLabels: Record<SuccessCheckState, string> = {
  loading: "In progress",
  success: "Complete",
  error: "Something went wrong",
}

function SuccessCheck({
  state,
  label,
  className,
  ...props
}: SuccessCheckProps) {
  const prefersReducedMotion = useReducedMotion()
  const stateTone =
    state === "success"
      ? "border-code-accent/25 bg-code-accent-soft text-code-accent"
      : state === "error"
        ? "border-code-danger/20 bg-code-danger/5 text-code-danger"
        : "border-code-line bg-code-surface text-code-muted"

  return (
    <span
      {...props}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors motion-reduce:transition-none",
        stateTone,
        className
      )}
      data-slot="success-check"
      data-state={state}
      role="status"
    >
      <span className="sr-only">{label ?? stateLabels[state]}</span>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={state}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            prefersReducedMotion
              ? undefined
              : { opacity: 0, scale: 0.92, y: -1 }
          }
          initial={
            prefersReducedMotion ? false : { opacity: 0, scale: 0.76, y: 2 }
          }
          transition={{
            duration: prefersReducedMotion ? 0 : 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {state === "success" ? (
            <motion.svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <motion.path
                animate={{ pathLength: 1 }}
                d="m5 12 4 4L19 6"
                initial={prefersReducedMotion ? false : { pathLength: 0 }}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.25}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.svg>
          ) : state === "error" ? (
            <CircleX aria-hidden="true" className="size-4" strokeWidth={2} />
          ) : (
            <LoaderCircle
              aria-hidden="true"
              className={cn(
                "size-4",
                !prefersReducedMotion &&
                  "animate-spin motion-reduce:animate-none"
              )}
              strokeWidth={2}
            />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export { SuccessCheck }
