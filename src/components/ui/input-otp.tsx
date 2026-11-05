import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  "aria-label": string
}

function InputOTP({
  className,
  containerClassName,
  ...props
}: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
}: {
  index: number
  className?: string
}) {
  const input = React.useContext(OTPInputContext)
  const slot = input.slots[index]
  if (!slot) return null

  const { char, hasFakeCaret, isActive } = slot
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      className={cn(
        "relative grid size-11 place-items-center border-y border-r border-code-line bg-code-surface text-base font-medium tabular-nums text-code-ink first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 border-code-accent ring-2 ring-code-accent/25",
        className
      )}
    >
      {char}
      {hasFakeCaret ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid place-items-center"
        >
          <span className="h-5 w-px bg-code-ink" />
        </span>
      ) : null}
    </div>
  )
}

function InputOTPSeparator({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-slot="input-otp-separator"
      className={cn("text-code-muted", className)}
    >
      <Minus className="size-3" />
    </span>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
