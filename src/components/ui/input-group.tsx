import * as React from "react"
import { cn } from "@/lib/utils"

export type InputGroupAddonAlign =
  "inline-start" | "inline-end" | "block-start" | "block-end"

function InputGroup({
  className,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role={role ?? (ariaLabel || ariaLabelledBy ? "group" : undefined)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "group/input-group flex min-h-10 w-full min-w-0 flex-wrap items-center rounded-lg border border-code-line/55 bg-code-surface transition-[border-color,box-shadow,background-color] duration-150 ease-out focus-within:border-code-ring focus-within:bg-code-surface-raised focus-within:ring-2 focus-within:ring-code-ring/25 hover:border-code-muted/55 has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-code-quiet has-[:disabled]:opacity-70 has-[[aria-invalid=true]]:border-code-danger has-[[aria-invalid=true]]:focus-within:ring-code-danger/20 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-input"
      type={type}
      className={cn(
        "h-10 min-w-0 flex-1 basis-0 rounded-none border-0 bg-transparent px-3 text-sm text-code-ink shadow-none outline-none placeholder:text-code-muted/75 focus-visible:ring-0 focus-visible:outline-none! disabled:cursor-not-allowed disabled:text-code-muted",
        className
      )}
      {...props}
    />
  )
}

/** Text remains available to assistive technology; associate a meaningful unit via aria-describedby. */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn("text-sm text-code-muted", className)}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & { align?: InputGroupAddonAlign }) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "flex shrink-0 items-center gap-2 text-sm text-code-muted data-[align=block-end]:order-last data-[align=block-end]:basis-full data-[align=block-end]:border-t data-[align=block-end]:border-code-line/55 data-[align=block-end]:px-3 data-[align=block-end]:py-2 data-[align=block-start]:order-first data-[align=block-start]:basis-full data-[align=block-start]:border-b data-[align=block-start]:border-code-line/55 data-[align=block-start]:px-3 data-[align=block-start]:py-2 data-[align=inline-end]:order-last data-[align=inline-end]:pr-3 data-[align=inline-start]:order-first data-[align=inline-start]:pl-3 [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText }
