import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

export type SwitchAnimation = "smooth" | "bouncy"

type SwitchThemeIcon = { value: string; icon: React.ReactNode }

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /** Controls how the thumb travels between states. */
  animation?: SwitchAnimation
}

export const switchRootClassName =
  "group peer relative inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-[scale] duration-150 outline-none focus-visible:ring-3 focus-visible:ring-code-ring/40 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-code-danger/20 motion-reduce:transition-none motion-reduce:active:scale-100"

export function SwitchTrack({
  checked,
  animation,
  themes,
}: {
  checked: boolean
  animation: SwitchAnimation
  themes?: readonly [SwitchThemeIcon, SwitchThemeIcon]
}) {
  const reduceMotion = useReducedMotion() ?? false
  const selectedTheme = themes?.[checked ? 1 : 0]
  const travel = 20
  const slideTransition = reduceMotion
    ? { duration: 0 }
    : animation === "bouncy"
      ? { type: "spring" as const, duration: 0.48, bounce: 0.48 }
      : { type: "spring" as const, duration: 0.32, bounce: 0 }

  return (
    <span
      aria-hidden="true"
      className="relative block h-7 w-12 shrink-0 overflow-hidden rounded-full bg-code-line transition-[background-color,box-shadow] duration-200 ease-out group-data-[state=checked]:bg-code-accent motion-reduce:transition-none"
      data-slot="switch-track"
      data-state={checked ? "checked" : "unchecked"}
    >
      <motion.span
        animate={{ x: checked ? travel : 0 }}
        className="absolute top-1 left-1 z-10 grid size-5 place-items-center rounded-full bg-code-surface text-code-accent shadow-[0_2px_5px_color-mix(in_srgb,var(--code-ink)_18%,transparent)]"
        data-slot="switch-thumb"
        initial={false}
        transition={slideTransition}
      >
        {selectedTheme ? (
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={selectedTheme.value}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              className="grid size-3 place-items-center [&_svg]:size-3"
              data-theme-icon={selectedTheme.value}
              exit={{ opacity: 0, filter: "blur(4px)", scale: 0.25 }}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, filter: "blur(4px)", scale: 0.25 }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.3, bounce: 0 }
              }
            >
              {selectedTheme.icon}
            </motion.span>
          </AnimatePresence>
        ) : null}
      </motion.span>
    </span>
  )
}

function Switch({ animation = "smooth", className, ...props }: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
    () => props.defaultChecked ?? false
  )
  const checked = props.checked ?? uncontrolledChecked

  const handleCheckedChange = (nextChecked: boolean) => {
    if (props.checked === undefined) setUncontrolledChecked(nextChecked)
    props.onCheckedChange?.(nextChecked)
  }

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchRootClassName, "w-12", className)}
      {...props}
      onCheckedChange={handleCheckedChange}
    >
      <SwitchTrack checked={checked} animation={animation} />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
