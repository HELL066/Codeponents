import * as React from "react"
import { ChevronDown } from "lucide-react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const NavigationMenuSub = NavigationMenuPrimitive.Sub

function NavigationMenu({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "relative z-10 flex max-w-max items-center justify-center",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "group inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-code-ink transition-[background-color,color] outline-none hover:bg-code-quiet focus:bg-code-quiet focus-visible:ring-2 focus-visible:ring-code-accent/30 data-[state=open]:bg-code-quiet data-[state=open]:text-code-ink motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="size-3.5 text-code-muted transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "absolute top-0 left-0 w-full origin-top rounded-lg bg-code-surface p-2 text-code-ink duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-[motion=from-end]:animate-in data-[motion=from-end]:fade-in-0 data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:animate-in data-[motion=from-start]:fade-in-0 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:animate-out data-[motion=to-end]:duration-100 data-[motion=to-end]:fade-out-0 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:animate-out data-[motion=to-start]:duration-100 data-[motion=to-start]:fade-out-0 data-[motion=to-start]:slide-out-to-left-2 motion-reduce:animate-none md:w-auto",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "block rounded-md px-3 py-2 text-sm text-code-ink transition-colors outline-none hover:bg-code-quiet focus:bg-code-quiet focus-visible:ring-2 focus-visible:ring-code-accent/30 data-[active]:bg-code-accent-soft data-[active]:font-medium motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-10 flex h-1 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      <span className="relative h-0.5 w-7 rounded-full bg-code-accent" />
    </NavigationMenuPrimitive.Indicator>
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-0 flex w-full justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden rounded-xl bg-code-surface text-code-ink shadow-[0_12px_32px_-20px_color-mix(in_srgb,var(--code-ink)_35%,transparent)] transition-[width,height] duration-200 motion-reduce:transition-none md:w-[var(--radix-navigation-menu-viewport-width)] dark:shadow-[0_12px_32px_-20px_rgba(0,0,0,0.6)] dark:ring-1 dark:ring-code-line/55",
          className
        )}
        {...props}
      />
    </div>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuSub,
  NavigationMenuTrigger,
  NavigationMenuViewport,
}
