import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const Drawer = DialogPrimitive.Root
const DrawerTrigger = SheetTrigger
const DrawerClose = SheetClose

type DrawerContentProps = Omit<SheetContentProps, "side"> & {
  side?: "bottom" | "top"
}

function DrawerContent({
  side = "bottom",
  className,
  ...props
}: DrawerContentProps) {
  return (
    <SheetContent
      data-slot="drawer-content"
      side={side}
      className={cn(
        side === "top"
          ? "rounded-b-xl px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-5 sm:px-6"
          : "rounded-t-xl px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6",
        className
      )}
      {...props}
    />
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <SheetHeader
      data-slot="drawer-header"
      className={cn("mx-auto w-full max-w-xl", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <SheetFooter
      data-slot="drawer-footer"
      className={cn("mx-auto w-full max-w-xl", className)}
      {...props}
    />
  )
}

const DrawerTitle = SheetTitle
const DrawerDescription = SheetDescription

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
