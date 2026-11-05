import * as React from "react"
import { cn } from "@/lib/utils"

export interface AspectRatioProps extends React.ComponentProps<"div"> {
  /** Width divided by height. For example, use 16 / 9 for widescreen media. */
  ratio?: number
}

function AspectRatio({
  ratio = 16 / 9,
  className,
  style,
  ...props
}: AspectRatioProps) {
  const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9

  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full", className)}
      style={{ ...style, aspectRatio: safeRatio }}
      {...props}
    />
  )
}

export { AspectRatio }
