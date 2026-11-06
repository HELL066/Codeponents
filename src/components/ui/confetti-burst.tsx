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
  "--code-confetti-arc-rotation": string
  "--code-confetti-arc-x": string
  "--code-confetti-arc-y": string
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
}

type ConfettiParticleShape = "dot" | "paper" | "ribbon"
type ConfettiBurstPattern = "left" | "right" | "crown"

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
  const pattern = randomItem<ConfettiBurstPattern>(["left", "right", "crown"])
  const direction =
    pattern === "left"
      ? -1
      : pattern === "right"
        ? 1
        : Math.random() < 0.5
          ? -1
          : 1
  const originX =
    pattern === "left"
      ? randomBetween(28, 42)
      : pattern === "right"
        ? randomBetween(58, 72)
        : randomBetween(36, 64)
  const originY =
    pattern === "crown" ? randomBetween(38, 54) : randomBetween(52, 70)
  const centerAngle =
    pattern === "left" ? -2.15 : pattern === "right" ? -0.99 : -Math.PI / 2
  const fanWidth = pattern === "crown" ? 2.25 : 1.8
  const style: ConfettiBurstStyle = {
    "--code-confetti-origin-x": String(Math.round(originX)) + "%",
    "--code-confetti-origin-y": String(Math.round(originY)) + "%",
  }

  const particles = Array.from({ length: particleCount }, (_, index) => {
    const progress = (index + randomBetween(0.16, 0.84)) / particleCount
    const angle =
      centerAngle + (progress - 0.5) * fanWidth + randomBetween(-0.16, 0.16)
    const liftDistance = randomBetween(28, 54)
    const liftX = Math.cos(angle) * liftDistance
    const liftY = Math.sin(angle) * liftDistance
    const curl = direction * randomBetween(12, 34) + randomBetween(-8, 8)
    const midX = Math.round(liftX * 0.42)
    const midY = Math.round(liftY * 0.42 - randomBetween(5, 11))
    const arcX = Math.round(liftX * 1.08 + curl * 0.42)
    const arcY = Math.round(liftY * 1.08 - randomBetween(9, 19))
    const x = Math.round(liftX * 1.48 + curl)
    const y = Math.round(liftY * 0.62 + randomBetween(26, 58))
    const spin = randomBetween(180, 540) * (Math.random() < 0.5 ? -1 : 1)
    const size = randomBetween(4, 7)
    const shape: ConfettiParticleShape =
      index % 5 === 0 ? "ribbon" : index % 3 === 0 ? "paper" : "dot"
    const width = shape === "ribbon" ? size * 0.62 : size
    const height =
      shape === "ribbon" ? size * 2.1 : shape === "paper" ? size * 1.25 : size
    const particleDuration = Math.round(duration * randomBetween(0.78, 1))

    const particleStyle: ConfettiParticleStyle = {
      "--code-confetti-arc-rotation": String(Math.round(spin * 0.66)) + "deg",
      "--code-confetti-arc-x": String(arcX) + "px",
      "--code-confetti-arc-y": String(arcY) + "px",
      "--code-confetti-color": randomItem(confettiColors),
      "--code-confetti-delay": String(Math.round(randomBetween(0, 88))) + "ms",
      "--code-confetti-duration": String(particleDuration) + "ms",
      "--code-confetti-height": String(Math.round(height)) + "px",
      "--code-confetti-mid-rotation": String(Math.round(spin * 0.28)) + "deg",
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
      style: particleStyle,
    }
  })

  return { id, pattern, style, particles }
}

export interface ConfettiBurstProps extends Omit<
  ComponentProps<"span">,
  "children"
> {
  /** Changing this value fires a randomized confetti flourish. */
  triggerKey: number | string | null
  /** Number of pieces in the burst. Clamped between 4 and 32. */
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
    }, safeDuration + 120)

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
