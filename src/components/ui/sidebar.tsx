import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

function Sidebar({ className, ...props }: ComponentProps<"aside">) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex h-full min-h-0 w-64 shrink-0 flex-col bg-code-hero text-white",
        className
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex min-h-16 items-center px-5", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("min-h-0 flex-1 overflow-y-auto px-3 pb-4", className)}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      data-slot="sidebar-group"
      className={cn("mb-5 last:mb-0", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      data-slot="sidebar-group-label"
      className={cn("mb-2 px-3 text-xs font-medium text-white/65", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("m-0 grid list-none gap-1 p-0", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={className} {...props} />
}

interface SidebarMenuButtonProps extends ComponentProps<"a"> {
  isActive?: boolean
}

function SidebarMenuButton({
  isActive = false,
  className,
  ...props
}: SidebarMenuButtonProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-active={isActive ? "true" : undefined}
      data-slot="sidebar-menu-button"
      className={cn(
        "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm text-white/80 transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white data-[active=true]:bg-white/10 data-[active=true]:font-medium data-[active=true]:text-white motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto border-t border-white/15 px-4 py-3", className)}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
}
