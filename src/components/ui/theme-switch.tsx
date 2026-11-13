import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import {
  SwitchTrack,
  switchRootClassName,
  type SwitchAnimation,
} from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export type ThemeSwitchTheme = {
  value: string
  label: string
  icon: React.ReactNode
}

type ThemeSwitchProps = Omit<
  React.ComponentProps<typeof SwitchPrimitive.Root>,
  "checked" | "defaultChecked" | "onCheckedChange" | "value"
> & {
  /** The two states represented by this switch, from off to on. */
  themes: readonly [ThemeSwitchTheme, ThemeSwitchTheme]
  /** The currently selected theme value. */
  value?: string
  /** The initially selected theme value for an uncontrolled switch. */
  defaultValue?: string
  /** Called with the newly selected theme value. */
  onValueChange?: (value: string) => void
  /** Controls how the thumb travels between states. */
  animation?: SwitchAnimation
}

function ThemeSwitch({
  animation = "smooth",
  className,
  defaultValue,
  onValueChange,
  themes,
  value,
  ...props
}: ThemeSwitchProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    () => defaultValue ?? themes[0].value
  )
  const selectedValue = value ?? uncontrolledValue
  const checked = selectedValue === themes[1].value

  const handleCheckedChange = (nextChecked: boolean) => {
    const nextValue = themes[nextChecked ? 1 : 0].value
    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <SwitchPrimitive.Root
      data-slot="theme-switch"
      className={cn(switchRootClassName, "w-12", className)}
      checked={checked}
      value={selectedValue}
      {...props}
      onCheckedChange={handleCheckedChange}
    >
      <SwitchTrack checked={checked} animation={animation} themes={themes} />
    </SwitchPrimitive.Root>
  )
}

export { ThemeSwitch }
