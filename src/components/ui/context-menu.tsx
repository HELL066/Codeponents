import * as React from "react"
import { Check, ChevronRight, Circle } from "lucide-react"
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup
const ContextMenuSub = ContextMenuPrimitive.Sub

function ContextMenuContent({
  className,
  sideOffset = 4,
  collisionPadding = 12,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-50 max-h-[var(--radix-context-menu-content-available-height)] max-w-[calc(100vw-2rem)] min-w-40 origin-[var(--radix-context-menu-content-transform-origin)] overflow-y-auto rounded-xl bg-code-surface-raised p-1.5 text-sm text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_30%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.64)]",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuItem({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset || undefined}
      className={cn(
        "relative flex min-h-10 cursor-default items-center gap-2 rounded-md px-2.5 text-sm transition-[background-color,color,opacity] duration-150 ease-out outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[inset=true]:pl-8 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-code-muted",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
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
        <ContextMenuPrimitive.ItemIndicator>
          <Check className="size-3.5" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
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
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current stroke-[3px]" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuLabel({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-code-muted data-[inset=true]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-code-line", className)}
      {...props}
    />
  )
}

function ContextMenuSubTrigger({
  className,
  inset = false,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        "flex min-h-10 cursor-default items-center gap-2 rounded-md px-2.5 text-sm transition-[background-color,color] duration-150 ease-out outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[inset=true]:pl-8 data-[state=open]:bg-code-quiet motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-code-muted",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden="true" className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

function ContextMenuSubContent({
  className,
  sideOffset = 4,
  collisionPadding = 12,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        data-slot="context-menu-sub-content"
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "z-50 max-h-[var(--radix-context-menu-content-available-height)] max-w-[calc(100vw-2rem)] min-w-36 origin-[var(--radix-context-menu-content-transform-origin)] overflow-y-auto rounded-xl bg-code-surface-raised p-1.5 text-sm text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_30%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.64)]",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
