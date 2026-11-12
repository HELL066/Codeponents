import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.ComponentProps<
  typeof SliderPrimitive.Root
> {
  /** Accessible names for each thumb; one label is sufficient for a single-value slider. */
  thumbLabels?: string | string[]
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  orientation = "horizontal",
  thumbLabels,
  "aria-label": ariaLabel,
  onPointerDownCapture,
  onPointerUpCapture,
  onPointerCancelCapture,
  onLostPointerCapture,
  ...props
}: SliderProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const values = value ?? defaultValue ?? [min]
  const labels = Array.isArray(thumbLabels)
    ? thumbLabels
    : thumbLabels
      ? [thumbLabels]
      : []

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      orientation={orientation}
      aria-label={ariaLabel}
      data-dragging={isDragging ? "true" : undefined}
      onPointerDownCapture={(event) => {
        onPointerDownCapture?.(event)
        setIsDragging(true)
      }}
      onPointerUpCapture={(event) => {
        onPointerUpCapture?.(event)
        setIsDragging(false)
      }}
      onPointerCancelCapture={(event) => {
        onPointerCancelCapture?.(event)
        setIsDragging(false)
      }}
      onLostPointerCapture={(event) => {
        onLostPointerCapture?.(event)
        setIsDragging(false)
      }}
      className={cn(
        "group/slider relative flex min-h-10 w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-32 data-[orientation=vertical]:w-auto data-[orientation=vertical]:min-w-10 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-code-quiet/80 transition-colors duration-150 group-focus-within/slider:bg-code-quiet motion-reduce:transition-none",
          orientation === "vertical" ? "h-full w-1.5" : "h-1.5 w-full"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute h-full bg-code-accent ease-[cubic-bezier(0.22,1,0.36,1)] data-[orientation=vertical]:w-full motion-reduce:transition-none",
            isDragging
              ? "transition-none"
              : "transition-[width,left,bottom,height] duration-240"
          )}
        />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          aria-label={
            labels[index] ??
            (values.length === 1
              ? ariaLabel
              : ariaLabel
                ? values.length === 2
                  ? `${ariaLabel} ${index === 0 ? "minimum" : "maximum"}`
                  : `${ariaLabel} ${index + 1}`
                : undefined)
          }
          className={cn(
            "group/slider-thumb relative grid size-[18px] shrink-0 cursor-grab place-items-center rounded-full bg-transparent outline-none before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:content-[''] active:cursor-grabbing disabled:pointer-events-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed",
            isDragging
              ? "transition-none"
              : "transition-[left,top] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          )}
        >
          <span
            aria-hidden="true"
            className="absolute size-8 scale-75 rounded-full bg-code-accent-soft opacity-0 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/slider-thumb:scale-100 group-hover/slider-thumb:opacity-70 group-focus-visible/slider-thumb:scale-100 group-focus-visible/slider-thumb:opacity-100 group-active/slider-thumb:scale-110 group-active/slider-thumb:opacity-100 motion-reduce:transition-none motion-reduce:group-hover/slider-thumb:scale-100 motion-reduce:group-active/slider-thumb:scale-100"
          />
          <span
            aria-hidden="true"
            className="relative grid size-[18px] place-items-center rounded-full bg-code-surface shadow-[0_1px_3px_color-mix(in_srgb,var(--code-ink)_24%,transparent)] ring-1 ring-code-accent/35 transition-[box-shadow,transform] duration-150 ease-out group-hover/slider-thumb:scale-105 group-hover/slider-thumb:shadow-[0_3px_8px_-2px_color-mix(in_srgb,var(--code-ink)_30%,transparent)] group-focus-visible/slider-thumb:ring-2 group-focus-visible/slider-thumb:ring-code-ring group-active/slider-thumb:scale-[0.96] group-active/slider-thumb:shadow-[0_0_0_4px_color-mix(in_srgb,var(--code-accent)_16%,transparent)] motion-reduce:transition-none motion-reduce:group-hover/slider-thumb:scale-100 motion-reduce:group-active/slider-thumb:scale-100"
          >
            <span className="size-1.5 rounded-full bg-code-accent transition-[transform,background-color] duration-150 ease-out group-active/slider-thumb:scale-75 motion-reduce:transition-none motion-reduce:group-active/slider-thumb:scale-100" />
          </span>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
