import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
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

export type ComboboxOption = {
  value: string
  label: string
  keywords?: string[]
  group?: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: readonly ComboboxOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  clearLabel?: string
  ariaLabel?: string
  id?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  /** Submit the selected value with a native form. */
  name?: string
  /** Associate the value with a form outside this component's DOM parent. */
  form?: string
  disabled?: boolean
  className?: string
}

function Combobox({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search options",
  emptyMessage = "No options found",
  clearLabel = "Clear selection",
  ariaLabel = placeholder,
  id,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  name,
  form,
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    if (!disabled) return
    const frame = window.requestAnimationFrame(() => setOpen(false))
    return () => window.cancelAnimationFrame(frame)
  }, [disabled])
  const [internalValue, setInternalValue] = React.useState<string | null>(
    defaultValue
  )
  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : internalValue
  const isOpen = open && !disabled
  const selectedOption = options.find(
    (option) => option.value === selectedValue
  )
  const searchLabel =
    ariaLabel === placeholder ? "Search options" : `Search ${ariaLabel}`
  const groupedOptions = React.useMemo(() => {
    const groups = new Map<string, ComboboxOption[]>()
    for (const option of options) {
      const groupName = option.group ?? "Options"
      const group = groups.get(groupName) ?? []
      group.push(option)
      groups.set(groupName, group)
    }
    return Array.from(groups, ([name, items]) => ({ name, items }))
  }, [options])

  const selectValue = (nextValue: string | null) => {
    if (!isControlled) setInternalValue(nextValue)
    onValueChange?.(nextValue)
    setOpen(false)
  }

  return (
    <>
      <Popover
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (!disabled) setOpen(nextOpen)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            aria-label={
              ariaLabelledBy
                ? undefined
                : selectedOption
                  ? `${ariaLabel}: ${selectedOption.label}`
                  : ariaLabel
            }
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={cn(
              "group/combobox min-h-10 w-full justify-between border-code-line/55 bg-code-surface px-3 font-normal text-code-ink hover:bg-code-surface aria-expanded:border-code-accent/40 aria-expanded:bg-code-accent-soft/35",
              !selectedOption && "text-code-muted",
              className
            )}
            disabled={disabled}
            role="combobox"
            variant="outline"
          >
            <span className="truncate text-left">
              <TextMorph as="span" duration={220} respectReducedMotion>
                {selectedOption?.label ?? placeholder}
              </TextMorph>
            </span>
            <ChevronDown
              aria-hidden="true"
              data-combobox-chevron=""
              className="ml-2 size-4 shrink-0 text-code-muted transition-transform duration-150 group-data-[state=open]/combobox:rotate-180 motion-reduce:transition-none"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] min-w-[min(14rem,calc(100vw-2rem))] bg-code-surface-raised p-1 dark:ring-1 dark:ring-code-line/55"
        >
          <Command>
            <CommandInput
              aria-label={searchLabel}
              placeholder={searchPlaceholder}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {groupedOptions.map((group) => (
                <CommandGroup
                  heading={group.name === "Options" ? undefined : group.name}
                  key={group.name}
                >
                  {group.items.map((option) => (
                    <CommandItem
                      disabled={option.disabled}
                      key={option.value}
                      keywords={[
                        option.label,
                        ...(option.keywords ?? []),
                        ...(option.group ? [option.group] : []),
                      ]}
                      onSelect={() => selectValue(option.value)}
                      value={option.value}
                    >
                      <span className="truncate">{option.label}</span>
                      <Check
                        aria-hidden="true"
                        className={cn(
                          "ml-auto size-4 shrink-0 text-code-accent transition-opacity duration-150 motion-reduce:transition-none",
                          selectedValue === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              {selectedValue !== null ? (
                <CommandGroup className="mt-1 border-t border-code-line/55 pt-1">
                  <CommandItem onSelect={() => selectValue(null)}>
                    {clearLabel}
                  </CommandItem>
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {name ? (
        <input
          disabled={disabled}
          form={form}
          name={name}
          type="hidden"
          value={selectedValue ?? ""}
        />
      ) : null}
    </>
  )
}

export { Combobox }
