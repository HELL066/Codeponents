import * as React from "react"
import { cn } from "@/lib/utils"

export interface ColorPickerSwatch {
  value: string
  label?: string
}

export interface ColorPickerProps
  extends Omit<
    React.ComponentProps<"div">,
    "aria-label" | "aria-labelledby" | "defaultValue" | "onChange" | "role" | "value"
  > {
  /** Name announced for the color picker when no visible label is provided. */
  ariaLabel: string
  /** Optional visible label for the picker. */
  label?: string
  /** A six- or three-digit hex value. Use with `onValueChange` for controlled state. */
  value?: string
  /** Initial hex value for uncontrolled state. */
  defaultValue?: string
  /** Called when a valid hex value is chosen or entered. */
  onValueChange?: (value: string) => void
  /** Optional named color choices shown as square swatches. */
  swatches?: readonly ColorPickerSwatch[]
  /** Form field name submitted as a hex value. */
  name?: string
  description?: string
  error?: string
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}

const DEFAULT_COLOR = "#0C315C"
const HEX_PATTERN = /^#?(?:[\da-f]{3}|[\da-f]{6})$/i

function normalizeHex(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!HEX_PATTERN.test(trimmed)) return undefined

  const digits = trimmed.replace(/^#/, "")
  const expanded =
    digits.length === 3
      ? [...digits].map((digit) => digit + digit).join("")
      : digits

  return `#${expanded.toUpperCase()}`
}

function ColorPicker({
  ariaLabel,
  label,
  value,
  defaultValue,
  onValueChange,
  swatches,
  name,
  description,
  error,
  invalid = false,
  disabled = false,
  required = false,
  className,
  ...props
}: ColorPickerProps) {
  const id = React.useId()
  const controlled = value !== undefined
  const initialColor = normalizeHex(defaultValue) ?? DEFAULT_COLOR
  const [uncontrolledColor, setUncontrolledColor] = React.useState(initialColor)
  const color = controlled ? normalizeHex(value) ?? DEFAULT_COLOR : uncontrolledColor
  const [draftState, setDraftState] = React.useState({ color, value: color })
  const draft = draftState.color === color ? draftState.value : color
  const [touched, setTouched] = React.useState(false)

  const draftColor = normalizeHex(draft)
  const currentColor = draftColor ?? color
  const showHexError = touched && !draftColor
  const isInvalid = invalid || Boolean(error) || showHexError
  const errorMessage = error ?? (showHexError ? "Enter a valid hex color." : undefined)
  const accessibleName = label?.trim() || ariaLabel
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = errorMessage ? `${id}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined

  const commitColor = (nextValue: string) => {
    const normalized = normalizeHex(nextValue)
    if (!normalized) return

    if (normalized === currentColor) {
      setDraftState({ color, value: normalized })
      setTouched(false)
      return
    }

    if (!controlled) setUncontrolledColor(normalized)
    setDraftState({ color, value: normalized })
    setTouched(false)
    onValueChange?.(normalized)
  }

  const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextDraft = event.currentTarget.value
    setDraftState({ color, value: nextDraft.toUpperCase() })

    const normalized = normalizeHex(nextDraft)
    const digitCount = nextDraft.replace(/^#/, "").length
    if (normalized && digitCount === 6) commitColor(normalized)
  }

  const normalizedSwatches = (swatches ?? []).flatMap((swatch) => {
    const normalized = normalizeHex(swatch.value)
    return normalized ? [{ ...swatch, value: normalized }] : []
  })

  return (
    <div
      {...props}
      data-slot="color-picker"
      role="group"
      aria-label={accessibleName}
      className={cn("grid min-w-0 gap-2.5", className)}
    >
      {label ? (
        <label
          className="text-sm font-medium text-code-ink"
          htmlFor={`${id}-hex`}
        >
          {label}
        </label>
      ) : null}

      <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        <label
          className={cn(
            "relative grid size-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg border border-code-line/55 bg-code-surface transition-[border-color,box-shadow,opacity] duration-150 hover:border-code-muted/60 has-[:focus-visible]:border-code-accent has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-code-accent/20 motion-reduce:transition-none",
            disabled && "cursor-not-allowed opacity-55",
            isInvalid && "border-code-danger has-[:focus-visible]:ring-code-danger/15",
          )}
        >
          <input
            aria-label={`${accessibleName} color`}
            aria-invalid={isInvalid || undefined}
            className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            disabled={disabled}
            onChange={(event) => commitColor(event.currentTarget.value)}
            type="color"
            value={currentColor}
          />
          <span
            aria-hidden="true"
            className="absolute inset-1 rounded-md border border-black/10 transition-[background-color,transform] duration-150 peer-active:scale-[0.97] peer-focus-visible:ring-2 peer-focus-visible:ring-code-accent/50 dark:border-white/15 motion-reduce:transition-none"
            style={{ backgroundColor: currentColor }}
          />
        </label>

        <input
          id={`${id}-hex`}
          aria-label={`${accessibleName} hex value`}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          autoCapitalize="characters"
          autoComplete="off"
          className={cn(
            "h-10 w-32 min-w-0 rounded-lg border border-code-line/55 bg-code-surface px-3 font-mono text-sm uppercase tracking-normal text-code-ink outline-none transition-[border-color,box-shadow,background-color] placeholder:font-sans placeholder:normal-case placeholder:text-code-muted/75 hover:border-code-muted/55 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:bg-code-quiet disabled:text-code-muted aria-invalid:border-code-danger aria-invalid:focus-visible:ring-code-danger/15 motion-reduce:transition-none",
            !label && "sm:w-36",
          )}
          disabled={disabled}
          inputMode="text"
          maxLength={7}
          name={name}
          onBlur={() => {
            const normalized = normalizeHex(draft)
            if (normalized) commitColor(normalized)
            else setTouched(true)
          }}
          onChange={handleHexChange}
          pattern="#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})"
          placeholder="#0C315C"
          required={required}
          spellCheck={false}
          value={draft}
        />

        {normalizedSwatches.length > 0 ? (
          <div
            aria-label={`${accessibleName} suggested colors`}
            className="flex min-w-0 flex-wrap items-center gap-1"
            role="group"
          >
            {normalizedSwatches.map((swatch, index) => (
              <button
                key={`${swatch.value}-${swatch.label ?? index}`}
                aria-label={`Use ${swatch.label ?? swatch.value}`}
                aria-pressed={currentColor === swatch.value}
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-lg outline-none transition-[background-color,transform] duration-150 hover:bg-code-quiet/70 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-code-accent/40 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none",
                  currentColor === swatch.value && "bg-code-accent-soft/50"
                )}
                disabled={disabled}
                onClick={() => commitColor(swatch.value)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-7 rounded-md border border-black/10 transition-[box-shadow] duration-150 dark:border-white/15 motion-reduce:transition-none",
                    currentColor === swatch.value &&
                      "ring-2 ring-code-accent ring-offset-2 ring-offset-code-surface"
                  )}
                  style={{ backgroundColor: swatch.value }}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {description ? (
        <p className="text-xs leading-5 text-code-muted" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="text-xs leading-5 text-code-danger" id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}

export { ColorPicker }
