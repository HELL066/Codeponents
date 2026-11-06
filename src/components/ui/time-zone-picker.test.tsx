import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import { TimeZonePicker } from "@/components/ui/time-zone-picker"

it("finds a zone by city name and exposes the selected value", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()

  render(
    <form aria-label="Settings">
      <TimeZonePicker
        aria-label="Time zone"
        name="timeZone"
        onValueChange={onValueChange}
        options={[
          {
            value: "America/Los_Angeles",
            label: "Los Angeles",
          },
          { value: "Asia/Manila", label: "Manila" },
        ]}
        referenceDate={new Date("2024-01-15T12:00:00.000Z")}
      />
    </form>
  )

  await user.click(screen.getByRole("combobox", { name: "Time zone" }))
  await user.type(
    screen.getByPlaceholderText("Search city or time zone"),
    "Los Angeles"
  )
  await user.click(await screen.findByRole("option", { name: /Los Angeles/ }))

  const trigger = screen.getByRole("combobox", { name: "Time zone" })
  expect(trigger).toHaveTextContent("Los Angeles")
  expect(trigger).toHaveTextContent("UTC−08:00")
  expect(onValueChange).toHaveBeenCalledWith("America/Los_Angeles")
  expect(
    new FormData(
      screen.getByRole("form", { name: "Settings" }) as HTMLFormElement
    ).get("timeZone")
  ).toBe("America/Los_Angeles")
})

it("finds a zone by its IANA identifier", async () => {
  const user = userEvent.setup()

  render(
    <TimeZonePicker
      aria-label="Time zone"
      options={[
        { value: "America/Los_Angeles", label: "Los Angeles" },
        { value: "Asia/Manila", label: "Manila" },
      ]}
    />
  )

  await user.click(screen.getByRole("combobox", { name: "Time zone" }))
  await user.type(
    screen.getByPlaceholderText("Search city or time zone"),
    "America/Los_Angeles"
  )

  expect(
    await screen.findByRole("option", { name: /Los Angeles/ })
  ).toBeVisible()
})

it("clears an optional selection from the control and form value", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()

  render(
    <form aria-label="Settings">
      <TimeZonePicker
        aria-label="Time zone"
        defaultValue="Asia/Manila"
        name="timeZone"
        onValueChange={onValueChange}
        options={[{ value: "Asia/Manila", label: "Manila" }]}
      />
    </form>
  )

  await user.click(screen.getByRole("combobox", { name: "Time zone" }))
  await user.click(screen.getByRole("option", { name: "Clear time zone" }))

  expect(screen.getByRole("combobox", { name: "Time zone" })).toHaveTextContent(
    "Choose a time zone"
  )
  expect(onValueChange).toHaveBeenCalledWith(null)
  expect(
    new FormData(
      screen.getByRole("form", { name: "Settings" }) as HTMLFormElement
    ).get("timeZone")
  ).toBe("")
})

it("does not open when disabled", () => {
  render(
    <TimeZonePicker
      aria-label="Time zone"
      disabled
      options={[{ value: "Asia/Manila", label: "Manila" }]}
    />
  )

  expect(screen.getByRole("combobox", { name: "Time zone" })).toBeDisabled()
})

it("shows a validation error for a required empty value", async () => {
  render(
    <form aria-label="Settings">
      <TimeZonePicker
        aria-label="Time zone"
        name="timeZone"
        options={[{ value: "Asia/Manila", label: "Manila" }]}
        required
      />
    </form>
  )

  const form = screen.getByRole("form", { name: "Settings" }) as HTMLFormElement
  expect(form.checkValidity()).toBe(false)

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Choose a time zone"
  )
  expect(screen.getByRole("combobox", { name: "Time zone" })).toHaveAttribute(
    "aria-invalid",
    "true"
  )
})
