import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentProps,
} from "react"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"
import "./confetti-burst.css"

type ConfettiParticleStyle = CSSProperties & {
  "--code-confetti-color": string
  "--code-confetti-delay": string
  "--code-confetti-duration": string
  "--code-confetti-rotation": string
  "--code-confetti-size": string
  "--code-confetti-x": string
  "--code-confetti-y": string
}

const confettiColors = [
  "var(--code-accent)",
  "var(--code-muted)",
  "var(--code-accent-soft)",
  "var(--code-quiet)",
]

export interface ConfettiBurstProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  /** Change this value to fire a new burst. Render inside a positioned container. */
  triggerKey: number | string | null
  /** Number of particles in the burst. Clamped between 4 and 28. */
  particleCount?: number
  /** Particle travel time in milliseconds. Clamped below one second. */
  duration?: number
}

function ConfettiBurst({
  triggerKey,
  particleCount = 14,
  duration = 680,
  className,
  ...props
}: ConfettiBurstProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const previousTriggerRef = useRef(triggerKey)
  const nextBurstIdRef = useRef(0)
  const [burstId, setBurstId] = useState<number | null>(null)
  const safeParticleCount = Number.isFinite(particleCount)
    ? Math.min(28, Math.max(4, Math.round(particleCount)))
    : 14
  const safeDuration = Number.isFinite(duration)
    ? Math.min(840, Math.max(320, duration))
    : 680

  useEffect(() => {
    if (prefersReducedMotion) {
      previousTriggerRef.current = triggerKey
      return
    }
    if (Object.is(previousTriggerRef.current, triggerKey)) return

    previousTriggerRef.current = triggerKey
    if (triggerKey === null) return

    setBurstId(++nextBurstIdRef.current)
  }, [prefersReducedMotion, triggerKey])

  useEffect(() => {
    if (burstId === null) return

    const timeout = window.setTimeout(() => {
      setBurstId((current) => (current === burstId ? null : current))
    }, safeDuration + 80)

    return () => window.clearTimeout(timeout)
  }, [burstId, safeDuration])

  if (burstId === null || prefersReducedMotion) return null

  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn("code-confetti-burst", className)}
      data-slot="confetti-burst"
    >
      {Array.from({ length: safeParticleCount }, (_, index) => {
        const angle = (index / safeParticleCount) * Math.PI * 2 - Math.PI / 2
        const distance = 22 + ((index * 7) % 15)
        const style: ConfettiParticleStyle = {
          "--code-confetti-color":
            confettiColors[index % confettiColors.length],
          "--code-confetti-delay": String((index % 4) * 12) + "ms",
          "--code-confetti-duration": String(safeDuration) + "ms",
          "--code-confetti-rotation":
            String((index % 2 === 0 ? 1 : -1) * (90 + (index % 4) * 35)) +
            "deg",
          "--code-confetti-size": index % 4 === 0 ? "5px" : "4px",
          "--code-confetti-x":
            String(Math.round(Math.cos(angle) * distance)) + "px",
          "--code-confetti-y":
            String(Math.round(Math.sin(angle) * distance)) + "px",
        }

        return (
          <span
            key={String(burstId) + "-" + String(index)}
            className={cn(
              "code-confetti-particle",
              index % 3 === 0 ? "rounded-full" : "rounded-[2px]"
            )}
            style={style}
          />
        )
      })}
    </span>
  )
}

export { ConfettiBurst }
