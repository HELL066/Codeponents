import * as React from "react"
import { Circle } from "lucide-react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(
        "grid min-w-0 gap-3 data-[orientation=horizontal]:flex data-[orientation=horizontal]:flex-wrap data-[orientation=horizontal]:items-center",
        className
      )}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border border-code-line bg-code-surface text-code-accent transition-[border-color,box-shadow,background-color] outline-none hover:border-code-accent/70 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-code-danger aria-invalid:ring-3 aria-invalid:ring-code-danger/15 data-[state=checked]:border-code-accent",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle
          aria-hidden="true"
          className="size-2 fill-current"
          strokeWidth={0}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
