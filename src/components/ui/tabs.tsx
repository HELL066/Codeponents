import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("inline-flex w-fit items-center gap-5", className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex min-h-10 items-center justify-center px-0.5 text-sm text-code-muted transition-colors outline-none after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-center after:scale-x-0 after:bg-code-accent after:transition-transform after:duration-200 hover:text-code-ink focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-code-accent/35 disabled:pointer-events-none disabled:opacity-45 data-[state=active]:text-code-ink data-[state=active]:after:scale-x-100 motion-reduce:transition-none motion-reduce:after:transition-none",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "min-w-0 pt-4 outline-none focus-visible:ring-2 focus-visible:ring-code-accent/35",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
