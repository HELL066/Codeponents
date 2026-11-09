import * as React from "react"
import { X } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[var(--code-hero)]/40 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-out data-[state=closed]:duration-150 data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-200 data-[state=open]:fade-in-0 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export interface DialogContentProps extends React.ComponentProps<
  typeof DialogPrimitive.Content
> {
  showCloseButton?: boolean
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid max-h-[min(85dvh,48rem)] w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto overscroll-contain rounded-xl bg-code-surface p-6 text-code-ink shadow-[0_18px_60px_-24px_color-mix(in_srgb,var(--code-ink)_34%,transparent),0_2px_8px_-4px_color-mix(in_srgb,var(--code-ink)_16%,transparent)] ease-[cubic-bezier(0.16,1,0.3,1)] outline-none data-[state=closed]:animate-out data-[state=closed]:duration-150 data-[state=closed]:fade-out-0 data-[state=closed]:[--tw-exit-scale:0.99] data-[state=closed]:slide-out-to-bottom-[2px] data-[state=open]:animate-in data-[state=open]:duration-[220ms] data-[state=open]:fade-in-0 data-[state=open]:[--tw-enter-scale:0.985] data-[state=open]:slide-in-from-bottom-1 motion-reduce:animate-none dark:shadow-[0_18px_60px_-24px_rgba(0,0,0,0.62),0_2px_8px_-4px_rgba(0,0,0,0.42)] dark:ring-1 dark:ring-code-line/55",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            aria-label="Close dialog"
            className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-lg text-code-muted transition-[color,background-color,transform,scale] duration-150 outline-none hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-ring/50 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <X aria-hidden="true" className="size-4" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "pr-10 [font-family:var(--font-heading)] text-code-compact leading-6 font-normal tracking-[-0.01em] text-balance",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm leading-6 text-pretty text-code-muted", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
