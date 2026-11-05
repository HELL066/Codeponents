import * as React from "react"
import { Clock3, Minus, Plus } from "lucide-react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import "./time-picker.css"

export interface TimePickerProps extends Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> {
  /** A local time in 24-hour `HH:mm` format. Pass null to clear a controlled picker. */
  value?: string | null
  /** Initial local time for an uncontrolled picker. */
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  name?: string
  /** Associate the hidden form value with a form outside the component's DOM parent. */
  form?: string
  required?: boolean
  invalid?: boolean
  disabled?: boolean
  placeholder?: string
  locale?: string
  /** Keep the popover open state under the control of a parent component. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Ref for focusing the visible trigger during form validation. */
  buttonRef?: React.Ref<HTMLButtonElement>
  /** Hide the clear action when the picker is composed with another control. */
  allowClear?: boolean
}

const VALID_TIME = /^(?:[01]\d|2[0-3]):[0-5]\d$/

function suggestedTime(date = new Date()) {
  const totalMinutes = date.getHours() * 60 + date.getMinutes()
  const roundedMinutes = Math.ceil(totalMinutes / 15) * 15
  const normalizedMinutes = roundedMinutes % (24 * 60)
  const hour = Math.floor(normalizedMinutes / 60)
  const minute = normalizedMinutes % 60
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

type TimeParts = {
  hour: number
  minute: number
  period: "AM" | "PM"
}

function isTime(value: string | null | undefined): value is string {
  return typeof value === "string" && VALID_TIME.test(value)
}

function timeValue(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

function splitTime(value: string, hourCycle: string): TimeParts {
  const [rawHour = "09", rawMinute = "00"] = value.split(":")
  const hour24 = Number(rawHour)

  return {
    hour:
      hourCycle === "h11"
        ? hour24 % 12
        : hourCycle === "h12"
          ? hour24 % 12 || 12
          : hour24,
    minute: Number(rawMinute),
    period: hour24 >= 12 ? "PM" : "AM",
  }
}

function toTimeValue(
  hour: number,
  minute: number,
  period: "AM" | "PM",
  uses12HourClock: boolean
) {
  const hour24 = uses12HourClock
    ? (hour % 12) + (period === "PM" ? 12 : 0)
    : hour

  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

function wrapTimePart(value: number, min: number, max: number, step: number) {
  const range = max - min + 1
  return ((value - min + (step % range) + range) % range) + min
}

function normalizeHourCycle(
  hourCycle?: string
): NonNullable<Intl.DateTimeFormatOptions["hourCycle"]> {
  return hourCycle === "h11" || hourCycle === "h12" || hourCycle === "h23"
    ? hourCycle
    : "h23"
}

function formatTime(value: string, locale?: string, hourCycle?: string) {
  const [hour = "09", minute = "00"] = value.split(":")
  const date = new Date(2020, 0, 1, Number(hour), Number(minute))
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hourCycle: normalizeHourCycle(hourCycle),
  }

  try {
    return new Intl.DateTimeFormat(locale, options).format(date)
  } catch {
    return new Intl.DateTimeFormat(undefined, options).format(date)
  }
}

function getHourCycle(locale?: string) {
  try {
    return normalizeHourCycle(
      new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions()
        .hourCycle
    )
  } catch {
    return normalizeHourCycle(
      new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions()
        .hourCycle
    )
  }
}

type TimeField = "hour" | "minute"

interface ClockDialProps {
  dialRef: React.Ref<HTMLDivElement>
  field: TimeField
  value: number
  min: number
  max: number
  hourCycle: string
  period: "AM" | "PM"
  onValueChange: (value: number) => void
  onChooseHour: () => void
}

function dialPoint(index: number, count: number, radius: number) {
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  }
}

function ClockDial({
  dialRef,
  field,
  value,
  min,
  max,
  hourCycle,
  period,
  onValueChange,
  onChooseHour,
}: ClockDialProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const hasPointerSelection = React.useRef(false)
  const is24Hour = hourCycle === "h23" || hourCycle === "h24"
  const accessibleLabel = field === "hour" ? "Choose hour" : "Choose minute"
  const valueText =
    field === "hour"
      ? `${String(value).padStart(2, "0")}${is24Hour ? "" : ` ${period}`}`
      : `${String(value).padStart(2, "0")} minutes`

  const valueAtPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    if (Math.hypot(dx, dy) < rect.width * 0.12) return value
    const angle =
      (Math.atan2(dy, dx) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2)
    const position = angle / (Math.PI * 2)

    if (field === "minute") return Math.round(position * 60) % 60

    const hourIndex = Math.round(position * 12) % 12
    if (is24Hour) {
      const radius = Math.hypot(dx, dy)
      const innerRing = radius < rect.width * 0.29
      return hourIndex + (innerRing ? 12 : 0)
    }
    if (hourCycle === "h11") return hourIndex
    return hourIndex === 0 ? 12 : hourIndex
  }

  const adjustValue = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "PageUp"
        ? 5
        : event.key === "PageDown"
          ? -5
          : event.key === "ArrowRight" || event.key === "ArrowUp"
            ? 1
            : event.key === "ArrowLeft" || event.key === "ArrowDown"
              ? -1
              : 0
    const nextValue =
      event.key === "Home"
        ? min
        : event.key === "End"
          ? max
          : step === 0
            ? undefined
            : wrapTimePart(value, min, max, step)

    if (nextValue === undefined) return
    event.preventDefault()
    onValueChange(nextValue)
  }

  const labels =
    field === "minute"
      ? Array.from({ length: 12 }, (_, index) => index * 5)
      : is24Hour
        ? Array.from({ length: 24 }, (_, index) => index)
        : Array.from({ length: 12 }, (_, index) =>
            hourCycle === "h11" ? index : index + 1
          )
  const activeIndex =
    field === "minute"
      ? value
      : is24Hour
        ? value % 12
        : hourCycle === "h11"
          ? value
          : value % 12
  const handRadius = field === "hour" && is24Hour && value >= 12 ? 21 : 34
  const handSteps = field === "minute" ? 60 : 12
  const targetAngle = activeIndex * (360 / handSteps)
  const [handState, setHandState] = React.useState({
    field,
    steps: handSteps,
    index: activeIndex,
    angle: targetAngle,
  })
  if (
    handState.field !== field ||
    handState.steps !== handSteps ||
    handState.index !== activeIndex
  ) {
    const previousTurn = ((handState.angle % 360) + 360) % 360
    const shortestTurn = ((targetAngle - previousTurn + 540) % 360) - 180
    setHandState({
      field,
      steps: handSteps,
      index: activeIndex,
      angle: handState.angle + shortestTurn,
    })
  }
  const handAngle =
    handState.field === field &&
    handState.steps === handSteps &&
    handState.index === activeIndex
      ? handState.angle
      : targetAngle

  return (
    <div
      ref={dialRef}
      aria-label={accessibleLabel}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      aria-valuetext={valueText}
      className="time-picker-dial"
      data-dragging={isDragging || undefined}
      onKeyDown={adjustValue}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        setIsDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
        event.currentTarget.focus({ preventScroll: true })
        const rect = event.currentTarget.getBoundingClientRect()
        const distanceFromCenter = Math.hypot(
          event.clientX - (rect.left + rect.width / 2),
          event.clientY - (rect.top + rect.height / 2)
        )
        hasPointerSelection.current = distanceFromCenter >= rect.width * 0.12
        onValueChange(valueAtPointer(event))
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          const rect = event.currentTarget.getBoundingClientRect()
          const distanceFromCenter = Math.hypot(
            event.clientX - (rect.left + rect.width / 2),
            event.clientY - (rect.top + rect.height / 2)
          )
          hasPointerSelection.current ||=
            distanceFromCenter >= rect.width * 0.12
          onValueChange(valueAtPointer(event))
        }
      }}
      onPointerUp={() => {
        setIsDragging(false)
        if (field === "hour" && hasPointerSelection.current) onChooseHour()
        hasPointerSelection.current = false
      }}
      onPointerCancel={() => {
        setIsDragging(false)
        hasPointerSelection.current = false
      }}
      onLostPointerCapture={() => {
        setIsDragging(false)
        hasPointerSelection.current = false
      }}
      role="slider"
      tabIndex={0}
    >
      <svg
        aria-hidden="true"
        className="time-picker-dial__face"
        viewBox="0 0 100 100"
      >
        <circle className="time-picker-dial__track" cx="50" cy="50" r="39" />
        {field === "minute" &&
          Array.from({ length: 60 }, (_, index) => {
            const point = dialPoint(index, 60, 39)
            return (
              <circle
                className={
                  index % 5 === 0
                    ? "time-picker-dial__tick time-picker-dial__tick--major"
                    : "time-picker-dial__tick"
                }
                cx={point.x}
                cy={point.y}
                key={index}
                r={index % 5 === 0 ? 0.8 : 0.35}
              />
            )
          })}
        <g
          className="time-picker-dial__hand-group"
          style={{
            transform: `rotate(${handAngle}deg) scaleY(${handRadius / 34})`,
          }}
        >
          <line
            className="time-picker-dial__hand"
            x1="50"
            y1="50"
            x2="50"
            y2="16"
          />
          <circle
            className="time-picker-dial__hand-tip"
            cx="50"
            cy="16"
            r="2.25"
          />
        </g>
        <circle className="time-picker-dial__hub" cx="50" cy="50" r="1.8" />
      </svg>
      {labels.map((label) => {
        const ring = field === "hour" && is24Hour && label >= 12 ? 21 : 34
        const point = dialPoint(
          field === "minute" ? label : label % 12,
          field === "minute" ? 60 : 12,
          ring
        )
        const selected = field === "minute" ? value === label : value === label
        return (
          <span
            aria-hidden="true"
            className={cn(
              "time-picker-dial__label",
              selected && "time-picker-dial__label--selected",
              ring === 21 && "time-picker-dial__label--inner"
            )}
            key={label}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {field === "minute"
              ? String(label).padStart(2, "0")
              : is24Hour
                ? String(label).padStart(2, "0")
                : label}
          </span>
        )
      })}
    </div>
  )
}

