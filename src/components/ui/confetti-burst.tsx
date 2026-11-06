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
  "--code-confetti-height": string
  "--code-confetti-mid-rotation": string
  "--code-confetti-mid-x": string
  "--code-confetti-mid-y": string
  "--code-confetti-rotation": string
  "--code-confetti-width": string
  "--code-confetti-x": string
  "--code-confetti-y": string
}

type ConfettiBurstStyle = CSSProperties & {
  "--code-confetti-origin-x": string
  "--code-confetti-origin-y": string
  "--code-confetti-pop-duration": string
  "--code-confetti-ring-color": string
  "--code-confetti-ring-delay": string
  "--code-confetti-ring-second-color": string
  "--code-confetti-spark-color": string
  "--code-confetti-spark-delay": string
}

type ConfettiParticleShape = "dot" | "diamond" | "ribbon" | "spark"
type ConfettiBurstPattern = "radial" | "fountain" | "sweep"

type ConfettiParticle = {
  key: string
  shape: ConfettiParticleShape
  style: ConfettiParticleStyle
}

type ConfettiBurstFrame = {
  id: number
  pattern: ConfettiBurstPattern
  style: ConfettiBurstStyle
  particles: ConfettiParticle[]
}

const confettiColors = [
  "var(--code-accent)",
  "var(--code-ring)",
  "var(--code-positive)",
  "var(--code-warning)",
  "var(--code-accent-soft)",
]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function createConfettiBurst(
  id: number,
  particleCount: number,
  duration: number
): ConfettiBurstFrame {
  const pattern = randomItem<ConfettiBurstPattern>([
    "radial",
    "fountain",
    "sweep",
  ])
  const sweepDirection = Math.random() < 0.5 ? -1 : 1
  const originX =
    pattern === "sweep"
      ? sweepDirection < 0
        ? randomBetween(28, 42)
        : randomBetween(58, 72)
      : randomBetween(28, 72)
  const originY =
    pattern === "radial" ? randomBetween(28, 72) : randomBetween(50, 74)
  const phase = randomBetween(0, Math.PI * 2)
  const primaryColor = randomItem(confettiColors)
  const primaryColorIndex = confettiColors.indexOf(primaryColor)
  const secondaryColor =
    confettiColors[(primaryColorIndex + 2) % confettiColors.length]
  const sparkColor =
    confettiColors[(primaryColorIndex + 1) % confettiColors.length]

  const particles = Array.from({ length: particleCount }, (_, index) => {
    const progress = (index + 0.5 + randomBetween(-0.28, 0.28)) / particleCount
    const jitter = randomBetween(-0.2, 0.2)
    const angle =
      pattern === "fountain"
        ? -Math.PI / 2 + (progress - 0.5) * 2.45 + jitter
        : pattern === "sweep"
          ? (sweepDirection < 0 ? -2.75 : -0.38) +
            (progress - 0.5) * 1.55 +
            jitter
          : phase + progress * Math.PI * 2 + jitter
    const distance = randomBetween(38, 78)
    const lift =
      pattern === "radial" ? randomBetween(0, 8) : randomBetween(8, 22)
    const x = Math.round(Math.cos(angle) * distance)
    const y = Math.round(Math.sin(angle) * distance - lift)
    const midX = Math.round(x * 0.44)
    const midY = Math.round(y * 0.44 - randomBetween(7, 14))
    const spin = randomBetween(150, 500) * (Math.random() < 0.5 ? -1 : 1)
    const size = randomBetween(4, 7)
    const shape: ConfettiParticleShape =
      index % 5 === 0
        ? "spark"
        : index % 4 === 0
          ? "ribbon"
          : index % 3 === 0
            ? "diamond"
            : "dot"
    const width = shape === "ribbon" ? size * 0.7 : size
    const height = shape === "ribbon" ? size * 1.9 : size
    const safeDuration = Math.round(duration * randomBetween(0.76, 1))

    const style: ConfettiParticleStyle = {
      "--code-confetti-color": randomItem(confettiColors),
      "--code-confetti-delay": String(Math.round(randomBetween(0, 96))) + "ms",
      "--code-confetti-duration": String(safeDuration) + "ms",
      "--code-confetti-height": String(Math.round(height)) + "px",
      "--code-confetti-mid-rotation": String(Math.round(spin * 0.42)) + "deg",
      "--code-confetti-mid-x": String(midX) + "px",
      "--code-confetti-mid-y": String(midY) + "px",
      "--code-confetti-rotation": String(Math.round(spin)) + "deg",
      "--code-confetti-width": String(Math.round(width)) + "px",
      "--code-confetti-x": String(x) + "px",
      "--code-confetti-y": String(y) + "px",
    }

    return {
      key: String(id) + "-" + String(index),
      shape,
      style,
    }
  })

  const style: ConfettiBurstStyle = {
    "--code-confetti-origin-x": String(Math.round(originX)) + "%",
    "--code-confetti-origin-y": String(Math.round(originY)) + "%",
    "--code-confetti-pop-duration":
      String(Math.round(Math.min(duration * 0.72, 560))) + "ms",
    "--code-confetti-ring-color": primaryColor,
    "--code-confetti-ring-delay":
      String(Math.round(randomBetween(40, 84))) + "ms",
    "--code-confetti-ring-second-color": secondaryColor,
    "--code-confetti-spark-color": sparkColor,
    "--code-confetti-spark-delay":
      String(Math.round(randomBetween(0, 18))) + "ms",
  }

  return { id, pattern, style, particles }
}

export interface ConfettiBurstProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  /** Changing this value fires a randomized burst inside a positioned container. */
  triggerKey: number | string | null
  /** Number of particles in the burst. Clamped between 4 and 32. */
  particleCount?: number
  /** Particle travel time in milliseconds. Clamped below one second. */
  duration?: number
}

function ConfettiBurst({
  triggerKey,
  particleCount = 22,
  duration = 760,
  className,
  style,
  ...props
}: ConfettiBurstProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const previousTriggerRef = useRef(triggerKey)
  const nextBurstIdRef = useRef(0)
  const [burst, setBurst] = useState<ConfettiBurstFrame | null>(null)
  const safeParticleCount = Number.isFinite(particleCount)
    ? Math.min(32, Math.max(4, Math.round(particleCount)))
    : 22
  const safeDuration = Number.isFinite(duration)
    ? Math.min(840, Math.max(320, duration))
    : 760

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
    }, safeDuration + 130)

    return () => window.clearTimeout(timeout)
  }, [burst, safeDuration])

  if (burst === null || prefersReducedMotion) return null

  const mergedStyle = { ...style, ...burst.style }

  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn("code-confetti-burst", className)}
      data-burst-pattern={burst.pattern}
      data-slot="confetti-burst"
      key={burst.id}
      style={mergedStyle}
    >
      <span className="code-confetti-burst__ring" />
      <span className="code-confetti-burst__ring code-confetti-burst__ring--second" />
      <span className="code-confetti-burst__spark" />
      {burst.particles.map(({ key, shape, style: particleStyle }) => (
        <span
          key={key}
          className={cn(
            "code-confetti-particle",
            `code-confetti-particle--${shape}`
          )}
          style={particleStyle}
        />
      ))}
    </span>
  )
}

export { ConfettiBurst }
