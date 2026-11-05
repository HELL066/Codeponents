import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label: string
    color: string
  }
>

export interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig
  "aria-label": string
}

function ChartContainer({
  config,
  className,
  style,
  "aria-roledescription": ariaRoleDescription,
  ...props
}: ChartContainerProps) {
  const id = React.useId().replace(/:/g, "")
  const colorVariables = Object.fromEntries(
    Object.entries(config).map(([key, series]) => [
      `--color-${key}`,
      series.color,
    ])
  ) as React.CSSProperties

  return (
    <div
      data-slot="chart"
      data-chart={id}
      className={cn("w-full min-w-0 text-code-muted", className)}
      aria-roledescription={ariaRoleDescription ?? "chart"}
      role="group"
      style={{ ...colorVariables, ...style }}
      {...props}
    />
  )
}

type TooltipDatum = {
  name?: string
  dataKey?: string | number
  value?: unknown
  color?: string
  fill?: string
}

export interface ChartTooltipContentProps extends React.ComponentProps<"div"> {
  active?: boolean
  label?: React.ReactNode
  payload?: readonly TooltipDatum[]
  config: ChartConfig
  formatter?: (value: unknown, series: ChartConfig[string]) => React.ReactNode
}

function ChartTooltipContent({
  active,
  label,
  payload,
  config,
  formatter,
  className,
  ...props
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "max-w-[min(20rem,calc(100vw-2rem))] min-w-32 rounded-lg border border-code-quiet bg-code-surface px-3 py-2 text-sm shadow-[0_8px_24px_-18px_color-mix(in_srgb,var(--code-hero,#06192f)_26%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-hero,#06192f)_12%,transparent)]",
        className
      )}
      {...props}
    >
      {label != null ? (
        <p className="mb-2 text-xs font-medium text-code-muted">{label}</p>
      ) : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = String(item.dataKey ?? item.name ?? index)
          const series = config[key]
          return (
            <div
              className="flex items-center justify-between gap-5"
              key={`${key}-${index}`}
            >
              <span className="flex min-w-0 items-center gap-2 text-code-ink">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: item.color ?? item.fill ?? series?.color,
                  }}
                />
                <span className="truncate">
                  {series?.label ?? item.name ?? key}
                </span>
              </span>
              <span className="shrink-0 font-medium text-code-ink tabular-nums">
                {formatter
                  ? formatter(
                      item.value,
                      series ?? { label: key, color: "currentColor" }
                    )
                  : String(item.value ?? "—")}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ChartContainer,
  ChartTooltipContent,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
}
