import { useId, useState } from "react"
import { useReducedMotion } from "motion/react"
import { TextMorph } from "torph/react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ChartContainer,
  ChartTooltipContent,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const weeklyActivity = [
  { day: "Mon", activity: 12 },
  { day: "Tue", activity: 18 },
  { day: "Wed", activity: 15 },
  { day: "Thu", activity: 24 },
  { day: "Fri", activity: 21 },
  { day: "Sat", activity: 28 },
  { day: "Sun", activity: 25 },
]

const monthlyActivity = [
  { day: "Oct 6", activity: 8 },
  { day: "Oct 10", activity: 12 },
  { day: "Oct 14", activity: 10 },
  { day: "Oct 18", activity: 18 },
  { day: "Oct 22", activity: 15 },
  { day: "Oct 26", activity: 23 },
  { day: "Oct 30", activity: 19 },
  { day: "Nov 4", activity: 27 },
]

const activityConfig = {
  activity: { label: "Activity", color: "var(--code-accent)" },
}

export default function ChartSpecimen({
  title = "Activity",
  className,
}: {
  title?: string
  className?: string
}) {
  const [period, setPeriod] = useState<"week" | "month">("week")
  const chartId = useId().replace(/:/g, "")
  const prefersReducedMotion = useReducedMotion()
  const activity = period === "week" ? weeklyActivity : monthlyActivity
  const peak = activity.reduce((highest, point) =>
    point.activity > highest.activity ? point : highest
  )

  return (
    <Card
      className={cn(
        "grid w-full max-w-none gap-4 border-0 p-4 shadow-none @sm:gap-5 @sm:p-5",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 p-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <Tabs
          onValueChange={(value) => setPeriod(value as "week" | "month")}
          value={period}
        >
          <TabsList aria-label="Activity period" className="min-h-9">
            <TabsTrigger value="week">7 days</TabsTrigger>
            <TabsTrigger value="month">30 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="grid gap-3 p-0">
        <div className="flex min-h-12 items-baseline gap-2">
          <TextMorph
            as="span"
            className="font-heading text-3xl leading-none tracking-tight text-code-ink tabular-nums"
            duration={360}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            numbers
            respectReducedMotion
          >
            {peak.activity}
          </TextMorph>
          <span className="text-xs text-code-muted">
            Peak on{" "}
            <TextMorph as="span" duration={220} respectReducedMotion>
              {peak.day}
            </TextMorph>
          </span>
        </div>
        <ChartContainer
          aria-label={`Activity over the last ${period === "week" ? "7 days" : "30 days"}`}
          config={activityConfig}
          className="h-48 min-w-0 sm:h-52"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activity}
              margin={{ top: 12, right: 16, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient
                  id={`activity-fill-${chartId}`}
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-activity)"
                    stopOpacity={0.16}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-activity)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--code-line)"
                strokeOpacity={0.42}
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="day"
                interval="preserveStartEnd"
                padding={{ left: 12, right: 12 }}
                tickMargin={8}
                tickLine={false}
                tick={{ fill: "var(--code-muted)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickMargin={8}
                tickLine={false}
                tick={{ fill: "var(--code-muted)", fontSize: 12 }}
              />
              <Tooltip
                content={<ChartTooltipContent config={activityConfig} />}
              />
              <Area
                animationDuration={prefersReducedMotion ? 0 : 320}
                animationEasing="ease-out"
                dataKey="activity"
                fill={`url(#activity-fill-${chartId})`}
                isAnimationActive={!prefersReducedMotion}
                stroke="var(--color-activity)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
