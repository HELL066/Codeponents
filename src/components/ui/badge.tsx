import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex min-h-6 items-center text-xs leading-4 font-medium",
  {
    variants: {
      tone: {
        neutral: "text-code-muted",
        info: "text-code-accent",
        positive: "text-code-positive",
        warning: "text-code-warning",
        danger: "text-code-danger",
      },
      appearance: {
        minimal: "bg-transparent px-0",
        tinted: "rounded-md px-2",
      },
    },
    compoundVariants: [
      { appearance: "tinted", tone: "neutral", className: "bg-code-quiet" },
      { appearance: "tinted", tone: "info", className: "bg-code-accent/10" },
      {
        appearance: "tinted",
        tone: "positive",
        className: "bg-code-positive/10",
      },
      {
        appearance: "tinted",
        tone: "warning",
        className: "bg-code-warning/10",
      },
      { appearance: "tinted", tone: "danger", className: "bg-code-danger/10" },
    ],
    defaultVariants: {
      tone: "neutral",
      appearance: "tinted",
    },
  }
)

export interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, appearance, ...props }: BadgeProps) {
  return (
    <span
      data-appearance={appearance ?? "tinted"}
      data-slot="badge"
      data-tone={tone ?? "neutral"}
      className={cn(badgeVariants({ tone, appearance }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
