import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type DataTableColumn<Row> = {
  id: string
  header: React.ReactNode
  sortLabel?: string
  cell: (row: Row) => React.ReactNode
  sortValue?: (row: Row) => string | number | Date | null | undefined
  align?: "start" | "end"
}

export interface DataTableProps<Row> {
  columns: readonly DataTableColumn<Row>[]
  rows: readonly Row[]
  rowKey: (row: Row) => React.Key
  "aria-label": string
  caption?: string
  emptyMessage?: React.ReactNode
  className?: string
  /** Returns searchable text for a row. Providing it adds a client-side search field. */
  searchBy?: (row: Row) => string
  /** Placeholder for the search field shown when `searchBy` is provided. */
  searchPlaceholder?: string
  /** Rows per page. A positive value adds previous and next controls. */
  pageSize?: number
  /** Adds row selection checkboxes and a selected count. */
  selectable?: boolean
  /** Called when selection changes, with selected keys and matching rows in source order. */
  onSelectionChange?: (
    selectedKeys: readonly React.Key[],
    selectedRows: readonly Row[]
  ) => void
  /** Provides a human-readable row name for its selection checkbox. */
  getRowLabel?: (row: Row) => string
}

type SortState = {
  id: string
  direction: "ascending" | "descending"
}

function compareValues(
  left: string | number | Date | null | undefined,
  right: string | number | Date | null | undefined
) {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime()
  }
  if (typeof left === "number" && typeof right === "number") {
    return left - right
  }
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

