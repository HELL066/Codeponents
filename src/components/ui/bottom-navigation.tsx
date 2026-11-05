import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { LayoutGroup, motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export interface BottomNavigationItem {
  value: string
  label: string
  icon?: LucideIcon
}

export interface BottomNavigationProps extends React.ComponentProps<"nav"> {
  /** The visible choices in the navigation bar. Values must be unique. */
  items: readonly BottomNavigationItem[]
  /** The accessible name for this navigation landmark. */
  label: string
  /** The currently selected page or view. */
  value: string
  /** Called when a different page or view is selected. */
  onValueChange: (value: string) => void
}

function BottomNavigation({
  items,
  label,
  value,
  onValueChange,
  className,
  ...props
}: BottomNavigationProps) {
  const reduceMotion = useReducedMotion() ?? false
  const layoutId = React.useId()

  if (items.length === 0) return null

  return (
    <nav
      {...props}
      aria-label={label}
      className={cn(
        "relative isolate w-full bg-code-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_20px_-14px_color-mix(in_srgb,var(--code-hero)_24%,transparent)]",
        className
      )}
      data-slot="bottom-navigation"
    >
      <LayoutGroup id={layoutId}>
        <div
          className="grid min-w-0"
          style={{
            gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          }}
        >
          {items.map(({ value: itemValue, label: itemLabel, icon: Icon }) => {
            const active = value === itemValue

            return (
              <motion.button
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 min-w-0 items-center justify-center gap-2 rounded-lg px-2 pt-1 pb-2 text-[13px] leading-5 font-medium transition-colors duration-150 outline-none hover:bg-code-canvas/60 hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-ring/55 focus-visible:ring-inset motion-reduce:transition-none",
                  active ? "font-semibold text-code-accent" : "text-code-muted"
                )}
                key={itemValue}
                onClick={() => onValueChange(itemValue)}
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                transition={{
                  type: "spring",
                  stiffness: 440,
                  damping: 30,
                  bounce: 0.14,
                }}
              >
                {Icon ? (
                  <Icon aria-hidden="true" className="shrink-0" size={16} />
                ) : null}
                <span className="truncate">{itemLabel}</span>
                {active ? (
                  <motion.span
                    aria-hidden="true"
                    className="absolute bottom-1.5 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-code-accent"
                    layoutId={`${layoutId}-indicator`}
                    transition={
                      reduceMotion
                        ? { layout: { duration: 0 } }
                        : {
                            layout: {
                              type: "spring",
                              stiffness: 520,
                              damping: 30,
                              mass: 0.72,
                              bounce: 0.18,
                            },
                          }
                    }
                  />
                ) : null}
              </motion.button>
            )
          })}
        </div>
      </LayoutGroup>
    </nav>
  )
}

export { BottomNavigation }
