import type { ComponentProps } from "react"
import { LoaderCircle, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export type SuccessCheckState = "loading" | "success" | "error"
export type SuccessCheckSize = "sm" | "md" | "lg"

export interface SuccessCheckProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  /** Current state to show. */
  state: SuccessCheckState
  /** Accessible status text. Defaults to a short label for the current state. */
  label?: string
  /** Overall mark size. Defaults to md. */
  size?: SuccessCheckSize
}

const sizeClasses: Record<SuccessCheckSize, { root: string; icon: string }> = {
  sm: { root: "size-8", icon: "size-4" },
  md: { root: "size-10", icon: "size-5" },
  lg: { root: "size-12", icon: "size-6" },
}

const stateLabels: Record<SuccessCheckState, string> = {
  loading: "In progress",
  success: "Complete",
  error: "Action failed",
}

function SuccessCheck({
  state,
  label,
  size = "md",
  className,
  ...props
}: SuccessCheckProps) {
  const prefersReducedMotion = useReducedMotion()
  const sizeClass = sizeClasses[size]
  const stateTone =
    state === "success"
      ? "border-code-accent/40 text-code-accent"
      : state === "error"
        ? "border-code-danger/40 text-code-danger"
        : "border-transparent text-code-muted"

  return (
    <span
      {...props}
      className={cn(
        "relative isolate inline-grid align-middle shrink-0 place-items-center rounded-full border bg-transparent transition-[border-color,color,box-shadow] duration-200 motion-reduce:transition-none",
        sizeClass.root,
        stateTone,
        className
      )}
      data-slot="success-check"
      data-state={state}
      role="status"
    >
      <span className="sr-only">{label ?? stateLabels[state]}</span>
      <AnimatePresence initial={false}>
        {state === "success" && !prefersReducedMotion ? (
          <motion.span
            key="success-halo"
            animate={{ opacity: 0, scale: 1.34 }}
            className="pointer-events-none absolute inset-[-3px] rounded-full border border-code-accent/25"
            initial={{ opacity: 0.55, scale: 0.82 }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={state}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 grid place-items-center"
          exit={
            prefersReducedMotion
              ? undefined
              : { opacity: 0, scale: 0.82, y: -1 }
          }
          initial={
            prefersReducedMotion ? false : { opacity: 0, scale: 0.72, y: 2 }
          }
          transition={{
            duration: prefersReducedMotion ? 0 : 0.24,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {state === "success" ? (
            <motion.svg
              aria-hidden="true"
              className={sizeClass.icon}
              fill="none"
              viewBox="0 0 24 24"
            >
              <motion.path
                animate={{ pathLength: 1 }}
                d="m5 13 4 4L19 7"
                initial={prefersReducedMotion ? false : { pathLength: 0 }}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.1"
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.08,
                  duration: prefersReducedMotion ? 0 : 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.svg>
          ) : state === "error" ? (
            <X aria-hidden="true" className={sizeClass.icon} strokeWidth={2} />
          ) : (
            <LoaderCircle
              aria-hidden="true"
              className={cn(
                sizeClass.icon,
                !prefersReducedMotion &&
                  "animate-spin motion-reduce:animate-none"
              )}
              strokeWidth={1.8}
            />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export { SuccessCheck }
