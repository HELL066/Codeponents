import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { AdvancedSpecimen } from "@/components/showcase/advanced-specimens"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

it("shows the toggle's pressed state clearly and accessibly", async () => {
  const user = userEvent.setup()

  render(<Toggle>Bold</Toggle>)

  const toggle = screen.getByRole("button", { name: "Bold" })
  expect(toggle).toHaveAttribute("aria-pressed", "false")
  expect(toggle).toHaveClass("active:scale-[0.94]", "active:translate-y-px")

  await user.click(toggle)

  expect(toggle).toHaveAttribute("aria-pressed", "true")
})

it("uses icon-only formatting toggles to update a live text preview", async () => {
  const user = userEvent.setup()

  render(<AdvancedSpecimen entryId="toggle" />)

  const group = screen.getByRole("group", { name: "Text formatting" })
  const status = screen.getByRole("status")
  const sample = screen.getByText(
    "A thoughtful interface makes everyday work feel lighter."
  )
  const bold = screen.getByRole("button", { name: "Bold" })
  const italic = screen.getByRole("button", { name: "Italic" })
  const underline = screen.getByRole("button", { name: "Underline" })

  expect(group.className).toContain("border-b")
  expect(bold).toHaveClass("size-11", "p-0")
  expect(bold).toHaveAttribute("title", "Bold")
  expect(bold.querySelector("svg")).toBeInTheDocument()
  expect(bold).toHaveTextContent(/^$/)
  expect(italic).toHaveTextContent(/^$/)
  expect(underline).toHaveTextContent(/^$/)
  expect(bold).toHaveAttribute("aria-pressed", "true")
  expect(sample).toHaveClass("font-bold")
  expect(status).toHaveTextContent("Bold")

  await user.click(bold)
  await user.click(italic)
  await user.click(underline)

  expect(bold).toHaveAttribute("aria-pressed", "false")
  expect(italic).toHaveAttribute("aria-pressed", "true")
  expect(underline).toHaveAttribute("aria-pressed", "true")
  expect(sample).not.toHaveClass("font-bold")
  expect(sample).toHaveClass("italic", "underline")
  expect(status).toHaveTextContent("Italic + Underline")
})

it("moves selection between single toggle group items", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()

  render(
    <ToggleGroup
      aria-label="Calendar view"
      defaultValue="month"
      onValueChange={onValueChange}
      type="single"
    >
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
    </ToggleGroup>
  )

  const month = screen.getByRole("radio", { name: "Month" })
  const list = screen.getByRole("radio", { name: "List" })

  expect(month).toHaveAttribute("aria-checked", "true")
  expect(list).toHaveAttribute("aria-checked", "false")
  expect(month).toHaveClass("data-[state=on]:text-code-ink")
  expect(month).not.toHaveClass("data-[state=on]:bg-code-surface")
  const monthIndicator = month.querySelector(
    '[data-slot="toggle-group-indicator"]'
  )
  expect(monthIndicator).toHaveClass("inset-0", "rounded-md", "bg-code-surface")
  expect(
    monthIndicator?.querySelector('[data-slot="toggle-group-underline"]')
  ).toHaveClass("inset-x-3", "bottom-1", "h-0.5", "bg-code-accent/70")
  expect(
    list.querySelector('[data-slot="toggle-group-indicator"]')
  ).not.toBeInTheDocument()

  await user.click(list)

  expect(month).toHaveAttribute("aria-checked", "false")
  expect(list).toHaveAttribute("aria-checked", "true")
  expect(
    month.querySelector('[data-slot="toggle-group-indicator"]')
  ).not.toBeInTheDocument()
  const listIndicator = list.querySelector(
    '[data-slot="toggle-group-indicator"]'
  )
  expect(listIndicator).toHaveClass("inset-0", "rounded-md", "bg-code-surface")
  expect(
    listIndicator?.querySelector('[data-slot="toggle-group-underline"]')
  ).toHaveClass("inset-x-3", "bottom-1", "h-0.5", "bg-code-accent/70")
  expect(onValueChange).toHaveBeenCalledWith("list")
})
