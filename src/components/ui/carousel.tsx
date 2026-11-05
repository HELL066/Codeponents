import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

type CarouselApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>
type CarouselOrientation = "horizontal" | "vertical"

type CarouselContextValue = {
  viewportRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi | undefined
  orientation: CarouselOrientation
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  selectedIndex: number
  scrollSnaps: number[]
  scrollTo: (index: number) => void
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("Carousel components must be nested inside <Carousel />")
  }
  return context
}

export type CarouselProps = React.ComponentProps<"div"> & {
  orientation?: CarouselOrientation
  opts?: Parameters<typeof useEmblaCarousel>[0]
  plugins?: Parameters<typeof useEmblaCarousel>[1]
  setApi?: (api: CarouselApi) => void
  "aria-label": string
}

function Carousel({
  orientation = "horizontal",
  opts,
  plugins,
  setApi,
  "aria-label": ariaLabel,
  tabIndex = 0,
  className,
  children,
  onKeyDown,
  ...props
}: CarouselProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const resolvedOpts = React.useMemo(() => {
    return {
      ...opts,
      duration: prefersReducedMotion ? 0 : (opts?.duration ?? 25),
      axis: orientation === "horizontal" ? ("x" as const) : ("y" as const),
    }
  }, [opts, orientation, prefersReducedMotion])

  const [viewportRef, api] = useEmblaCarousel(resolvedOpts, plugins)
  const [, refreshControls] = React.useReducer(
    (version: number) => version + 1,
    0
  )
  const selectedIndex = api?.selectedScrollSnap() ?? 0
  const scrollSnaps = React.useMemo(() => api?.scrollSnapList() ?? [], [api])

  const updateControls = React.useCallback(() => {
    refreshControls()
  }, [])

  React.useEffect(() => {
    if (!api) return
    api.on("select", updateControls)
    api.on("reInit", updateControls)
    setApi?.(api)
    return () => {
      api.off("select", updateControls)
      api.off("reInit", updateControls)
    }
  }, [api, setApi, updateControls])

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api])
  const scrollTo = React.useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  )
  const canScrollPrev = api?.canScrollPrev() ?? false
  const canScrollNext = api?.canScrollNext() ?? false

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const target = event.target
    const isCarouselControl =
      target instanceof HTMLElement &&
      target.closest("[data-carousel-control]") !== null
    if (event.target !== event.currentTarget && !isCarouselControl) return
    if (orientation === "horizontal" && event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    }
    if (orientation === "horizontal" && event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
    if (orientation === "vertical" && event.key === "ArrowUp") {
      event.preventDefault()
      scrollPrev()
    }
    if (orientation === "vertical" && event.key === "ArrowDown") {
      event.preventDefault()
      scrollNext()
    }
    if (event.key === "Home") {
      event.preventDefault()
      scrollTo(0)
    }
    if (event.key === "End") {
      event.preventDefault()
      scrollTo(Math.max(0, scrollSnaps.length - 1))
    }
  }

  const contextValue = React.useMemo<CarouselContextValue>(
    () => ({
      viewportRef,
      api,
      orientation,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      selectedIndex,
      scrollSnaps,
      scrollTo,
    }),
    [
      viewportRef,
      api,
      orientation,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      selectedIndex,
      scrollSnaps,
      scrollTo,
    ]
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        className={cn(
          "relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-code-accent",
          className
        )}
        onKeyDown={handleKeyDown}
        role="region"
        tabIndex={tabIndex}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { viewportRef, orientation } = useCarousel()
  return (
    <div
      className={cn(
        "overflow-hidden",
        orientation === "horizontal" ? "touch-pan-y" : "touch-pan-x"
      )}
      ref={viewportRef}
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()
  return (
    <div
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      role="group"
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  disabled = false,
  onClick,
  type = "button",
  "aria-label": ariaLabel = "Previous slide",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, canScrollPrev, scrollPrev } = useCarousel()
  const Icon = orientation === "horizontal" ? ChevronLeft : ChevronUp
  return (
    <Button
      {...props}
      aria-label={ariaLabel}
      data-carousel-control=""
      className={cn(
        "size-11 rounded-md border-0 bg-transparent text-code-muted shadow-none transition-[background-color,color,transform] hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent focus-visible:ring-offset-2 focus-visible:ring-offset-code-surface active:scale-[0.96] disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100",
        className
      )}
      disabled={disabled || !canScrollPrev}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) scrollPrev()
      }}
      size={size}
      type={type}
      variant={variant}
    >
      <Icon aria-hidden="true" className="size-4" />
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  disabled = false,
  onClick,
  type = "button",
  "aria-label": ariaLabel = "Next slide",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, canScrollNext, scrollNext } = useCarousel()
  const Icon = orientation === "horizontal" ? ChevronRight : ChevronDown
  return (
    <Button
      {...props}
      aria-label={ariaLabel}
      data-carousel-control=""
      className={cn(
        "size-11 rounded-md border-0 bg-transparent text-code-muted shadow-none transition-[background-color,color,transform] hover:bg-code-quiet hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent focus-visible:ring-offset-2 focus-visible:ring-offset-code-surface active:scale-[0.96] disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100",
        className
      )}
      disabled={disabled || !canScrollNext}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) scrollNext()
      }}
      size={size}
      type={type}
      variant={variant}
    >
      <Icon aria-hidden="true" className="size-4" />
    </Button>
  )
}

function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()
  if (scrollSnaps.length <= 1) return null

  return (
    <div
      role="group"
      aria-label="Choose a slide"
      className={cn("flex items-center justify-center gap-1 py-1", className)}
      {...props}
    >
      {scrollSnaps.map((_, index) => {
        const isSelected = index === selectedIndex
        return (
          <button
            key={index}
            type="button"
            aria-current={isSelected ? "true" : undefined}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "group flex size-11 items-center justify-center rounded-full transition-colors outline-none hover:bg-code-quiet focus-visible:ring-2 focus-visible:ring-code-accent focus-visible:ring-offset-1 focus-visible:ring-offset-code-surface motion-reduce:transition-none",
              isSelected && "text-code-ink"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-200 motion-reduce:transition-none",
                isSelected
                  ? "w-4 bg-code-ink"
                  : "w-1.5 bg-code-line/80 group-hover:bg-code-muted"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export {
  type CarouselApi,
  useCarousel,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
}