function setRef(
  ref: React.Ref<HTMLButtonElement> | undefined,
  node: HTMLButtonElement | null
) {
  if (typeof ref === "function") ref(node)
  else if (ref)
    (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
}

function TimePicker({
  className,
  value,
  defaultValue,
  onValueChange,
  name,
  form,
  required,
  invalid,
  disabled = false,
  placeholder = "Choose time",
  locale,
  open,
  onOpenChange,
  buttonRef,
  allowClear = true,
  ...divProps
}: TimePickerProps) {
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(() => (isTime(defaultValue) ? defaultValue : undefined))
  const selectedValue = controlled
    ? isTime(value)
      ? value
      : undefined
    : uncontrolledValue
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isOpen = open ?? uncontrolledOpen
  const [draftTime, setDraftTime] = React.useState(() => suggestedTime())
  const [activeField, setActiveField] = React.useState<TimeField>("hour")
  const [requiredError, setRequiredError] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const dialRef = React.useRef<HTMLDivElement>(null)
  const [segmentEdit, setSegmentEdit] = React.useState<{
    field: TimeField
    digits: string
  } | null>(null)
  const switchingSegmentRef = React.useRef(false)
  const hourSegmentRef = React.useRef<HTMLInputElement>(null)
  const minuteSegmentRef = React.useRef<HTMLInputElement>(null)
  const errorId = React.useId()
  const hourCycle = React.useMemo(() => getHourCycle(locale), [locale])
  const uses12HourClock = hourCycle === "h11" || hourCycle === "h12"
  const timeParts = splitTime(draftTime, hourCycle)
  const shownHour = uses12HourClock
    ? String(timeParts.hour).padStart(2, "0")
    : draftTime.slice(0, 2)
  const formattedValue = selectedValue
    ? formatTime(selectedValue, locale, hourCycle)
    : placeholder
  const accessibleLabel = divProps["aria-label"] ?? "Time"
  const describedBy =
    [divProps["aria-describedby"], required && !selectedValue ? errorId : null]
      .filter((id): id is string => typeof id === "string" && id.length > 0)
      .join(" ") || undefined
  const ariaRequired = divProps["aria-required"] ?? required
  const showRequiredError = required && requiredError && !selectedValue
  const isInvalid = invalid || showRequiredError

  React.useEffect(() => {
    if (!disabled || !isOpen) return
    const frame = window.requestAnimationFrame(() => {
      if (open === undefined) setUncontrolledOpen(false)
      onOpenChange?.(false)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [disabled, isOpen, onOpenChange, open])

  React.useEffect(() => {
    if (!isOpen || !requiredError) return
    const frame = window.requestAnimationFrame(() => {
      setSegmentEdit({ field: "hour", digits: shownHour })
      window.requestAnimationFrame(() => {
        hourSegmentRef.current?.focus({ preventScroll: true })
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [isOpen, requiredError, shownHour])

  const setPickerOpen = (nextOpen: boolean) => {
    if (disabled && nextOpen) return
    if (open === undefined) setUncontrolledOpen(nextOpen)
    onOpenChange?.(nextOpen)
    if (nextOpen) {
      setSegmentEdit(null)
      setDraftTime(selectedValue ?? suggestedTime())
      setActiveField("hour")
    } else setSegmentEdit(null)
  }

  const updatePickerTime = (
    hour: number,
    minute: number,
    period: "AM" | "PM"
  ) => {
    const nextValue = toTimeValue(hour, minute, period, uses12HourClock)
    setDraftTime(nextValue)
  }

  const segmentRange = (field: TimeField) => {
    const min =
      field === "minute" ? 0 : uses12HourClock && hourCycle === "h12" ? 1 : 0
    const max =
      field === "minute"
        ? 59
        : uses12HourClock
          ? hourCycle === "h11"
            ? 11
            : 12
          : 23
    return { min, max }
  }

  const stepTimePart = (field: TimeField, amount: number) => {
    const currentHour24 = uses12HourClock
      ? (timeParts.hour % 12) + (timeParts.period === "PM" ? 12 : 0)
      : Number(draftTime.slice(0, 2))
    const totalMinutes =
      currentHour24 * 60 +
      timeParts.minute +
      amount * (field === "hour" ? 60 : 1)
    const minutesInDay = 24 * 60
    const normalizedMinutes =
      ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay
    const nextHour24 = Math.floor(normalizedMinutes / 60)
    const nextMinute = normalizedMinutes % 60
    const nextPeriod = uses12HourClock
      ? nextHour24 >= 12
        ? "PM"
        : "AM"
      : timeParts.period
    const twelveHourValue = nextHour24 % 12 || 12
    const nextHour = uses12HourClock
      ? hourCycle === "h11"
        ? twelveHourValue % 12
        : twelveHourValue
      : nextHour24

    updatePickerTime(nextHour, nextMinute, nextPeriod)
  }

  const handleSegmentChange = (
    field: TimeField,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { min, max } = segmentRange(field)
    let digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 2)
    let nextValue = digits ? Number(digits) : undefined

    if (nextValue !== undefined && nextValue > max) {
      digits = digits.slice(-1)
      nextValue = Number(digits)
    }

    setSegmentEdit({ field, digits })
    setActiveField(field)

    if (nextValue !== undefined && nextValue >= min && nextValue <= max) {
      if (field === "hour")
        updatePickerTime(nextValue, timeParts.minute, timeParts.period)
      else
        updatePickerTime(
          uses12HourClock ? timeParts.hour : Number(draftTime.slice(0, 2)),
          nextValue,
          timeParts.period
        )

      if (field === "hour" && digits.length === 2) {
        focusSegment("minute")
      }
    }
  }

  const handleSegmentKeyDown = (
    field: TimeField,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault()
      if (field === "hour") focusSegment("minute")
      else event.currentTarget.blur()
      return
    }

    const step =
      event.key === "PageUp"
        ? 5
        : event.key === "PageDown"
          ? -5
          : event.key === "ArrowRight" || event.key === "ArrowUp"
            ? 1
            : event.key === "ArrowLeft" || event.key === "ArrowDown"
              ? -1
              : 0
    if (step !== 0) {
      event.preventDefault()
      setSegmentEdit(null)
      stepTimePart(field, step)
      return
    }

    if (event.key !== "Home" && event.key !== "End") return
    const { min, max } = segmentRange(field)
    const nextValue = event.key === "Home" ? min : max
    event.preventDefault()
    setSegmentEdit(null)
    if (field === "hour")
      updatePickerTime(nextValue, timeParts.minute, timeParts.period)
    else
      updatePickerTime(
        uses12HourClock ? timeParts.hour : Number(draftTime.slice(0, 2)),
        nextValue,
        timeParts.period
      )
  }

  const adjustTimePart = (field: TimeField, amount: number) => {
    setSegmentEdit(null)
    setActiveField(field)
    stepTimePart(field, amount)
  }

  const getSegmentValue = (field: TimeField) =>
    field === "hour" ? shownHour : String(timeParts.minute).padStart(2, "0")

  const focusSegment = (field: TimeField) => {
    switchingSegmentRef.current = true
    setActiveField(field)
    setSegmentEdit({ field, digits: getSegmentValue(field) })
    window.requestAnimationFrame(() => {
      const input =
        field === "hour" ? hourSegmentRef.current : minuteSegmentRef.current
      input?.focus({ preventScroll: true })
      switchingSegmentRef.current = false
    })
  }

  const beginSegmentEdit = (field: TimeField) => {
    setActiveField(field)
    setSegmentEdit({ field, digits: getSegmentValue(field) })
    window.requestAnimationFrame(() => {
      const input =
        field === "hour" ? hourSegmentRef.current : minuteSegmentRef.current
      input?.focus({ preventScroll: true })
    })
  }

  const renderSegment = (field: TimeField) => {
    const currentValue = getSegmentValue(field)
    const inputRef = field === "hour" ? hourSegmentRef : minuteSegmentRef
    const isActive = activeField === field

    if (segmentEdit?.field !== field) {
      return (
        <button
          aria-label={`Edit ${field}, ${currentValue}`}
          className={cn(
            "time-picker__segment",
            isActive && "time-picker__segment--active"
          )}
          onClick={() => beginSegmentEdit(field)}
          onFocus={() => setActiveField(field)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
            event.preventDefault()
            adjustTimePart(field, event.key === "ArrowUp" ? 1 : -1)
          }}
          type="button"
        >
          <TextMorph
            as="span"
            duration={260}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            numbers
            respectReducedMotion
          >
            {currentValue}
          </TextMorph>
        </button>
      )
    }

    return (
      <input
        aria-label={`${field === "hour" ? "Hour" : "Minute"}, ${currentValue}`}
        autoComplete="off"
        className={cn(
          "time-picker__segment",
          isActive && "time-picker__segment--active"
        )}
        enterKeyHint={field === "hour" ? "next" : "done"}
        inputMode="numeric"
        maxLength={2}
        onBlur={() => {
          if (!switchingSegmentRef.current) setSegmentEdit(null)
        }}
        onChange={(event) => handleSegmentChange(field, event)}
        onFocus={(event) => {
          setActiveField(field)
          setSegmentEdit({ field, digits: currentValue })
          event.currentTarget.select()
        }}
        onKeyDown={(event) => handleSegmentKeyDown(field, event)}
        pattern="[0-9]*"
        ref={inputRef}
        type="text"
        value={segmentEdit.digits}
      />
    )
  }

  const applyValue = (nextValue: string | null) => {
    if (!controlled) setUncontrolledValue(nextValue ?? undefined)
    if (nextValue) setRequiredError(false)
    onValueChange?.(nextValue)
    setPickerOpen(false)
  }

  const handleInvalid = (event: React.InvalidEvent<HTMLInputElement>) => {
    event.preventDefault()
    setRequiredError(true)
    setPickerOpen(true)
  }

  return (
    <div
      {...divProps}
      aria-invalid={isInvalid || undefined}
      className={cn("min-w-0", className)}
      data-slot="time-picker"
      role="group"
    >
      <Popover open={isOpen && !disabled} onOpenChange={setPickerOpen}>
        <PopoverTrigger asChild>
          <button
            aria-describedby={describedBy}
            aria-expanded={isOpen && !disabled}
            aria-haspopup="dialog"
            aria-invalid={isInvalid || undefined}
            aria-label={
              selectedValue
                ? `${accessibleLabel}, ${formattedValue}`
                : accessibleLabel
            }
            aria-required={ariaRequired || undefined}
            className={cn(
              "inline-flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-code-line/55 bg-code-surface px-3 text-left text-sm text-code-ink transition-[border-color,box-shadow,background-color] outline-none hover:border-code-muted/55 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:bg-code-quiet disabled:text-code-muted aria-invalid:border-code-danger aria-invalid:focus-visible:ring-code-danger/15 motion-reduce:transition-none",
              !selectedValue && "text-code-muted"
            )}
            disabled={disabled}
            ref={(node) => {
              triggerRef.current = node
              setRef(buttonRef, node)
            }}
            type="button"
          >
            <span className="min-w-0 truncate tabular-nums">
              <TextMorph
                as="span"
                duration={320}
                ease="cubic-bezier(0.22, 1, 0.36, 1)"
                numbers
                respectReducedMotion
              >
                {formattedValue}
              </TextMorph>
            </span>
            <Clock3
              aria-hidden="true"
              className="size-4 shrink-0 text-code-muted"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          aria-label="Choose a time"
          className="max-h-[min(30rem,var(--radix-popover-content-available-height),calc(100dvh-2rem))] w-[min(21rem,calc(100vw-1.5rem))] overflow-y-auto p-3"
          onOpenAutoFocus={(event) => {
            if (!window.matchMedia("(pointer: coarse)").matches) return
            event.preventDefault()
            dialRef.current?.focus({ preventScroll: true })
          }}
          sideOffset={8}
        >
          <div className="time-picker__panel grid gap-1.5">
            <div className="time-picker__readout" aria-label="Selected time">
              <div
                className="time-picker__segment-group"
                data-active={activeField === "hour" || undefined}
              >
                {renderSegment("hour")}
                <button
                  aria-label="Decrease hour"
                  className="time-picker__step-button time-picker__step-button--decrease"
                  onClick={() => adjustTimePart("hour", -1)}
                  type="button"
                >
                  <Minus aria-hidden="true" />
                </button>
                <button
                  aria-label="Increase hour"
                  className="time-picker__step-button"
                  onClick={() => adjustTimePart("hour", 1)}
                  type="button"
                >
                  <Plus aria-hidden="true" />
                </button>
              </div>
              <span aria-hidden="true" className="time-picker__colon">
                :
              </span>
              <div
                className="time-picker__segment-group"
                data-active={activeField === "minute" || undefined}
              >
                {renderSegment("minute")}
                <button
                  aria-label="Decrease minute"
                  className="time-picker__step-button time-picker__step-button--decrease"
                  onClick={() => adjustTimePart("minute", -1)}
                  type="button"
                >
                  <Minus aria-hidden="true" />
                </button>
                <button
                  aria-label="Increase minute"
                  className="time-picker__step-button"
                  onClick={() => adjustTimePart("minute", 1)}
                  type="button"
                >
                  <Plus aria-hidden="true" />
                </button>
              </div>
              {uses12HourClock ? (
                <div
                  aria-label="AM or PM"
                  className="time-picker__period"
                  role="group"
                >
                  {(["AM", "PM"] as const).map((period) => (
                    <button
                      aria-pressed={timeParts.period === period}
                      className={cn(
                        "time-picker__period-button",
                        timeParts.period === period &&
                          "time-picker__period-button--active"
                      )}
                      key={period}
                      onClick={() => {
                        setSegmentEdit(null)
                        updatePickerTime(
                          timeParts.hour,
                          timeParts.minute,
                          period
                        )
                      }}
                      type="button"
                    >
                      {period}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <p className="sr-only" aria-live="polite">
              {segmentEdit?.field === activeField
                ? `Editing ${activeField}. Type a number or use the arrow keys.`
                : `Adjusting ${activeField}. Use arrow keys or activate a value to type.`}
            </p>
            <ClockDial
              dialRef={dialRef}
              field={activeField}
              hourCycle={hourCycle}
              max={
                activeField === "minute"
                  ? 59
                  : uses12HourClock
                    ? hourCycle === "h11"
                      ? 11
                      : 12
                    : 23
              }
              min={
                activeField === "minute"
                  ? 0
                  : uses12HourClock && hourCycle === "h12"
                    ? 1
                    : 0
              }
              onChooseHour={() => setActiveField("minute")}
              onValueChange={(nextValue) => {
                setSegmentEdit(null)
                if (activeField === "hour")
                  updatePickerTime(
                    nextValue,
                    timeParts.minute,
                    timeParts.period
                  )
                else
                  updatePickerTime(
                    uses12HourClock
                      ? timeParts.hour
                      : Number(draftTime.slice(0, 2)),
                    nextValue,
                    timeParts.period
                  )
              }}
              period={timeParts.period}
              value={
                activeField === "hour"
                  ? uses12HourClock
                    ? timeParts.hour
                    : Number(draftTime.slice(0, 2))
                  : timeParts.minute
              }
            />
            <div className="time-picker__actions flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <div className="flex items-center gap-1">
                {allowClear && selectedValue ? (
                  <Button
                    disabled={disabled}
                    onClick={() => applyValue(null)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    Clear
                  </Button>
                ) : null}
                <Button
                  disabled={disabled}
                  onClick={() => applyValue(timeValue(new Date()))}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Now
                </Button>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button
                  onClick={() => setPickerOpen(false)}
                  disabled={disabled}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  className="min-w-24"
                  disabled={disabled}
                  onClick={() => applyValue(draftTime)}
                  size="sm"
                  type="button"
                >
                  Set time
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {required ? (
        <input
          aria-hidden="true"
          aria-describedby={!selectedValue ? errorId : undefined}
          aria-label={accessibleLabel}
          className="sr-only"
          disabled={disabled}
          onChange={() => undefined}
          onInvalid={handleInvalid}
          required
          form={form}
          tabIndex={-1}
          type="text"
          value={selectedValue ?? ""}
        />
      ) : null}
      {name ? (
        <input
          disabled={disabled}
          form={form}
          name={name}
          type="hidden"
          value={selectedValue ?? ""}
        />
      ) : null}
      {required && !selectedValue ? (
        <span
          className="sr-only"
          id={errorId}
          role={showRequiredError ? "alert" : undefined}
        >
          Choose a time
        </span>
      ) : null}
    </div>
  )
}

export { TimePicker }
