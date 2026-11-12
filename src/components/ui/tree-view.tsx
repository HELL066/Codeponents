import * as React from "react"
import { ChevronRight } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react"
import { cn } from "@/lib/utils"

export interface TreeViewItem {
  /** A unique id for this item within the tree. */
  id: string
  /** The visible item name. */
  label: string
  /** Nested items shown when this item is expanded. */
  children?: readonly TreeViewItem[]
  /** Optional supporting text announced with the item name. */
  description?: string
  /** Disabled items remain navigable, but cannot be selected or expanded. */
  disabled?: boolean
}

type TreeViewAccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: string; "aria-labelledby": string }

export type TreeViewProps = Omit<
  React.ComponentProps<"div">,
  "role" | "aria-label" | "aria-labelledby"
> &
  TreeViewAccessibleName & {
    /** Items in the tree. Each item's id must be unique. */
    items: readonly TreeViewItem[]
    /** Selected item id. Pass with `onValueChange` for controlled use. */
    value?: string
    /** Initial selected item id for uncontrolled use. */
    defaultValue?: string
    /** Called when an item is selected. */
    onValueChange?: (value: string) => void
    /** Expanded item ids. Pass with `onExpandedChange` for controlled use. */
    expandedIds?: readonly string[]
    /** Initially expanded item ids for uncontrolled use. */
    defaultExpandedIds?: readonly string[]
    /** Called when expanded items change. */
    onExpandedChange?: (expandedIds: string[]) => void
  }

interface FlatTreeItem {
  item: TreeViewItem
  parentId?: string
  level: number
}

function flattenVisibleItems(
  items: readonly TreeViewItem[],
  expanded: ReadonlySet<string>,
  parentId?: string,
  level = 1
): FlatTreeItem[] {
  return items.flatMap((item) => {
    const flatItem: FlatTreeItem = {
      item,
      parentId,
      level,
    }
    const descendants =
      item.children?.length && expanded.has(item.id)
        ? flattenVisibleItems(item.children, expanded, item.id, level + 1)
        : []

    return [flatItem, ...descendants]
  })
}

type TreeViewChildrenGroupProps = React.PropsWithChildren<{
  reduceMotion: boolean
}>

const TreeViewChildrenGroup = React.forwardRef<
  HTMLDivElement,
  TreeViewChildrenGroupProps
