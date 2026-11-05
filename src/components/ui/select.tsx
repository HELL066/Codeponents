import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "group/select-trigger flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-code-line/55 bg-code-surface px-3 text-left text-sm text-code-ink transition-[border-color,box-shadow,background-color] outline-none hover:border-code-muted/55 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:bg-code-quiet disabled:text-code-muted aria-expanded:border-code-accent/40 aria-expanded:bg-code-accent-soft/35 aria-invalid:border-code-danger aria-invalid:ring-3 aria-invalid:ring-code-danger/15 data-[placeholder]:text-code-muted/75 motion-reduce:transition-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-code-muted transition-transform duration-150 group-data-[state=open]/select-trigger:rotate-180 motion-reduce:transition-none"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={5}
        className={cn(
          "z-50 max-h-[var(--radix-select-content-available-height)] max-w-[calc(100vw-2rem)] min-w-[var(--radix-select-trigger-width)] origin-[var(--radix-select-content-transform-origin)] overflow-hidden rounded-xl bg-code-surface-raised p-1 text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_20%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_12%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:data-[state=closed]:slide-out-to-top-1 data-[side=left]:data-[state=closed]:slide-out-to-right-1 data-[side=right]:data-[state=closed]:slide-out-to-left-1 data-[side=top]:data-[state=closed]:slide-out-to-bottom-1 data-[state=open]:animate-in data-[state=open]:duration-200 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:ring-1 dark:ring-code-line/55",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-7 cursor-default items-center justify-center text-code-muted">
          <ChevronUp aria-hidden="true" className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-0.5">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-7 cursor-default items-center justify-center text-code-muted">
          <ChevronDown aria-hidden="true" className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-code-muted",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-10 w-full cursor-default items-center rounded-md py-1.5 pr-8 pl-2 text-sm transition-[background-color,color] duration-150 ease-out outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[highlighted]:bg-code-quiet data-[highlighted]:text-code-ink data-[state=checked]:font-medium data-[state=checked]:text-code-accent motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute right-2 inline-flex size-4 items-center justify-center text-code-accent"
      >
        <SelectPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-code-line", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
