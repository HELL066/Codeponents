import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it } from "vitest"
import { TreeView } from "@/components/ui/tree-view"

const items = [
  {
    id: "library",
    label: "Library",
    children: [
      {
        id: "guides",
        label: "Guides",
        children: [{ id: "getting-started", label: "Getting started" }],
      },
    ],
  },
]

it("keeps collapsed descendants out of the accessibility tree", async () => {
  const user = userEvent.setup()

  render(
    <TreeView
      aria-label="Library items"
      defaultExpandedIds={["library"]}
      items={items}
    />
  )

  const library = screen.getByRole("treeitem", { name: "Library" })
  expect(library).toHaveAttribute("aria-expanded", "true")

  await user.click(screen.getByText("Library"))

  expect(library).toHaveAttribute("aria-expanded", "false")
  expect(
    screen.queryByRole("treeitem", { name: "Guides" })
  ).not.toBeInTheDocument()
})

it("expands with the keyboard and moves focus into the branch", async () => {
  const user = userEvent.setup()

  render(<TreeView aria-label="Library items" items={items} />)

  const library = screen.getByRole("treeitem", { name: "Library" })
  library.focus()
  await user.keyboard("{ArrowRight}")

  const guides = await screen.findByRole("treeitem", { name: "Guides" })
  await waitFor(() => expect(guides).toHaveFocus())
})
