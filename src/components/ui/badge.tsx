import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex min-h-6 items-center gap-2 text-xs font-medium leading-4 before:size-1 before:shrink-0 before:rounded-[1px] before:bg-current before:content-['']",
  {
    variants: {
      tone: {
        neutral: "text-code-muted",
        info: "text-code-accent",
        positive: "text-code-positive",
        warning: "text-code-warning",
        danger: "text-code-danger",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
)

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-tone={tone ?? "neutral"}
      className={cn(badgeVariants({ tone }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
