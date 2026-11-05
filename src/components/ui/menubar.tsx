import * as React from "react"
import { Check, ChevronDown, ChevronRight, Circle } from "lucide-react"
import { Menubar as MenubarPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const MenubarMenu = MenubarPrimitive.Menu
const MenubarPortal = MenubarPrimitive.Portal
const MenubarGroup = MenubarPrimitive.Group
const MenubarRadioGroup = MenubarPrimitive.RadioGroup
const MenubarSub = MenubarPrimitive.Sub

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "inline-flex min-h-11 items-center gap-1 rounded-lg bg-code-surface p-1 text-code-ink",
        className
      )}
      {...props}
    />
  )
}

function MenubarTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-code-muted transition-[background-color,color] duration-150 outline-none hover:bg-code-quiet hover:text-code-ink focus:bg-code-quiet focus:text-code-ink focus-visible:ring-2 focus-visible:ring-code-ring/50 data-[state=open]:bg-code-quiet data-[state=open]:text-code-ink motion-reduce:transition-none [&_svg]:size-3.5 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown aria-hidden="true" />
    </MenubarPrimitive.Trigger>
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-[var(--radix-menubar-content-available-height)] max-w-[calc(100vw-1.5rem)] min-w-40 origin-[var(--radix-menubar-content-transform-origin)] overflow-y-auto overscroll-contain rounded-xl bg-code-surface-raised p-1.5 text-sm text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_30%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-none dark:ring-1 dark:ring-code-line/55",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

function MenubarItem({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset || undefined}
      className={cn(
        "relative flex min-h-10 cursor-default items-center gap-2 rounded-md px-2.5 text-sm transition-[background-color,color] duration-150 outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[inset=true]:pl-8 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-code-muted",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex min-h-10 cursor-default items-center gap-2 rounded-md py-1 pr-2.5 pl-8 text-sm transition-[background-color,color] duration-150 outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-45 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <span
        className="absolute left-2 flex size-4 items-center justify-center text-code-accent"
        aria-hidden="true"
      >
        <MenubarPrimitive.ItemIndicator>
          <Check className="size-3.5" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex min-h-10 cursor-default items-center gap-2 rounded-md py-1 pr-2.5 pl-8 text-sm transition-[background-color,color] duration-150 outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-45 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <span
        className="absolute left-2 flex size-4 items-center justify-center text-code-accent"
        aria-hidden="true"
      >
        <MenubarPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current stroke-[3px]" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset = false,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset || undefined}
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-code-muted data-[inset=true]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-code-line", className)}
      {...props}
    />
  )
}

function MenubarSubTrigger({
  className,
  inset = false,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        "flex min-h-10 cursor-default items-center gap-2 rounded-md px-2.5 text-sm transition-[background-color,color] duration-150 outline-none select-none focus:bg-code-quiet focus:text-code-ink data-[inset=true]:pl-8 data-[state=open]:bg-code-quiet motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-code-muted",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden="true" className="ml-auto" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent
        data-slot="menubar-sub-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-[var(--radix-menubar-content-available-height)] max-w-[calc(100vw-1.5rem)] min-w-36 origin-[var(--radix-menubar-content-transform-origin)] overflow-y-auto overscroll-contain rounded-xl bg-code-surface-raised p-1.5 text-sm text-code-ink shadow-[0_12px_32px_-16px_color-mix(in_srgb,var(--code-ink)_30%,transparent),0_2px_6px_-4px_color-mix(in_srgb,var(--code-ink)_18%,transparent)] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none dark:shadow-none dark:ring-1 dark:ring-code-line/55",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
