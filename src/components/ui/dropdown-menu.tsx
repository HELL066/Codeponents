import * as React from "react"
import { Check, ChevronRight, Circle } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

function DropdownMenuContent({
  className,
  sideOffset = 6,
  collisionPadding = 12,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] max-w-[calc(100vw-2rem)] min-w-40 origin-[var(--radix-dropdown-menu-content-transform-origin)] overflow-y-auto rounded-xl bg-code-surface-raised p-1.5 text-sm text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_30%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.64)]",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      className={cn(
        "relative flex min-h-10 cursor-default items-center gap-2 rounded-md px-2.5 text-sm transition-[background-color,color,opacity] duration-150 ease-out outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[inset=true]:pl-8 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-code-muted",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      className={cn(
        "relative flex min-h-10 cursor-default items-center gap-2 rounded-md py-1 pr-2.5 pl-8 text-sm transition-[background-color,color] duration-150 ease-out outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-45 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <span
        className="absolute left-2 flex size-4 items-center justify-center text-code-accent"
        aria-hidden="true"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-3.5" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex min-h-10 cursor-default items-center gap-2 rounded-md py-1 pr-2.5 pl-8 text-sm transition-[background-color,color] duration-150 ease-out outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-45 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <span
        className="absolute left-2 flex size-4 items-center justify-center text-code-accent"
        aria-hidden="true"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current stroke-[3px]" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-code-muted data-[inset=true]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-code-line", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-normal text-code-muted",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSubTrigger({
  className,
  inset = false,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        "flex min-h-10 cursor-default items-center gap-2 rounded-md px-2.5 text-sm transition-[background-color,color] duration-150 ease-out outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[inset=true]:pl-8 data-[state=open]:bg-code-quiet motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-code-muted",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden="true" className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  sideOffset = 6,
  collisionPadding = 12,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] max-w-[calc(100vw-2rem)] min-w-36 origin-[var(--radix-dropdown-menu-content-transform-origin)] overflow-y-auto rounded-xl bg-code-surface-raised p-1.5 text-sm text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_30%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.64)]",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