function DataTable<Row>({
  columns,
  rows,
  rowKey,
  "aria-label": ariaLabel,
  caption,
  emptyMessage = "No rows to display",
  className,
  searchBy,
  searchPlaceholder = "Search rows",
  pageSize,
  selectable = false,
  onSelectionChange,
  getRowLabel,
}: DataTableProps<Row>) {
  const [sort, setSort] = React.useState<SortState | null>(null)
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [selectedKeys, setSelectedKeys] = React.useState<readonly React.Key[]>(
    []
  )
  const reduceMotion = useReducedMotion()
  const rowTransition = reduceMotion
    ? { duration: 0 }
    : {
        layout: { type: "spring" as const, duration: 0.3, bounce: 0 },
        y: { duration: 0.22, ease: "easeOut" as const },
      }
  const rowInitial = reduceMotion ? false : { y: 4 }
  const tableId = React.useId()
  const searchId = React.useId()
  const pageLimit =
    pageSize != null && Number.isFinite(pageSize) && pageSize > 0
      ? Math.max(1, Math.floor(pageSize))
      : undefined

  const filteredRows = React.useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!searchBy || !normalizedQuery) return rows
    return rows.filter((row) =>
      searchBy(row).toLocaleLowerCase().includes(normalizedQuery)
    )
  }, [query, rows, searchBy])

  const sortedRows = React.useMemo(() => {
    if (!sort) return filteredRows
    const column = columns.find((item) => item.id === sort.id)
    if (!column?.sortValue) return filteredRows
    const factor = sort.direction === "ascending" ? 1 : -1
    return filteredRows
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        const left = column.sortValue?.(a.row)
        const right = column.sortValue?.(b.row)
        if (left == null || right == null) {
          if (left == null && right == null) return a.index - b.index
          return left == null ? 1 : -1
        }
        const result = factor * compareValues(left, right)
        return result || a.index - b.index
      })
      .map(({ row }) => row)
  }, [columns, filteredRows, sort])

  const pageCount = pageLimit
    ? Math.max(1, Math.ceil(sortedRows.length / pageLimit))
    : 1
  const currentPage = Math.min(page, pageCount)
  const visibleRows = pageLimit
    ? sortedRows.slice((currentPage - 1) * pageLimit, currentPage * pageLimit)
    : sortedRows
  const pageKeys = visibleRows.map(rowKey)
  const currentRowKeys = new Set(rows.map(rowKey))
  const currentSelection = selectedKeys.filter((key) => currentRowKeys.has(key))
  const selectedKeySet = new Set(currentSelection)
  const allPageSelected =
    pageKeys.length > 0 && pageKeys.every((key) => selectedKeySet.has(key))
  const somePageSelected = pageKeys.some((key) => selectedKeySet.has(key))

  const toggleSort = (column: DataTableColumn<Row>) => {
    if (!column.sortValue) return
    setSort((current) => ({
      id: column.id,
      direction:
        current?.id === column.id && current.direction === "ascending"
          ? "descending"
          : "ascending",
    }))
  }

  const updateSelection = (nextKeys: readonly React.Key[]) => {
    const uniqueKeys = [...new Set(nextKeys)]
    setSelectedKeys(uniqueKeys)
    const nextSet = new Set(uniqueKeys)
    onSelectionChange?.(
      uniqueKeys,
      rows.filter((row) => nextSet.has(rowKey(row)))
    )
  }

  const togglePageSelection = (checked: boolean) => {
    if (checked) {
      updateSelection([...currentSelection, ...pageKeys])
      return
    }
    const pageKeySet = new Set(pageKeys)
    updateSelection(currentSelection.filter((key) => !pageKeySet.has(key)))
  }

  const toggleRowSelection = (row: Row, checked: boolean) => {
    const key = rowKey(row)
    updateSelection(
      checked
        ? [...currentSelection, key]
        : currentSelection.filter((selectedKey) => selectedKey !== key)
    )
  }

  const firstVisibleRow = sortedRows.length
    ? (currentPage - 1) * (pageLimit ?? 0) + 1
    : 0
  const lastVisibleRow = pageLimit
    ? Math.min(currentPage * pageLimit, sortedRows.length)
    : sortedRows.length

  return (
    <div className={cn("w-full min-w-0", className)}>
      {searchBy ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-72">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-code-muted"
            />
            <Input
              aria-label={`Search ${ariaLabel}`}
              aria-controls={tableId}
              className="pr-10 pl-9"
              id={searchId}
              onKeyDown={(event) => {
                if (event.key !== "Escape" || !query) return
                event.preventDefault()
                event.stopPropagation()
                setQuery("")
                setPage(1)
              }}
              onChange={(event) => {
                setQuery(event.currentTarget.value)
                setPage(1)
              }}
              placeholder={searchPlaceholder}
              role="searchbox"
              type="text"
              value={query}
            />
            {query ? (
              <Button
                aria-label="Clear search"
                className="absolute top-0 right-0"
                onClick={() => {
                  setQuery("")
                  setPage(1)
                }}
                size="icon-lg"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" />
              </Button>
            ) : null}
          </div>
          {query.trim() ? (
            <span aria-atomic="true" aria-live="polite" className="sr-only">
              {filteredRows.length}{" "}
              {filteredRows.length === 1 ? "result" : "results"}
            </span>
          ) : null}
        </div>
      ) : null}
      <Table aria-label={ariaLabel} id={tableId}>
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10 px-1">
                <label className="inline-flex size-10 cursor-pointer items-center justify-center">
                  <Checkbox
                    aria-label="Select all rows on this page"
                    checked={
                      allPageSelected
                        ? true
                        : somePageSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(checked) =>
                      togglePageSelection(checked === true)
                    }
                  />
                </label>
              </TableHead>
            ) : null}
            {columns.map((column) => {
              const activeSort =
                sort?.id === column.id ? sort.direction : undefined
              const SortIcon =
                activeSort === "ascending"
                  ? ArrowUp
                  : activeSort === "descending"
                    ? ArrowDown
                    : ArrowUpDown
              return (
                <TableHead
                  aria-sort={activeSort}
                  className={column.align === "end" ? "text-right" : undefined}
                  key={column.id}
                  scope="col"
                >
                  {column.sortValue ? (
                    <button
                      aria-label={
                        (activeSort ? "Sort " : "Sort by ") +
                        (column.sortLabel ?? column.id) +
                        (activeSort === "ascending"
                          ? " descending"
                          : activeSort === "descending"
                            ? " ascending"
                            : "")
                      }
                      className={cn(
                        "group/table-sort inline-flex min-h-10 w-full items-center gap-2 rounded-sm transition-colors hover:text-code-ink focus-visible:ring-2 focus-visible:ring-code-accent/35 focus-visible:outline-none",
                        column.align === "end"
                          ? "justify-end text-right"
                          : "justify-start text-left"
                      )}
                      onClick={() => toggleSort(column)}
                      type="button"
                    >
                      {column.header}
                      <span
                        aria-hidden="true"
                        className="inline-flex size-3.5 shrink-0"
                      >
                        <AnimatePresence initial={false} mode="wait">
                          <motion.span
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            className="inline-flex size-3.5 items-center justify-center"
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : {
                                    opacity: 0,
                                    scale: 0.25,
                                    filter: "blur(4px)",
                                  }
                            }
                            initial={
                              reduceMotion
                                ? false
                                : {
                                    opacity: 0,
                                    scale: 0.25,
                                    filter: "blur(4px)",
                                  }
                            }
                            key={activeSort ?? "unsorted"}
                            transition={
                              reduceMotion
                                ? { duration: 0 }
                                : {
                                    type: "spring",
                                    duration: 0.3,
                                    bounce: 0,
                                  }
                            }
                          >
                            <SortIcon
                              className={cn(
                                "size-3.5 transition-colors group-hover/table-sort:text-code-accent group-focus-visible/table-sort:text-code-accent motion-reduce:transition-none",
                                activeSort
                                  ? "text-code-accent"
                                  : "text-code-muted"
                              )}
                            />
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence initial={false}>
            {visibleRows.length ? (
              visibleRows.map((row) => {
                const key = rowKey(row)
                const isSelected = selectedKeySet.has(key)
                return (
                  <motion.tr
                    animate={{ y: 0 }}
                    className="transition-colors duration-150 ease-out hover:bg-code-quiet/35 data-[selected=true]:bg-code-accent-soft/35 motion-reduce:transition-none"
                    data-selected={isSelected || undefined}
                    data-slot="table-row"
                    initial={rowInitial}
                    key={key}
                    layout={reduceMotion ? false : "position"}
                    transition={rowTransition}
                  >
                    {selectable ? (
                      <TableCell className="w-10 px-1">
                        <label className="inline-flex size-10 cursor-pointer items-center justify-center">
                          <Checkbox
                            aria-label={`Select ${getRowLabel?.(row) ?? String(key)}`}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              toggleRowSelection(row, checked === true)
                            }
                          />
                        </label>
                      </TableCell>
                    ) : null}
                    {columns.map((column) => (
                      <TableCell
                        className={
                          column.align === "end" ? "text-right" : undefined
                        }
                        key={column.id}
                      >
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </motion.tr>
                )
              })
            ) : (
              <motion.tr
                animate={{ y: 0 }}
                initial={rowInitial}
                key="empty-state"
                layout={reduceMotion ? false : "position"}
                transition={rowTransition}
              >
                <TableCell
                  className="h-24 text-center text-code-muted"
                  colSpan={columns.length + (selectable ? 1 : 0)}
                >
                  <span role="status">
                    {query.trim() ? "No matching rows" : emptyMessage}
                  </span>
                </TableCell>
              </motion.tr>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
      {selectable || pageLimit ? (
        <div className="flex min-h-12 items-center justify-between gap-3 border-t border-code-line/35 px-3 py-1">
          <div className="flex min-w-0 items-center gap-3 text-sm text-code-muted">
            {selectable && currentSelection.length ? (
              <>
                <span aria-live="polite" className="tabular-nums">
                  <TextMorph
                    as="span"
                    duration={220}
                    numbers
                    respectReducedMotion
                  >
                    {currentSelection.length}
                  </TextMorph>{" "}
                  selected
                </span>
                <Button
                  className="min-h-9 px-2"
                  onClick={() => updateSelection([])}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Clear selection
                </Button>
              </>
            ) : null}
          </div>
          {pageLimit ? (
            <div className="ml-auto flex items-center gap-1">
              <span
                aria-atomic="true"
                aria-live="polite"
                className="mr-1 text-sm text-code-muted tabular-nums"
              >
                <TextMorph
                  as="span"
                  duration={220}
                  numbers
                  respectReducedMotion
                >
                  {firstVisibleRow}–{lastVisibleRow} of {sortedRows.length}
                </TextMorph>
              </span>
              <Button
                aria-controls={tableId}
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => {
                  setPage(currentPage - 1)
                }}
                size="icon-lg"
                type="button"
                variant="ghost"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                aria-controls={tableId}
                aria-label="Next page"
                disabled={currentPage >= pageCount}
                onClick={() => {
                  setPage(currentPage + 1)
                }}
                size="icon-lg"
                type="button"
                variant="ghost"
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { DataTable }
