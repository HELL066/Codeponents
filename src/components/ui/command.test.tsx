import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it } from "vitest"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  firstLibraryCommandMatch,
  libraryCommandActions,
  matchesLibraryCommandAction,
} from "@/components/showcase/library-data"

function SearchFixture() {
  const [query, setQuery] = useState("")
  const [selectedValue, setSelectedValue] = useState<string>(
    firstLibraryCommandMatch("")
  )
  const showGalleryAction = matchesLibraryCommandAction(
    libraryCommandActions[0],
    query
  )

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery)
    setSelectedValue(firstLibraryCommandMatch(nextQuery))
  }

  return (
    <CommandDialog
      commandProps={{
        onValueChange: setSelectedValue,
        shouldFilter: false,
        value: selectedValue,
      }}
      open
      title="Search actions"
    >
      <CommandInput
        aria-label="Search components and actions"
        onValueChange={handleQueryChange}
        placeholder="Search components and actions"
        value={query}
      />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        {showGalleryAction ? (
          <CommandGroup heading="Actions">
            <CommandItem value={libraryCommandActions[0].value}>
              Component gallery
            </CommandItem>
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  )
}

it("restores command results after clearing a query with no matches", async () => {
  const user = userEvent.setup()

  render(<SearchFixture />)

  const input = screen.getByPlaceholderText("Search components and actions")
  await user.type(input, "zzznomatches")

  expect(screen.getByText("No matches.")).toBeVisible()

  await user.clear(input)

  expect(input).toHaveValue("")
  expect(
    await screen.findByRole("option", { name: "Component gallery" })
  ).toBeVisible()
})
