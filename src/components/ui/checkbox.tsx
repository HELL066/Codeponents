import * as React from "react"
import { Check, Minus } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-code-line bg-code-surface text-code-accent-foreground transition-[background-color,border-color,box-shadow] outline-none hover:border-code-accent/70 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-code-danger aria-invalid:ring-3 aria-invalid:ring-code-danger/15 data-[state=checked]:border-code-accent data-[state=checked]:bg-code-accent data-[state=indeterminate]:border-code-accent data-[state=indeterminate]:bg-code-accent",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="inline-flex items-center justify-center">
        {props.checked === "indeterminate" ? (
          <Minus aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
        ) : (
          <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
