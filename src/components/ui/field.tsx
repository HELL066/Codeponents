import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FieldOrientation = "vertical" | "horizontal" | "responsive"

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & { orientation?: FieldOrientation }) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "grid min-w-0 gap-2",
        orientation === "horizontal" &&
          "grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
        orientation === "responsive" &&
          "sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4",
        className
      )}
      {...props}
    />
  )
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("grid min-w-0 gap-5 border-0 p-0", className)}
      {...props}
    />
  )
}

function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("mb-1 text-sm font-medium text-code-ink", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn("text-sm font-medium text-code-ink", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm leading-5 text-code-muted", className)}
      {...props}
    />
  )
}

/** Keep mounted while empty to reserve a line for validation feedback. */
function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-error"
      aria-live="polite"
      className={cn("min-h-5 text-sm leading-5 text-code-danger", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("grid gap-5", className)}
      {...props}
    />
  )
}

export {
  Field,
  FieldSet,
  FieldLegend,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
}
