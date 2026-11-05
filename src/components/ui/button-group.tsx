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
          ? "[&>*]:rounded-none [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg [&>*+*]:-ml-px [&>*:focus-visible]:z-10"
          : "flex-col [&>*]:w-full [&>*]:rounded-none [&>*:first-child]:rounded-t-lg [&>*:last-child]:rounded-b-lg [&>*+*]:-mt-px [&>*:focus-visible]:z-10",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
