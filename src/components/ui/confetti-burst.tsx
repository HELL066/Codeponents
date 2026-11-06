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

type ConfettiParticle = {
  key: string
  shape: "dot" | "paper"
  style: ConfettiParticleStyle
}

type ConfettiBurstFrame = {
  id: number
  particles: ConfettiParticle[]
}

const confettiColors = [
  "var(--code-accent)",
  "var(--code-muted)",
  "var(--code-accent-soft)",
  "var(--code-quiet)",
]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createConfettiBurst(
  id: number,
  particleCount: number,
  duration: number
): ConfettiBurstFrame {
  const phase = randomBetween(0, Math.PI * 2)
  const colorOffset = Math.floor(randomBetween(0, confettiColors.length))
  const angleStep = (Math.PI * 2) / particleCount
  const particles = Array.from({ length: particleCount }, (_, index) => {
    const angle = phase + index * angleStep + randomBetween(-0.12, 0.12)
    const distance = randomBetween(27, 42)
    const x = Math.round(Math.cos(angle) * distance)
    const y = Math.round(Math.sin(angle) * distance - randomBetween(1, 5))
    const spin = randomBetween(100, 250) * (Math.random() < 0.5 ? -1 : 1)
    const size = randomBetween(3.5, 5.5)
    const shape: ConfettiParticle["shape"] =
      Math.random() < 0.28 ? "dot" : "paper"
    const particleDuration = Math.round(duration * randomBetween(0.86, 1))
    const style: ConfettiParticleStyle = {
      "--code-confetti-color":
        confettiColors[(index + colorOffset) % confettiColors.length],
      "--code-confetti-delay": String(Math.round(randomBetween(0, 48))) + "ms",
      "--code-confetti-duration": String(particleDuration) + "ms",
      "--code-confetti-rotation": String(Math.round(spin)) + "deg",
      "--code-confetti-size": String(Math.round(size)) + "px",
      "--code-confetti-x": String(x) + "px",
      "--code-confetti-y": String(y) + "px",
    }

    return {
      key: String(id) + "-" + String(index),
      shape,
      style,
    }
  })

  return { id, particles }
}

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
  const [burst, setBurst] = useState<ConfettiBurstFrame | null>(null)
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

    const id = ++nextBurstIdRef.current
    setBurst(createConfettiBurst(id, safeParticleCount, safeDuration))
  }, [prefersReducedMotion, safeDuration, safeParticleCount, triggerKey])

  useEffect(() => {
    if (burst === null) return

    const timeout = window.setTimeout(() => {
      setBurst((current) => (current?.id === burst.id ? null : current))
    }, safeDuration + 80)

    return () => window.clearTimeout(timeout)
  }, [burst, safeDuration])

  if (burst === null || prefersReducedMotion) return null

  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn("code-confetti-burst", className)}
      data-slot="confetti-burst"
      key={burst.id}
    >
      {burst.particles.map(({ key, shape, style }) => (
        <span
          key={key}
          className={cn(
            "code-confetti-particle",
            shape === "dot" ? "rounded-full" : "rounded-[2px]"
          )}
          style={style}
        />
      ))}
    </span>
  )
}

export { ConfettiBurst }
