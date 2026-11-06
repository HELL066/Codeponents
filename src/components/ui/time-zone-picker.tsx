import * as React from "react"
import { Check, ChevronDown, Globe2 } from "lucide-react"
import { TextMorph } from "torph/react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type TimeZoneOption = {
  /** An IANA time zone identifier, such as `America/Los_Angeles`. */
  value: string
  /** Display name. Defaults to the city or region in the IANA identifier. */
  label?: string
  /** Extra words people can search for, such as a city alias. */
  keywords?: readonly string[]
}

export interface TimeZonePickerProps {
  /** Pass a value to control the picker; pass `null` to keep it empty. */
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (timeZone: string | null) => void
  /** Restrict the menu to these IANA time zones. Defaults to the runtime's supported zones. */
  options?: readonly TimeZoneOption[]
  /** Format UTC offsets for this date. Defaults to the current date, including its DST rules. */
  referenceDate?: Date
  locale?: string
  name?: string
  /** Associate the hidden value with a form outside the component's DOM parent. */
  form?: string
  required?: boolean
  invalid?: boolean
  disabled?: boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  clearLabel?: string
  allowClear?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  className?: string
  buttonRef?: React.Ref<HTMLButtonElement>
}

type ResolvedTimeZoneOption = TimeZoneOption & {
  label: string
  group: string
  offset: string
  disabled: boolean
}

const FALLBACK_TIME_ZONES = [
  "Africa/Cairo",
  "Africa/Johannesburg",
  "America/Anchorage",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Phoenix",
  "America/Sao_Paulo",
  "America/Toronto",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Asia/Manila",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Perth",
  "Australia/Sydney",
  "Europe/Berlin",
  "Europe/London",
  "Europe/Paris",
  "Pacific/Auckland",
] as const

const intlWithTimeZoneList = Intl as typeof Intl & {
  supportedValuesOf?: (key: "timeZone") => string[]
}

function getDefaultTimeZones() {
  let values: string[]

  try {
    values = intlWithTimeZoneList.supportedValuesOf?.("timeZone") ?? [
      ...FALLBACK_TIME_ZONES,
    ]
  } catch {
    values = [...FALLBACK_TIME_ZONES]
  }

  return ["UTC", ...new Set(values.filter((value) => value !== "UTC"))]
}

const DEFAULT_TIME_ZONES = getDefaultTimeZones()
const offsetFormatters = new Map<string, Intl.DateTimeFormat>()
const validTimeZones = new Map<string, boolean>()

function isValidTimeZone(value: string) {
  const cached = validTimeZones.get(value)
  if (cached !== undefined) return cached

  let valid = true
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value })
  } catch {
    valid = false
  }
  validTimeZones.set(value, valid)
  return valid
}

function getOffset(value: string, date: Date) {
  if (!isValidTimeZone(value) || Number.isNaN(date.getTime())) return ""

  let formatter = offsetFormatters.get(value)
  if (!formatter) {
    try {
      formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: value,
        timeZoneName: "longOffset",
      })
    } catch {
      try {
        formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: value,
          timeZoneName: "shortOffset",
        })
      } catch {
        return ""
      }
    }
    offsetFormatters.set(value, formatter)
  }

  const zoneName = formatter
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value
  if (!zoneName) return ""
  const match = zoneName.match(
    /^(?:GMT|UTC)(?:([+-])(\d{1,2})(?::?(\d{2}))?)?$/
  )
  if (!match) return zoneName
  if (!match[1]) return "UTC+00:00"

  const sign = match[1] === "-" ? "−" : "+"
  const hours = (match[2] ?? "0").padStart(2, "0")
  const minutes = (match[3] ?? "00").padStart(2, "0")
  return `UTC${sign}${hours}:${minutes}`
}

function getCityName(value: string) {
  if (value === "UTC" || value === "Etc/UTC")
    return "Coordinated Universal Time"
  const city = value.split("/").at(-1) ?? value
  return city.replaceAll("_", " ")
}

function getRegionName(value: string) {
  const region = value.split("/")[0] ?? "Other"
  if (region === "UTC" || region === "Etc") return "UTC offsets"
  if (region === "America") return "Americas"
  return region
}

