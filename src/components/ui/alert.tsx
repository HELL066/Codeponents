import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative flex gap-3 rounded-xl p-4 text-sm",
  {
    variants: {
      tone: {
        info: "bg-code-accent-soft/55 text-code-ink",
        positive: "bg-code-positive/8 text-code-ink",
        warning: "bg-code-warning/8 text-code-ink",
        danger: "bg-code-danger/8 text-code-ink",
      },
    },
    defaultVariants: {
      tone: "info",
    },
  },
)

export interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode
  title?: string
}

function Alert({ className, tone, icon, title, children, ...props }: AlertProps) {
  const iconTone = {
    info: "text-code-accent",
    positive: "text-code-positive",
    warning: "text-code-warning",
    danger: "text-code-danger",
  }[tone ?? "info"]

  return (
    <div
      data-slot="alert"
      data-tone={tone ?? "info"}
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      {icon ? (
        <span
          className={cn("mt-0.5 shrink-0", iconTone)}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        {title ? <h3 className="font-medium leading-5">{title}</h3> : null}
        {children ? (
          <div
            className={cn(
              "grid gap-1 text-code-muted leading-6",
              title && "mt-1",
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { Alert, alertVariants }
