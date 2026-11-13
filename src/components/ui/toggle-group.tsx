import * as React from "react"
import { LayoutGroup, motion, useReducedMotion } from "motion/react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

type ToggleGroupContextValue = {
  type: "single" | "multiple"
  orientation: "horizontal" | "vertical"
  selectedValues: readonly string[]
  layoutId: string
  reduceMotion: boolean
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null
)

function ToggleGroup(
  props: React.ComponentProps<typeof ToggleGroupPrimitive.Root>
) {
  const { className, ...rootProps } = props
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | string[] | undefined
  >(() => props.defaultValue)
  const currentValue = props.value ?? uncontrolledValue
  const selectedValues = Array.isArray(currentValue)
    ? currentValue
    : currentValue === undefined
      ? []
      : [currentValue]
  const reduceMotion = useReducedMotion() ?? false
  const layoutId = React.useId()

  const handleValueChange = (nextValue: string | string[]) => {
    if (props.value === undefined) setUncontrolledValue(nextValue)

    if (props.type === "multiple") {
      props.onValueChange?.(Array.isArray(nextValue) ? nextValue : [nextValue])
    } else {
      props.onValueChange?.(
        Array.isArray(nextValue) ? (nextValue[0] ?? "") : nextValue
      )
    }
  }

  return (
    <LayoutGroup id={layoutId}>
      <ToggleGroupContext.Provider
        value={{
          type: props.type,
          orientation: props.orientation ?? "horizontal",
          selectedValues,
          layoutId: `${layoutId}-selection`,
          reduceMotion,
        }}
      >
        <ToggleGroupPrimitive.Root
          data-slot="toggle-group"
          className={cn(
            "inline-flex w-fit max-w-full flex-wrap items-center gap-1 rounded-lg bg-code-quiet/70 p-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:flex-nowrap",
            className
          )}
          {...rootProps}
          onValueChange={handleValueChange}
        />
      </ToggleGroupContext.Provider>
    </LayoutGroup>
  )
}

function ToggleGroupItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const group = React.useContext(ToggleGroupContext)
  const isSelected = group?.selectedValues.includes(value) ?? false
  const usesSharedIndicator =
    group?.type === "single" &&
    group.orientation === "horizontal" &&
    !props.asChild

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      value={value}
      className={cn(
        "relative isolate inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-code-muted transition-[background-color,color,scale] duration-150 ease-out outline-none hover:bg-code-surface/60 hover:text-code-ink focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-code-ring/40 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        usesSharedIndicator
          ? "data-[state=on]:font-semibold data-[state=on]:text-code-ink"
          : "data-[state=on]:bg-code-surface data-[state=on]:font-semibold data-[state=on]:text-code-ink",
        className
      )}
      {...props}
    >
      {usesSharedIndicator && isSelected && group ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-md bg-code-surface shadow-[0_1px_3px_color-mix(in_srgb,var(--code-ink)_12%,transparent)]"
          data-slot="toggle-group-indicator"
          layoutId={group.reduceMotion ? undefined : group.layoutId}
          transition={
            group.reduceMotion
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
        >
          <span
            className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-code-accent/70"
            data-slot="toggle-group-underline"
          />
        </motion.span>
      ) : null}
      {props.asChild ? (
        children
      ) : (
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      )}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
