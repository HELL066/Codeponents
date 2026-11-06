import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { Calendar } from "@/components/ui/calendar"

it("navigates to the next month and reports the new visible month", async () => {
  const user = userEvent.setup()
  const onMonthChange = vi.fn()

  render(
    <Calendar
      defaultMonth={new Date(2024, 0, 15)}
      locale="en-US"
      onMonthChange={onMonthChange}
      showToday={false}
    />
  )

  expect(
    screen.getByRole("heading", { name: "January 2024" })
  ).toBeInTheDocument()
  await user.click(screen.getByRole("button", { name: "Next month" }))

  expect(
    await screen.findByRole("heading", { name: "February 2024" })
  ).toBeInTheDocument()
  expect(onMonthChange).toHaveBeenCalledWith(new Date(2024, 1, 1, 12))
})

it("selects a date from the visible month", async () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()

  render(
    <Calendar
      defaultMonth={new Date(2024, 0, 15)}
      locale="en-US"
      onSelect={onSelect}
      showToday={false}
    />
  )

  await user.click(screen.getByRole("gridcell", { name: "January 17, 2024" }))

  expect(onSelect).toHaveBeenCalledWith(new Date(2024, 0, 17, 12))
  expect(
    screen.getByRole("gridcell", { name: "January 17, 2024" })
  ).toHaveAttribute("aria-selected", "true")
})

it("disables dates before the minimum date", () => {
  render(
    <Calendar
      defaultMonth={new Date(2024, 0, 15)}
      locale="en-US"
      minDate={new Date(2024, 0, 10)}
      showToday={false}
    />
  )

  expect(
    screen.getByRole("gridcell", { name: "January 9, 2024" })
  ).toBeDisabled()
  expect(
    screen.getByRole("gridcell", { name: "January 10, 2024" })
  ).toBeEnabled()
})

it("moves keyboard focus to the next date with the right arrow", async () => {
  const user = userEvent.setup()

  render(
    <Calendar
      defaultMonth={new Date(2024, 0, 15)}
      locale="en-US"
      showToday={false}
    />
  )

  const januaryFifteenth = screen.getByRole("gridcell", {
    name: "January 15, 2024",
  })
  januaryFifteenth.focus()
  await user.keyboard("{ArrowRight}")

  await waitFor(() =>
    expect(document.activeElement).toBe(
      screen.getByRole("gridcell", { name: "January 16, 2024" })
    )
  )
})
