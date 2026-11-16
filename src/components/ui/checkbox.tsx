import * as React from "react"
import { Minus } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const checkSpring = {
  type: "spring",
  stiffness: 620,
  damping: 34,
  mass: 0.6,
} as const

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const reduceMotion = useReducedMotion()
  const isIndeterminate =
    (props.checked ?? props.defaultChecked) === "indeterminate"

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-code-line bg-code-surface text-code-accent-foreground transition-[background-color,border-color,box-shadow,transform] duration-150 outline-none hover:border-code-accent/70 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 active:scale-[0.88] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-code-danger aria-invalid:ring-3 aria-invalid:ring-code-danger/15 data-[state=checked]:border-code-accent data-[state=checked]:bg-code-accent data-[state=indeterminate]:border-code-accent data-[state=indeterminate]:bg-code-accent motion-reduce:transition-none motion-reduce:active:scale-100",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="inline-flex items-center justify-center">
        {isIndeterminate ? (
          <motion.span
            aria-hidden="true"
            animate={{ opacity: 1, scaleX: 1 }}
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.35 }}
            transition={reduceMotion ? { duration: 0 } : checkSpring}
          >
            <Minus className="size-3.5" strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.svg
            aria-hidden="true"
            className="size-3.5"
            fill="none"
            initial={
              reduceMotion ? false : { opacity: 0, rotate: -9, scale: 0.65 }
            }
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : checkSpring}
            viewBox="0 0 16 16"
          >
            <motion.path
              d="m3.25 8.2 2.7 2.65 6.8-6.25"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
              }
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.3}
            />
          </motion.svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
