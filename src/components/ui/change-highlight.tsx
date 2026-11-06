import {
  useEffect,
  useRef,
  type ComponentProps,
  type CSSProperties,
} from "react"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"
import "./change-highlight.css"

export interface ChangeHighlightProps extends ComponentProps<"div"> {
  /** Changing this value briefly highlights the wrapped content. */
  triggerKey: number | string | null
  /** Highlight fade time in milliseconds. Clamped below one second. */
  duration?: number
}

function ChangeHighlight({
  triggerKey,
  duration = 820,
  className,
  style,
  ...props
}: ChangeHighlightProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const previousTriggerRef = useRef(triggerKey)
  const prefersReducedMotion = usePrefersReducedMotion()
  const safeDuration = Number.isFinite(duration)
    ? Math.min(900, Math.max(250, duration))
    : 820

  useEffect(() => {
    const changed = !Object.is(previousTriggerRef.current, triggerKey)
    previousTriggerRef.current = triggerKey
    const element = elementRef.current

    if (
      !changed ||
      triggerKey === null ||
      triggerKey === undefined ||
      prefersReducedMotion ||
      !element
    ) {
      return
    }

    element.classList.remove("code-change-highlight--active")
    void element.offsetWidth
    element.classList.add("code-change-highlight--active")

    const timeout = window.setTimeout(() => {
      element.classList.remove("code-change-highlight--active")
    }, safeDuration + 40)

    return () => {
      window.clearTimeout(timeout)
      element.classList.remove("code-change-highlight--active")
    }
  }, [prefersReducedMotion, safeDuration, triggerKey])

  const mergedStyle = {
    ...style,
    "--code-change-highlight-duration": String(safeDuration) + "ms",
  } as CSSProperties

  return (
    <div
      {...props}
      ref={elementRef}
      className={cn(className)}
      data-slot="change-highlight"
      style={mergedStyle}
    />
  )
}

export { ChangeHighlight }
