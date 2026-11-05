import * as React from "react"
import { ChevronDown } from "lucide-react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

export type MultiSelectOption = {
  value: string
  label: string
  keywords?: string[]
  group?: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: readonly MultiSelectOption[]
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
  /** Required accessible name for the trigger and options list. */
  ariaLabel: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  clearLabel?: string
  /** Submit each selected value with a native form. */
  name?: string
  /** Associate selected values with a form outside this component's DOM parent. */
  form?: string
  disabled?: boolean
  maxSelections?: number
  className?: string
}

type OptionGroup = {
  name: string
  items: MultiSelectOption[]
}

function MultiSelectOpenState({
  disabled,
  children,
}: {
  disabled: boolean
  children: (isOpen: boolean) => React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const isOpen = open && !disabled

  return (
    <Popover
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!disabled) setOpen(nextOpen)
      }}
    >
      {children(isOpen)}
    </Popover>
  )
}

function MultiSelect({
  options,
  value,
  defaultValue = [],
  onValueChange,
  ariaLabel,
  placeholder = "Select options",
  searchPlaceholder = "Search options",
  emptyMessage = "No options found",
  clearLabel = "Clear selection",
  name,
  form,
  disabled = false,
  maxSelections,
  className,
}: MultiSelectProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>([
    ...defaultValue,
  ])

  const isControlled = value !== undefined
  const selectedValues = React.useMemo(
    () => Array.from(new Set(isControlled ? (value ?? []) : internalValue)),
    [internalValue, isControlled, value]
  )
  const selectionLimit =
    maxSelections === undefined || !Number.isFinite(maxSelections)
      ? undefined
      : Math.max(0, Math.floor(maxSelections))
  const atLimit =
    selectionLimit !== undefined && selectedValues.length >= selectionLimit

  const groupedOptions = React.useMemo(() => {
    const groups = new Map<string, MultiSelectOption[]>()
    for (const option of options) {
      const groupName = option.group ?? "Options"
      const group = groups.get(groupName) ?? []
      group.push(option)
      groups.set(groupName, group)
    }
    return Array.from(groups, ([name, items]): OptionGroup => ({ name, items }))
  }, [options])

  const selectedLabels = React.useMemo(
    () =>
      selectedValues.map(
        (value) => options.find((option) => option.value === value)?.label
      ),
    [options, selectedValues]
  )

  const summary = React.useMemo(() => {
    if (selectedValues.length === 0) return placeholder
    if (selectedLabels.some((label) => label === undefined)) {
      return `${selectedValues.length} selected`
    }
    if (selectedLabels.length === 1) return selectedLabels[0]!
    if (selectedLabels.length === 2) {
      return `${selectedLabels[0]}, ${selectedLabels[1]}`
    }
    return `${selectedLabels[0]} and ${selectedLabels.length - 1} others`
  }, [placeholder, selectedLabels, selectedValues.length])

  const updateValue = (nextValue: string[]) => {
    if (!isControlled) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  const toggleOption = (option: MultiSelectOption) => {
    if (disabled || option.disabled) return

    const isSelected = selectedValues.includes(option.value)
    if (!isSelected && atLimit) return

    updateValue(
      isSelected
        ? selectedValues.filter((selected) => selected !== option.value)
        : [...selectedValues, option.value]
    )
  }

  const clearSelection = () => updateValue([])

  return (
    <MultiSelectOpenState
      disabled={disabled}
      key={disabled ? "disabled" : "enabled"}
    >
      {(isOpen) => (
        <>
          <PopoverTrigger asChild>
            <Button
              aria-expanded={isOpen}
              aria-label={`${ariaLabel}: ${summary}`}
              aria-haspopup="listbox"
              className={cn(
                "group min-h-10 w-full justify-between border-code-line/55 bg-code-surface px-3 font-normal text-code-ink transition-[border-color,background-color] hover:border-code-muted/55 hover:bg-code-surface aria-expanded:border-code-accent/40 aria-expanded:bg-code-accent-soft/35 motion-reduce:transition-none motion-reduce:active:scale-100",
                selectedValues.length === 0 && "text-code-muted",
                className
              )}
              disabled={disabled}
              variant="outline"
            >
              <span className="min-w-0 truncate text-left">
                <TextMorph as="span" duration={220} respectReducedMotion>
                  {summary}
                </TextMorph>
              </span>
              <ChevronDown
                aria-hidden="true"
                className="ml-2 size-4 shrink-0 text-code-muted transition-transform duration-150 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] min-w-[min(14rem,calc(100vw-2rem))] p-1 dark:ring-1 dark:ring-code-line/55"
          >
            <Command>
              <CommandInput
                aria-label={`Search ${ariaLabel}`}
                placeholder={searchPlaceholder}
              />
              <CommandList
                aria-label={ariaLabel}
                aria-multiselectable="true"
                className="max-h-[min(24rem,calc(var(--radix-popover-content-available-height)-7rem))]"
              >
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                {groupedOptions.map((group) => (
                  <CommandGroup
                    heading={group.name === "Options" ? undefined : group.name}
                    key={group.name}
                  >
                    {group.items.map((option) => {
                      const selected = selectedValues.includes(option.value)
                      const limitDisabled = !selected && atLimit
                      const optionDisabled =
                        disabled || option.disabled || limitDisabled
                      const keywords = [
                        option.label,
                        ...(option.keywords ?? []),
                        ...(option.group ? [option.group] : []),
                      ]

                      return (
                        <CommandItem
                          aria-checked={selected}
                          disabled={optionDisabled}
                          key={option.value}
                          keywords={keywords}
                          onSelect={() => toggleOption(option)}
                          value={option.value}
                        >
                          <Checkbox
                            aria-hidden="true"
                            checked={selected}
                            className="pointer-events-none motion-reduce:transition-none"
                            disabled={optionDisabled}
                            tabIndex={-1}
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {option.label}
                          </span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                ))}
              </CommandList>
              {selectedValues.length > 0 || atLimit ? (
                <div className="mt-1 flex min-h-10 items-center justify-between gap-3 px-2 pt-1">
                  <span
                    className="min-w-0 truncate text-xs text-code-muted"
                    role="status"
                  >
                    {selectionLimit === 0
                      ? "No selections allowed"
                      : selectionLimit !== undefined
                        ? `${selectedValues.length} of ${selectionLimit} selected`
                        : `${selectedValues.length} selected`}
                  </span>
                  {selectedValues.length > 0 ? (
                    <Button
                      className="shrink-0 px-2 text-code-muted motion-reduce:active:scale-100"
                      disabled={disabled}
                      onClick={clearSelection}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      {clearLabel}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </Command>
          </PopoverContent>
          {name
            ? selectedValues.map((selectedValue) => (
                <input
                  key={selectedValue}
                  disabled={disabled}
                  form={form}
                  name={name}
                  type="hidden"
                  value={selectedValue}
                />
              ))
            : null}
        </>
      )}
    </MultiSelectOpenState>
  )
}

export { MultiSelect }
