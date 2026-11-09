import * as React from "react"
import { X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close

export interface SheetContentProps extends React.ComponentProps<
  typeof DialogPrimitive.Content
> {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}

const sideClasses = {
  top: "inset-x-0 top-0 max-h-[min(82dvh,48rem)] w-full rounded-b-xl pt-[calc(1.25rem+env(safe-area-inset-top))] shadow-[0_16px_40px_-24px_color-mix(in_srgb,var(--code-ink)_30%,transparent)] dark:shadow-none data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-top-full motion-reduce:data-[state=closed]:translate-y-0",
  right:
    "inset-y-0 right-0 h-dvh w-[min(30rem,calc(100vw-1.5rem))] rounded-l-xl pt-[calc(1.25rem+env(safe-area-inset-top))] pr-[calc(1.25rem+env(safe-area-inset-right))] pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[-16px_0_40px_-24px_color-mix(in_srgb,var(--code-ink)_30%,transparent)] dark:shadow-none data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full motion-reduce:data-[state=closed]:translate-x-0",
  bottom:
    "inset-x-0 bottom-0 max-h-[min(82dvh,48rem)] w-full rounded-t-xl pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_-24px_color-mix(in_srgb,var(--code-ink)_30%,transparent)] dark:shadow-none data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full motion-reduce:data-[state=closed]:translate-y-0",
  left: "inset-y-0 left-0 h-dvh w-[min(30rem,calc(100vw-1.5rem))] rounded-r-xl pt-[calc(1.25rem+env(safe-area-inset-top))] pl-[calc(1.25rem+env(safe-area-inset-left))] pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[16px_0_40px_-24px_color-mix(in_srgb,var(--code-ink)_30%,transparent)] dark:shadow-none data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full motion-reduce:data-[state=closed]:translate-x-0",
} satisfies Record<NonNullable<SheetContentProps["side"]>, string>

function SheetContent({
  side = "right",
  className,
  children,
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-4 overflow-y-auto overscroll-contain bg-code-surface p-5 text-code-ink ease-[cubic-bezier(0.16,1,0.3,1)] outline-none data-[state=closed]:animate-out data-[state=closed]:duration-[180ms] data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-[260ms] data-[state=open]:fade-in-0 motion-reduce:animate-none dark:ring-1 dark:ring-code-line/55",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            aria-label="Close panel"
            className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-lg text-code-muted transition-[color,background-color,transform,scale] duration-150 outline-none hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent/35 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <X aria-hidden="true" className="size-4" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("grid gap-1.5", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "pr-10 [font-family:var(--font-heading)] text-code-compact leading-6 font-normal text-balance",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm leading-6 text-code-muted", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
