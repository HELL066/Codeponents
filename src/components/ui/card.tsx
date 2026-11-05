import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl bg-code-surface shadow-[0_1px_2px_color-mix(in_srgb,var(--code-hero)_10%,transparent)]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-base leading-6 font-medium", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm leading-6 text-code-muted", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("p-5", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="card-footer"
      className={cn("flex items-center gap-3 p-5 pt-0", className)}
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
