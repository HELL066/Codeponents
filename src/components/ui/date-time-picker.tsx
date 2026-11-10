import * as React from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { TimePicker } from "@/components/ui/time-picker"
import { cn } from "@/lib/utils"

export interface DateTimePickerProps extends Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> {
  /** A local date and time. Pass null to clear a controlled picker. */
  value?: Date | null
  /** Initial local date and time for an uncontrolled picker. */
  defaultValue?: Date | null
  onValueChange?: (value: Date | null) => void
  name?: string
  /** Associate the hidden form value with a form outside the component's DOM parent. */
  form?: string
  required?: boolean
  invalid?: boolean
  disabled?: boolean
  placeholder?: string
  locale?: string
  minDate?: Date
  maxDate?: Date
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function parseDateKey(value: string | undefined) {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

function timeValue(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

function localDateTime(date: Date) {
  return `${dateKey(date)}T${timeValue(date)}`
}

function combineLocal(date: Date, time: string, previous?: Date) {
  const [hours, minutes] = time.split(":").map(Number)
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours ?? 0,
    minutes ?? 0,
    previous?.getSeconds() ?? 0,
    previous?.getMilliseconds() ?? 0
  )
}

/** A local date paired with a custom, keyboard-accessible time picker. */
function DateTimePicker({
  className,
  value,
  defaultValue,
  onValueChange,
  name,
  form,
  required,
  invalid,
  disabled,
  placeholder,
  locale,
  minDate,
  maxDate,
  ...divProps
}: DateTimePickerProps) {
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    Date | undefined
  >(() =>
    defaultValue instanceof Date ? new Date(defaultValue.getTime()) : undefined
  )
  const [draftDate, setDraftDate] = React.useState<string>()
  const [draftTime, setDraftTime] = React.useState("")
  const [timeOpen, setTimeOpen] = React.useState(false)
  const [timeError, setTimeError] = React.useState(false)
  const timeTriggerRef = React.useRef<HTMLButtonElement>(null)
  const dateTriggerId = React.useId()
  const selectedValue = controlled ? (value ?? undefined) : uncontrolledValue
  const selectedDate = selectedValue ?? parseDateKey(draftDate)
  const selectedTime = selectedValue ? timeValue(selectedValue) : draftTime
  const canClear = Boolean(selectedValue || draftDate || draftTime)
  const timeErrorId = React.useId()
  const groupLabel = divProps["aria-label"]
  const groupLabelledBy = divProps["aria-labelledby"]

  const clearDraft = () => {
    setDraftDate(undefined)
    setDraftTime("")
    setTimeError(false)
  }

  const commit = (nextValue: Date | undefined) => {
    if (!controlled) setUncontrolledValue(nextValue)
    clearDraft()
    onValueChange?.(nextValue ?? null)
  }

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      commit(undefined)
      return
    }

    if (selectedTime) {
      commit(combineLocal(date, selectedTime, selectedValue))
      return
    }

    setDraftDate(dateKey(date))
    setTimeError(false)
  }

  const handleTimeChange = (time: string | null) => {
    if (!time) {
      commit(undefined)
      return
    }

    if (selectedDate) {
      commit(combineLocal(selectedDate, time, selectedValue))
    } else {
      setDraftTime(time)
      setTimeError(false)
    }
  }

  const clearValue = () => commit(undefined)

  return (
    <div
      {...divProps}
      role="group"
      aria-label={groupLabel ?? (groupLabelledBy ? undefined : "Date and time")}
      data-slot="date-time-picker"
      className={cn(
        "grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(7.25rem,0.7fr)_3.25rem] sm:items-center",
        className
      )}
    >
      <DatePicker
        id={dateTriggerId}
        value={selectedDate ?? null}
        onValueChange={handleDateChange}
        placeholder={placeholder}
        locale={locale}
        minDate={minDate}
        maxDate={maxDate}
        required={required && !selectedDate}
        aria-required={required || undefined}
        invalid={invalid || timeError}
        aria-describedby={timeError ? timeErrorId : undefined}
        disabled={disabled}
        aria-label="Date"
        className="min-w-0"
      />
      <TimePicker
        aria-label="Time"
        aria-required={required || undefined}
        aria-describedby={timeError ? timeErrorId : undefined}
        allowClear={false}
        buttonRef={timeTriggerRef}
        disabled={disabled}
        invalid={invalid || timeError}
        locale={locale}
        onOpenChange={setTimeOpen}
        onValueChange={handleTimeChange}
        open={timeOpen}
        placeholder="Choose time"
        value={selectedTime || null}
      />
      <button
        type="button"
        onClick={clearValue}
        disabled={disabled || !canClear}
        aria-hidden={!canClear || undefined}
        tabIndex={canClear ? undefined : -1}
        className={cn(
          "col-start-1 inline-flex h-10 w-[3.25rem] items-center justify-center justify-self-end rounded-md text-xs text-code-muted transition-colors hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:col-auto",
          !canClear && "invisible"
        )}
      >
        Clear
      </button>
      {required ? (
        <input
          aria-describedby={timeError ? timeErrorId : undefined}
          aria-label="Date and time"
          autoComplete="off"
          className="sr-only"
          form={form}
          onChange={() => undefined}
          onInvalid={(event) => {
            event.preventDefault()
            setTimeError(true)
            if (selectedDate) {
              setTimeOpen(true)
              window.requestAnimationFrame(() =>
                timeTriggerRef.current?.focus()
              )
            } else {
              document.getElementById(dateTriggerId)?.focus()
            }
          }}
          required={required && Boolean(selectedDate)}
          tabIndex={-1}
          type="text"
          value={selectedValue ? localDateTime(selectedValue) : ""}
        />
      ) : null}
      {timeError ? (
        <span
          className="col-span-full text-xs text-code-danger"
          id={timeErrorId}
          role="alert"
        >
          {selectedDate ? "Choose a time" : "Choose a date"}
        </span>
      ) : null}
      {name ? (
        <input
          type="hidden"
          name={name}
          form={form}
          disabled={disabled}
          value={selectedValue ? localDateTime(selectedValue) : ""}
        />
      ) : null}
    </div>
  )
}

export { DateTimePicker }
