import { useId, type ComponentProps, type ReactNode } from "react"
import { TextMorph } from "torph/react"
import { cn } from "@/lib/utils"

export type MetricTone = "neutral" | "positive" | "negative"

export interface MetricCardProps extends Omit<
  ComponentProps<"article">,
  "children"
> {
  /** A short, visible name for the value. */
  label: string
  /** Format the value before passing it; numbers use tabular figures. */
  value: ReactNode
  /** A change such as “4% more” or “2 fewer”. */
  change?: ReactNode
  /** The period or baseline used to interpret the change. */
  comparison?: ReactNode
  /** An optional compact visual; label it if it carries meaning of its own. */
  visual?: ReactNode
  /** The semantic tone of the change text. */
  tone?: MetricTone
}

const toneClasses: Record<MetricTone, string> = {
  neutral: "text-code-muted",
  positive: "text-code-positive",
  negative: "text-code-danger",
}

function MetricCard({
  label,
  value,
  change,
  comparison,
  visual,
  tone = "neutral",
  className,
  ...props
}: MetricCardProps) {
  const generatedLabelId = useId()
  const hasChange = change !== undefined && change !== null && change !== false
  const hasComparison =
    comparison !== undefined && comparison !== null && comparison !== false
  const hasFooter = hasChange || hasComparison
  const hasVisual = visual !== undefined && visual !== null && visual !== false

  return (
    <article
      {...props}
      aria-labelledby={props["aria-labelledby"] ?? generatedLabelId}
      className={cn(
        "grid min-w-0 gap-x-4 gap-y-1.5 rounded-xl bg-code-surface p-5 shadow-[0_1px_2px_color-mix(in_srgb,var(--code-hero)_8%,transparent),0_10px_24px_-22px_color-mix(in_srgb,var(--code-hero)_20%,transparent)] sm:gap-x-6 sm:p-6",
        hasVisual
          ? "min-h-40 grid-cols-[minmax(0,1fr)_minmax(6rem,min(40%,12rem))]"
          : "grid-cols-1",
        hasFooter ? "grid-rows-[auto_auto_auto]" : "grid-rows-[auto_auto]",
        className
      )}
      data-slot="metric-card"
      data-tone={tone}
    >
      <p
        className="col-start-1 row-start-1 m-0 min-w-0 truncate text-[13px] leading-5 font-medium text-code-muted"
        data-slot="metric-card-label"
        id={generatedLabelId}
      >
        {label}
      </p>

      <div className="col-start-1 row-start-2 flex min-w-0 items-end">
        <span
          className="min-w-0 truncate [font-family:var(--font-heading)] text-[clamp(2.25rem,5vw,3rem)] leading-[0.94] font-normal tracking-[-0.025em] text-code-accent tabular-nums"
          data-slot="metric-card-value"
        >
          {typeof value === "string" || typeof value === "number" ? (
            <TextMorph
              as="span"
              duration={460}
              ease="cubic-bezier(0.22, 1, 0.36, 1)"
              numbers
              respectReducedMotion
            >
              {value}
            </TextMorph>
          ) : (
            value
          )}
        </span>
      </div>

      {hasVisual ? (
        <div
          className="col-start-2 row-span-full row-start-1 flex min-w-0 items-center justify-end text-code-accent"
          data-slot="metric-card-visual"
        >
          {visual}
        </div>
      ) : null}

      {hasFooter ? (
        <p className="col-start-1 row-start-3 m-0 flex min-h-5 min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 text-[12px] leading-5">
          {hasChange ? (
            <span
              className={cn("font-medium", toneClasses[tone])}
              data-slot="metric-card-change"
            >
              {typeof change === "string" || typeof change === "number" ? (
                <TextMorph
                  as="span"
                  duration={260}
                  ease="cubic-bezier(0.22, 1, 0.36, 1)"
                  numbers
                  respectReducedMotion
                >
                  {change}
                </TextMorph>
              ) : (
                change
              )}
            </span>
          ) : null}
          {hasComparison ? (
            <span
              className="min-w-0 text-code-muted"
              data-slot="metric-card-comparison"
            >
              {typeof comparison === "string" ||
              typeof comparison === "number" ? (
                <TextMorph
                  as="span"
                  duration={260}
                  numbers
                  respectReducedMotion
                >
                  {comparison}
                </TextMorph>
              ) : (
                comparison
              )}
            </span>
          ) : null}
        </p>
      ) : null}
    </article>
  )
}

export { MetricCard }
