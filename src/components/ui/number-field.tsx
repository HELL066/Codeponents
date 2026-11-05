import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { TextMorph } from "torph/react"
import { cn } from "@/lib/utils"

export interface NumberFieldProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> {
  value?: number | string | null
  defaultValue?: number | string
  onValueChange?: (value: number | undefined) => void
  step?: number | "any"
}

function parseFiniteNumber(value: number | string | undefined) {
  if (value === undefined || value === "") return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function decimalPlaces(value: number) {
  const [coefficient, exponentText] = String(value).toLowerCase().split("e")
  const fractionLength = coefficient?.split(".")[1]?.length ?? 0
  const exponent = Number(exponentText ?? 0)

  return Math.min(10, Math.max(0, fractionLength - exponent))
}

function NumberField({
  className,
  id,
  value,
  defaultValue,
  onValueChange,
  onBlur,
  "aria-invalid": ariaInvalid,
  min,
  max,
  step = 1,
  disabled,
  readOnly,
  ...props
}: NumberFieldProps) {
  const inputId = React.useId()
  const resolvedId = id ?? inputId
  const inputRef = React.useRef<HTMLInputElement>(null)
  const animationTimeoutRef = React.useRef<number | undefined>(undefined)
  const [showStepMorph, setShowStepMorph] = React.useState(false)
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue == null ? "" : String(defaultValue)
  )
  const [controlledDraft, setControlledDraft] = React.useState(
    value == null ? "" : String(value)
  )
  const [previousControlledValue, setPreviousControlledValue] =
    React.useState(value)
  if (isControlled && value !== previousControlledValue) {
    setPreviousControlledValue(value)
    setControlledDraft(value == null ? "" : String(value))
  }
  const displayValue = isControlled ? controlledDraft : uncontrolledValue
  const minimum = parseFiniteNumber(min)
  const maximum = parseFiniteNumber(max)
  const currentValue = parseFiniteNumber(displayValue)
  const stepAmount =
    step === "any" || !Number.isFinite(step) || step <= 0 ? 1 : step
  const controlName =
    props["aria-label"]?.trim() ||
    props.name?.replace(/[._-]+/g, " ").trim() ||
    "value"
  const isInvalid =
    ariaInvalid === true ||
    ariaInvalid === "true" ||
    ariaInvalid === "grammar" ||
    ariaInvalid === "spelling"
  const stepBase = currentValue ?? minimum ?? 0
  const lowerLimitReached = minimum !== undefined && stepBase <= minimum
  const upperLimitReached =
    maximum !== undefined &&
    currentValue !== undefined &&
    currentValue >= maximum

  const commit = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) setUncontrolledValue(nextValue)
      const parsed = nextValue.trim() === "" ? undefined : Number(nextValue)
      onValueChange?.(
        parsed !== undefined && Number.isFinite(parsed) ? parsed : undefined
      )
    },
    [isControlled, onValueChange, setUncontrolledValue]
  )

  const showSteppedValue = () => {
    setShowStepMorph(true)
    if (animationTimeoutRef.current !== undefined)
      window.clearTimeout(animationTimeoutRef.current)
    animationTimeoutRef.current = window.setTimeout(
      () => setShowStepMorph(false),
      340
    )
  }

  React.useEffect(
    () => () => {
      if (animationTimeoutRef.current !== undefined)
        window.clearTimeout(animationTimeoutRef.current)
    },
    []
  )

  const changeByStep = (direction: -1 | 1) => {
    const input = inputRef.current
    if (!input || disabled || readOnly) return

    const current = input.valueAsNumber
    const hasCurrentValue = Number.isFinite(current)
    const base = hasCurrentValue ? current : (minimum ?? 0)
    let next =
      !hasCurrentValue && direction === 1 && minimum !== undefined
        ? minimum
        : base + stepAmount * direction

    if (minimum !== undefined) next = Math.max(next, minimum)
    if (maximum !== undefined) next = Math.min(next, maximum)

    const precision = Math.max(decimalPlaces(stepAmount), decimalPlaces(next))
    showSteppedValue()
    commit(String(Number(next.toFixed(precision))))
  }

  const handleInputChange = (nextValue: string) => {
    if (isControlled) setControlledDraft(nextValue)
    else setUncontrolledValue(nextValue)

    const parsed = nextValue.trim() === "" ? undefined : Number(nextValue)
    onValueChange?.(
      parsed !== undefined && Number.isFinite(parsed) ? parsed : undefined
    )
  }

  return (
    <div
      data-slot="number-field"
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "group/number-field flex h-11 w-full min-w-0 items-center overflow-hidden rounded-lg border border-code-line/55 bg-code-surface transition-[border-color,box-shadow,background-color] duration-150 focus-within:border-code-accent focus-within:ring-3 focus-within:ring-code-accent/20 hover:border-code-muted/55 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-code-quiet/50 data-[invalid=true]:border-code-danger data-[invalid=true]:focus-within:ring-code-danger/15 motion-reduce:transition-none",
        className
      )}
    >
      <button
        type="button"
        aria-label={`Decrease ${controlName}`}
        aria-controls={resolvedId}
        disabled={disabled || readOnly || lowerLimitReached}
        onClick={() => changeByStep(-1)}
        className="inline-flex size-11 shrink-0 items-center justify-center text-code-muted transition-[background-color,color,transform] duration-150 outline-none hover:bg-code-quiet/65 hover:text-code-ink focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-code-accent focus-visible:ring-inset active:scale-[0.96] active:bg-code-accent-soft active:text-code-accent disabled:cursor-not-allowed disabled:text-code-muted/40 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <Minus aria-hidden="true" className="size-4" strokeWidth={1.8} />
      </button>
      <div
        className="group/number-display relative flex h-full min-w-0 flex-1 items-center"
        data-animating={showStepMorph || undefined}
      >
        <input
          ref={inputRef}
          data-slot="number-field-input"
          id={resolvedId}
          type="number"
          inputMode="decimal"
          value={displayValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={ariaInvalid}
          onChange={(event) => handleInputChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (
              ["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key)
            )
              showSteppedValue()
          }}
          onBlur={onBlur}
          className="h-full min-w-0 flex-1 appearance-none border-0 bg-transparent px-2 text-center text-sm font-medium text-code-ink tabular-nums outline-none [-moz-appearance:textfield] group-data-[animating=true]/number-display:text-transparent placeholder:text-code-muted/75 group-data-[animating=true]/number-display:placeholder:text-transparent read-only:cursor-text disabled:cursor-not-allowed disabled:text-code-muted [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...props}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-sm font-medium text-code-ink tabular-nums opacity-0 transition-opacity duration-100 group-data-[animating=true]/number-display:opacity-100 motion-reduce:transition-none"
        >
          <TextMorph
            as="span"
            duration={300}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            numbers
            respectReducedMotion
          >
            {displayValue || "0"}
          </TextMorph>
        </span>
      </div>
      <button
        type="button"
        aria-label={`Increase ${controlName}`}
        aria-controls={resolvedId}
        disabled={disabled || readOnly || upperLimitReached}
        onClick={() => changeByStep(1)}
        className="inline-flex size-11 shrink-0 items-center justify-center text-code-muted transition-[background-color,color,transform] duration-150 outline-none hover:bg-code-quiet/65 hover:text-code-ink focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-code-accent focus-visible:ring-inset active:scale-[0.96] active:bg-code-accent-soft active:text-code-accent disabled:cursor-not-allowed disabled:text-code-muted/40 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <Plus aria-hidden="true" className="size-4" strokeWidth={1.8} />
      </button>
    </div>
  )
}

export { NumberField }