function setRef(
  ref: React.Ref<HTMLButtonElement> | undefined,
  node: HTMLButtonElement | null
) {
  if (typeof ref === "function") ref(node)
  else if (ref)
    (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
}

function TimeZonePicker({
  value,
  defaultValue = null,
  onValueChange,
  options,
  referenceDate,
  locale,
  name,
  form,
  required = false,
  invalid = false,
  disabled = false,
  placeholder = "Choose a time zone",
  searchPlaceholder = "Search city or time zone",
  emptyMessage = "No time zones found",
  clearLabel = "Clear time zone",
  allowClear = true,
  open,
  onOpenChange,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  className,
  buttonRef,
}: TimeZonePickerProps) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | null
  >(defaultValue)
  const selectedValue = isControlled ? value : uncontrolledValue
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [renderDate, setRenderDate] = React.useState(() => new Date())
  const [requiredError, setRequiredError] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const errorId = React.useId()
  const isOpen = (open ?? uncontrolledOpen) && !disabled
  const hasError = invalid || (required && requiredError && !selectedValue)
  const describedBy =
    [ariaDescribedBy, requiredError && !selectedValue ? errorId : null]
      .filter((item): item is string => Boolean(item))
      .join(" ") || undefined
  const displayDate = referenceDate ?? renderDate

  const selectedOption = React.useMemo(() => {
    if (!selectedValue) return undefined
    const option = options?.find(
      (candidate) => candidate.value === selectedValue
    ) ?? {
      value: selectedValue,
    }
    return {
      ...option,
      label: option.label ?? getCityName(option.value),
      group: getRegionName(option.value),
      offset: getOffset(option.value, displayDate),
      disabled: !isValidTimeZone(option.value),
    }
  }, [displayDate, options, selectedValue])

  const resolvedOptions = React.useMemo(() => {
    if (!isOpen) return []
    const source: TimeZoneOption[] =
      options !== undefined
        ? [...options]
        : DEFAULT_TIME_ZONES.map((timeZone) => ({ value: timeZone }))
    if (
      selectedValue &&
      !source.some((option) => option.value === selectedValue)
    ) {
      source.push({ value: selectedValue })
    }

    const resolved: ResolvedTimeZoneOption[] = source.map((option) => ({
      ...option,
      label: option.label ?? getCityName(option.value),
      group: getRegionName(option.value),
      offset: getOffset(option.value, displayDate),
      disabled: !isValidTimeZone(option.value),
    }))
    const groupOrder = [
      "UTC offsets",
      "Africa",
      "Americas",
      "Antarctica",
      "Arctic",
      "Asia",
      "Atlantic",
      "Australia",
      "Europe",
      "Indian",
      "Pacific",
      "Other",
    ]

    return resolved.sort((first, second) => {
      const groupDifference =
        groupOrder.indexOf(first.group) - groupOrder.indexOf(second.group)
      return groupDifference || first.label.localeCompare(second.label, locale)
    })
  }, [displayDate, isOpen, locale, options, selectedValue])

  React.useEffect(() => {
    if (!disabled) return
    const frame = window.requestAnimationFrame(() => {
      if (open === undefined) setUncontrolledOpen(false)
      onOpenChange?.(false)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [disabled, open, onOpenChange])

  function setPickerOpen(nextOpen: boolean) {
    if (disabled && nextOpen) return
    if (open === undefined) setUncontrolledOpen(nextOpen)
    onOpenChange?.(nextOpen)
    if (nextOpen && !referenceDate) setRenderDate(new Date())
  }

  function selectValue(nextValue: string | null) {
    if (!isControlled) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
    setRequiredError(false)
    setPickerOpen(false)
  }

  function handleInvalid(event: React.InvalidEvent<HTMLInputElement>) {
    event.preventDefault()
    setRequiredError(true)
    setPickerOpen(true)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const regionGroups = React.useMemo(() => {
    const groups = new Map<string, ResolvedTimeZoneOption[]>()
    for (const option of resolvedOptions) {
      const group = groups.get(option.group) ?? []
      group.push(option)
      groups.set(option.group, group)
    }
    return Array.from(groups, ([name, items]) => ({ name, items }))
  }, [resolvedOptions])

  return (
    <div className="min-w-0">
      <Popover open={isOpen} onOpenChange={setPickerOpen}>
        <PopoverTrigger asChild>
          <button
            ref={(node) => {
              triggerRef.current = node
              setRef(buttonRef, node)
            }}
            id={id}
            data-slot="time-zone-picker-trigger"
            title={selectedOption?.value}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={describedBy}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-required={required || undefined}
            aria-invalid={hasError || undefined}
            aria-controls={isOpen ? `${errorId}-listbox` : undefined}
            disabled={disabled}
            className={cn(
              "group/time-zone-picker inline-flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-code-line/55 bg-code-surface px-3 text-left text-sm text-code-ink transition-[border-color,box-shadow,background-color] outline-none hover:border-code-muted/55 focus-visible:border-code-accent focus-visible:ring-3 focus-visible:ring-code-accent/20 disabled:cursor-not-allowed disabled:bg-code-quiet disabled:text-code-muted aria-expanded:border-code-accent/40 aria-expanded:bg-code-accent-soft/30 aria-invalid:border-code-danger aria-invalid:focus-visible:ring-code-danger/15 motion-reduce:transition-none",
              className
            )}
            role="combobox"
            type="button"
          >
            <Globe2
              aria-hidden="true"
              className="size-4 shrink-0 text-code-muted"
            />
            <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  !selectedOption && "text-code-muted/75"
                )}
              >
                <TextMorph as="span" duration={240} respectReducedMotion>
                  {selectedOption?.label ?? placeholder}
                </TextMorph>
              </span>
              {selectedOption?.offset ? (
                <span className="shrink-0 text-xs leading-4 text-code-muted tabular-nums">
                  <TextMorph
                    as="span"
                    duration={220}
                    numbers
                    respectReducedMotion
                  >
                    {selectedOption.offset}
                  </TextMorph>
                </span>
              ) : null}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-code-muted transition-transform duration-150 group-data-[state=open]/time-zone-picker:rotate-180 motion-reduce:transition-none"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[min(var(--radix-popover-trigger-width),20rem)] max-w-[calc(100vw-1rem)] min-w-[min(18rem,calc(100vw-2rem))] bg-code-surface-raised p-1 dark:ring-1 dark:ring-code-line/55"
          sideOffset={6}
        >
          <Command>
            <CommandInput
              aria-label="Search time zones"
              placeholder={searchPlaceholder}
            />
            <CommandList
              aria-label="Time zones"
              id={`${errorId}-listbox`}
              className="max-h-[min(19rem,calc(100dvh-10rem))] overscroll-contain"
            >
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {regionGroups.map((group) => (
                <CommandGroup heading={group.name} key={group.name}>
                  {group.items.map((option) => (
                    <CommandItem
                      disabled={option.disabled}
                      key={option.value}
                      keywords={[
                        option.label,
                        option.value,
                        option.offset,
                        ...(option.keywords ?? []),
                      ]}
                      onSelect={() => selectValue(option.value)}
                      value={option.value}
                      className="gap-3 py-2.5"
                    >
                      <span className="grid min-w-0 flex-1 gap-0.5 text-left">
                        <span className="truncate text-sm text-code-ink">
                          {option.label}
                        </span>
                      </span>
                      {selectedValue === option.value ? (
                        <Check
                          aria-hidden="true"
                          className="size-4 shrink-0 text-code-accent"
                        />
                      ) : null}
                      <span className="shrink-0 text-xs leading-4 text-code-muted tabular-nums">
                        {option.offset}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              {allowClear && !required && selectedValue ? (
                <CommandGroup className="mt-1 border-t border-code-line/55 pt-1">
                  <CommandItem
                    onSelect={() => selectValue(null)}
                    value={clearLabel}
                  >
                    {clearLabel}
                  </CommandItem>
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {required ? (
        <input
          aria-hidden="true"
          autoComplete="off"
          className="sr-only"
          disabled={disabled}
          form={form}
          onChange={() => undefined}
          onInvalid={handleInvalid}
          required
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
      {required && requiredError && !selectedValue ? (
        <span
          className="mt-1 block text-xs text-code-danger"
          id={errorId}
          role="alert"
        >
          Choose a time zone
        </span>
      ) : null}
    </div>
  )
}

export { TimeZonePicker }
