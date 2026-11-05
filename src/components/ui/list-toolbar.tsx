import * as React from "react"
import { Search } from "lucide-react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ListToolbarSearch {
  value: string
  onValueChange: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
}

export interface ListToolbarSelection {
  count: number
  onClear?: () => void
  actions?: React.ReactNode
  label?: string
}

export interface ListToolbarProps {
  /** Accessible name for the group of list controls. */
  "aria-label"?: string
  /** Optional controlled search field. */
  search?: ListToolbarSearch
  /** Filter controls, commonly Select, Combobox, or ToggleGroup. */
  filters?: React.ReactNode
  /** Optional summary of the active filters. Render as concise text or removable controls. */
  activeFilters?: React.ReactNode
  /** Adds a clear-filters action beside the active-filter summary. */
  onClearFilters?: () => void
  /** Optional sort and view controls. */
  sort?: React.ReactNode
  view?: React.ReactNode
  /** Primary list-level actions, such as creating or exporting an item. */
  actions?: React.ReactNode
  /** Replaces the trailing controls with selection actions while rows are selected. */
  selection?: ListToolbarSelection
  className?: string
}

/** A compact, composable control row for searchable and filterable lists. */
function ListToolbar({
  "aria-label": ariaLabel = "List controls",
  search,
  filters,
  activeFilters,
  onClearFilters,
  sort,
  view,
  actions,
  selection,
  className,
}: ListToolbarProps) {
  const searchId = React.useId()
  const hasSelection = Boolean(selection && selection.count > 0)
  const hasTrailingControls = Boolean(sort || view || actions)

  return (
    <div
      aria-label={ariaLabel}
      className={cn("grid min-w-0 gap-2.5", className)}
      data-slot="list-toolbar"
      role="group"
    >
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {search ? (
          <div className="relative w-full min-w-0 sm:w-auto sm:min-w-52 sm:max-w-80 sm:flex-1">
            <label className="sr-only" htmlFor={searchId}>
              {search.label ?? "Search list"}
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-code-muted"
            />
            <Input
              autoComplete="off"
              className="pl-9"
              disabled={search.disabled}
              id={searchId}
              onChange={(event) => search.onValueChange(event.currentTarget.value)}
              placeholder={search.placeholder ?? "Search"}
              role="searchbox"
              type="search"
              value={search.value}
            />
          </div>
        ) : null}

        {filters ? (
          <div
            aria-label="Filters"
            className="flex min-w-0 flex-wrap items-center gap-2"
            role="group"
          >
            {filters}
          </div>
        ) : null}

        {hasTrailingControls || hasSelection ? (
          <div
            aria-label={hasSelection ? "Selected items" : "List actions"}
            className="flex min-w-0 flex-wrap items-center gap-2 sm:ml-auto sm:justify-end"
            role="group"
          >
            {hasSelection ? (
              <>
                <span
                  aria-live="polite"
                  className="inline-flex min-h-10 items-center gap-1.5 text-sm text-code-muted"
                >
                  <span className="inline-grid min-w-[3ch] place-items-end tabular-nums">
                    <TextMorph
                      as="span"
                      duration={180}
                      numbers
                      respectReducedMotion
                    >
                      {selection?.count ?? 0}
                    </TextMorph>
                  </span>{" "}
                  {selection?.label ?? "selected"}
                </span>
                {selection?.onClear ? (
                  <Button
                    className="min-h-10"
                    onClick={selection.onClear}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    Clear selection
                  </Button>
                ) : null}
                {selection?.actions}
              </>
            ) : (
              <>
                {sort}
                {view}
                {actions}
              </>
            )}
          </div>
        ) : null}
      </div>

      {activeFilters ? (
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <div className="min-w-0 flex-1 text-code-muted">{activeFilters}</div>
          {onClearFilters ? (
            <Button
              className="min-h-10 shrink-0 px-2"
              onClick={onClearFilters}
              size="sm"
              type="button"
              variant="ghost"
            >
              Clear filters
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { ListToolbar }