>(function TreeViewChildrenGroup({ children, reduceMotion }, ref) {
  const isPresent = useIsPresent()

  return (
    <motion.div
      ref={ref}
      aria-hidden={!isPresent || undefined}
      className="grid gap-0.5 pl-5"
      exit={{
        opacity: 0,
        y: reduceMotion ? 0 : -3,
        transition: {
          duration: reduceMotion ? 0 : 0.14,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      animate={{ opacity: 1, y: 0 }}
      inert={!isPresent}
      initial={reduceMotion ? false : { opacity: 0, y: -4 }}
      role="group"
      transition={{
        duration: reduceMotion ? 0 : 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
})

TreeViewChildrenGroup.displayName = "TreeViewChildrenGroup"

function TreeView({
  items,
  value,
  defaultValue,
  onValueChange,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
  className,
  ...props
}: TreeViewProps) {
  const treeId = React.useId()
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = prefersReducedMotion ?? false
  const itemRefs = React.useRef(new Map<string, HTMLDivElement>())
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = React.useState<
    string[]
  >([...(defaultExpandedIds ?? [])])
  const [focusedId, setFocusedId] = React.useState<string | undefined>(
    defaultValue
  )
  const typeahead = React.useRef("")
  const typeaheadTimer = React.useRef<number | null>(null)
  const selectedValue = value === undefined ? uncontrolledValue : value
  const expanded = new Set(expandedIds ?? uncontrolledExpandedIds)
  const visibleItems = flattenVisibleItems(items, expanded)
  const visibleIds = visibleItems.map(({ item }) => item.id)
  const activeId =
    (focusedId && visibleIds.includes(focusedId) && focusedId) ||
    (selectedValue && visibleIds.includes(selectedValue) && selectedValue) ||
    visibleIds[0]

  const focusItem = (id: string | undefined) => {
    if (!id) return
    setFocusedId(id)
    itemRefs.current.get(id)?.focus()
  }

  const selectItem = (id: string) => {
    if (value === undefined) setUncontrolledValue(id)
    onValueChange?.(id)
  }

  const setItemExpanded = (id: string, nextExpanded: boolean) => {
    const next = new Set(expanded)
    if (nextExpanded) next.add(id)
    else next.delete(id)
    const nextIds = [...next]

    if (expandedIds === undefined) setUncontrolledExpandedIds(nextIds)
    onExpandedChange?.(nextIds)
  }

  React.useEffect(
    () => () => {
      if (typeaheadTimer.current !== null) {
        window.clearTimeout(typeaheadTimer.current)
      }
    },
    []
  )

  const activateItem = (item: TreeViewItem) => {
    if (item.disabled) return
    selectItem(item.id)
    if (item.children?.length) setItemExpanded(item.id, !expanded.has(item.id))
  }

  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    node: FlatTreeItem
  ) => {
    const currentIndex = visibleIds.indexOf(node.item.id)
    const hasChildren = Boolean(node.item.children?.length)
    const isExpanded = expanded.has(node.item.id)

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        event.stopPropagation()
        focusItem(visibleIds[Math.min(currentIndex + 1, visibleIds.length - 1)])
        break
      case "ArrowUp":
        event.preventDefault()
        event.stopPropagation()
        focusItem(visibleIds[Math.max(currentIndex - 1, 0)])
        break
      case "ArrowRight":
        event.preventDefault()
        event.stopPropagation()
        if (hasChildren && !isExpanded && !node.item.disabled) {
          setItemExpanded(node.item.id, true)
          const firstChildId = node.item.children?.[0]?.id
          if (firstChildId) {
            window.requestAnimationFrame(() => {
              if (itemRefs.current.has(firstChildId)) focusItem(firstChildId)
            })
          }
        } else if (hasChildren && isExpanded) {
          focusItem(visibleItems[currentIndex + 1]?.item.id)
        }
        break
      case "ArrowLeft":
        event.preventDefault()
        event.stopPropagation()
        if (hasChildren && isExpanded) {
          setItemExpanded(node.item.id, false)
        } else {
          focusItem(node.parentId)
        }
        break
      case "Home":
        event.preventDefault()
        event.stopPropagation()
        focusItem(visibleIds[0])
        break
      case "End":
        event.preventDefault()
        event.stopPropagation()
        focusItem(visibleIds[visibleIds.length - 1])
        break
      case "Enter":
      case " ":
        event.preventDefault()
        event.stopPropagation()
        activateItem(node.item)
        break
      default: {
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        ) {
          return
        }

        event.preventDefault()
        event.stopPropagation()
        const character = event.key.toLocaleLowerCase()
        const repeatedCharacter =
          typeahead.current.length > 0 &&
          [...typeahead.current].every((letter) => letter === character)
        const query = repeatedCharacter
          ? character
          : `${typeahead.current}${character}`
        typeahead.current = query

        if (typeaheadTimer.current !== null) {
          window.clearTimeout(typeaheadTimer.current)
        }
        typeaheadTimer.current = window.setTimeout(() => {
          typeahead.current = ""
          typeaheadTimer.current = null
        }, 500)

        const candidates = [
          ...visibleItems.slice(currentIndex + 1),
          ...visibleItems.slice(0, currentIndex + 1),
        ]
        const match = candidates.find(({ item }) =>
          item.label.toLocaleLowerCase().startsWith(query)
        )
        if (match) focusItem(match.item.id)
      }
    }
  }

  const renderItems = (
    nodes: readonly TreeViewItem[],
    level = 1,
    parentId?: string
  ) => (
    <>
      {nodes.map((item, index) => {
        const hasChildren = Boolean(item.children?.length)
        const isExpanded = expanded.has(item.id)
        const isSelected = selectedValue === item.id
        const descriptionId = `${treeId}-item-${encodeURIComponent(item.id)}-description`

        const node: FlatTreeItem = { item, parentId, level }

        return (
          <motion.div
            layout={reduceMotion ? false : "position"}
            transition={{
              layout: reduceMotion
                ? { duration: 0 }
                : { type: "spring", duration: 0.28, bounce: 0 },
            }}
            className="grid min-w-0 gap-0.5 rounded-md outline-none [&:focus-visible>.tree-view__row]:ring-2 [&:focus-visible>.tree-view__row]:ring-code-accent/45 [&:focus-visible>.tree-view__row]:ring-inset"
            key={item.id}
            ref={(element) => {
              if (element) itemRefs.current.set(item.id, element)
              else itemRefs.current.delete(item.id)
            }}
            aria-describedby={item.description ? descriptionId : undefined}
            aria-disabled={item.disabled || undefined}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-label={item.label}
            aria-level={level}
            aria-posinset={index + 1}
            aria-selected={isSelected}
            aria-setsize={nodes.length}
            data-disabled={item.disabled ? "" : undefined}
            data-selected={isSelected ? "" : undefined}
            onKeyDown={(event) => handleItemKeyDown(event, node)}
            role="treeitem"
            tabIndex={activeId === item.id ? 0 : -1}
          >
            <div
              className={cn(
                "tree-view__row flex min-h-11 w-full cursor-default items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-code-ink transition-[background-color,color] duration-150 outline-none hover:bg-code-quiet/60 motion-reduce:transition-none",
                isSelected && "bg-code-accent-soft/65 font-medium",
                item.disabled && "cursor-not-allowed text-code-muted"
              )}
              onClick={() => {
                focusItem(item.id)
                activateItem(item)
              }}
            >
              <span
                aria-hidden="true"
                className="grid size-5 shrink-0 place-items-center"
              >
                {hasChildren ? (
                  <ChevronRight
                    className={cn(
                      "size-4 text-code-muted transition-transform duration-150 motion-reduce:transition-none",
                      isExpanded && "rotate-90"
                    )}
                    strokeWidth={1.8}
                  />
                ) : null}
              </span>
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="truncate">{item.label}</span>
                {item.description ? (
                  <span
                    className="truncate text-xs font-normal text-code-muted"
                    id={descriptionId}
                  >
                    {item.description}
                  </span>
                ) : null}
              </span>
            </div>
            {hasChildren ? (
              <AnimatePresence initial={false} mode="popLayout">
                {isExpanded ? (
                  <TreeViewChildrenGroup
                    key="children"
                    reduceMotion={reduceMotion}
                  >
                    {renderItems(item.children!, level + 1, item.id)}
                  </TreeViewChildrenGroup>
                ) : null}
              </AnimatePresence>
            ) : null}
          </motion.div>
        )
      })}
    </>
  )

  return (
    <div
      {...props}
      className={cn("grid min-w-0 gap-0.5 text-code-ink", className)}
      data-slot="tree-view"
      role="tree"
    >
      {renderItems(items)}
    </div>
  )
}

export { TreeView }
