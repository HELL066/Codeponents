import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonGroupLabel =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: string; "aria-labelledby": string }

export type ButtonGroupProps = React.ComponentProps<"div"> &
  ButtonGroupLabel & {
    orientation?: "horizontal" | "vertical"
  }

function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "inline-flex w-fit items-center",
        orientation === "horizontal"
          ? "[&>*]:rounded-none [&>*+*]:-ml-px [&>*:first-child]:rounded-l-lg [&>*:focus-visible]:z-10 [&>*:last-child]:rounded-r-lg"
          : "flex-col [&>*]:w-full [&>*]:rounded-none [&>*+*]:-mt-px [&>*:first-child]:rounded-t-lg [&>*:focus-visible]:z-10 [&>*:last-child]:rounded-b-lg",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
