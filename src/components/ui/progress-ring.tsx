import { useEffect, useState, type ComponentProps, type ReactNode } from "react"
import { TextMorph } from "torph/react"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

export interface ProgressRingProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  value: number
  max?: number
  label: string
  size?: number
  strokeWidth?: number
  showValue?: boolean
  /** Reveal the ring from empty when it first enters the page. */
  animateOnMount?: boolean
  /** Decorative content centered in the ring, such as a concise custom value. */
  center?: ReactNode
}

function ProgressRing({
  value,
  max = 100,
  label,
  size = 64,
  strokeWidth = 5,
  showValue = true,
  animateOnMount = true,
  center,
  className,
  ...props
}: ProgressRingProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [hasEntered, setHasEntered] = useState(
    !animateOnMount || prefersReducedMotion
  )
  const safeSize = Number.isFinite(size) ? Math.max(2, size) : 64
  const safeStrokeWidth = Number.isFinite(strokeWidth)
    ? Math.min(safeSize - 1, Math.max(1, strokeWidth))
    : Math.min(5, safeSize - 1)
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100
  const safeValue = Number.isFinite(value)
    ? Math.min(safeMax, Math.max(0, value))
    : 0
  const progress = safeMax === 0 ? 0 : safeValue / safeMax
  const radius = (safeSize - safeStrokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.round(progress * 100)
  const showProgress = !animateOnMount || prefersReducedMotion || hasEntered
  const visualProgress = showProgress ? progress : 0
  const visualPercentage = Math.round(visualProgress * 100)

  useEffect(() => {
    if (!animateOnMount || prefersReducedMotion || hasEntered) return

    const frame = window.requestAnimationFrame(() => setHasEntered(true))
    return () => window.cancelAnimationFrame(frame)
  }, [animateOnMount, hasEntered, prefersReducedMotion])

  return (
    <div
      {...props}
      aria-label={label}
      aria-valuemax={safeMax}
      aria-valuemin={0}
      aria-valuenow={safeValue}
      aria-valuetext={`${safeValue} of ${safeMax} (${percentage}%)`}
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        className
      )}
      data-slot="progress-ring"
      role="progressbar"
      style={{ width: safeSize, height: safeSize, ...props.style }}
    >
      <svg
        aria-hidden="true"
        className="size-full -rotate-90 overflow-visible"
        viewBox={`0 0 ${safeSize} ${safeSize}`}
      >
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          fill="none"
          r={radius}
          stroke="var(--code-accent-soft)"
          strokeOpacity={0.7}
          strokeWidth={safeStrokeWidth}
        />
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          fill="none"
          r={radius}
          stroke="var(--code-accent)"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - visualProgress)}
          strokeLinecap="round"
          strokeWidth={safeStrokeWidth}
          className="transition-[stroke-dashoffset] duration-[760ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        />
      </svg>
      {center != null && center !== false ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid place-items-center"
        >
          {center}
        </span>
      ) : showValue ? (
        <span
          aria-hidden="true"
          className="absolute text-xs font-semibold text-code-ink tabular-nums"
        >
          <TextMorph
            as="span"
            duration={760}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            numbers
            respectReducedMotion
          >
            {visualPercentage}%
          </TextMorph>
        </span>
      ) : null}
    </div>
  )
}

export { ProgressRing }
