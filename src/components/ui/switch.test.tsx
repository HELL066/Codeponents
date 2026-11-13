import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { Switch } from "@/components/ui/switch"
import { ThemeSwitch } from "@/components/ui/theme-switch"

const appearanceThemes = [
  { value: "light", label: "Light", icon: <span>sun</span> },
  { value: "dark", label: "Dark", icon: <span>moon</span> },
] as const

it("behaves as a standard setting switch", async () => {
  const user = userEvent.setup()
  const onCheckedChange = vi.fn()

  render(
    <Switch
      animation="bouncy"
      aria-label="Current items only"
      defaultChecked={false}
      onCheckedChange={onCheckedChange}
    />
  )

  const control = screen.getByRole("switch", { name: "Current items only" })
  expect(control).toHaveAttribute("aria-checked", "false")

  await user.click(control)

  expect(control).toHaveAttribute("aria-checked", "true")
  expect(onCheckedChange).toHaveBeenCalledWith(true)
})

it("switches between configured theme values and icons", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()

  render(
    <ThemeSwitch
      animation="smooth"
      aria-label="Appearance"
      defaultValue="light"
      onValueChange={onValueChange}
      themes={appearanceThemes}
    />
  )

  const control = screen.getByRole("switch", { name: "Appearance" })
  expect(control).toHaveAttribute("aria-checked", "false")
  expect(control).toHaveClass("w-12")
  expect(control.querySelector('[data-slot="switch-track"]')).toHaveClass(
    "h-7",
    "w-12"
  )
  expect(control.querySelector('[data-slot="switch-thumb"]')).toHaveClass(
    "size-5"
  )
  expect(control.querySelector('[data-theme-icon="light"]')).toBeInTheDocument()
  expect(control.querySelector('[data-theme-icon="light"]')).toHaveClass(
    "size-3"
  )

  await user.click(control)

  expect(control).toHaveAttribute("aria-checked", "true")
  expect(onValueChange).toHaveBeenCalledWith("dark")
  expect(control.querySelector('[data-theme-icon="dark"]')).toBeInTheDocument()
})
