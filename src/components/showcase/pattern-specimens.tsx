import * as React from "react"
import { TextMorph } from "torph/react"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EventListItem } from "@/components/ui/event-list-item"
import {
  ListToolbar,
  type ListToolbarSelection,
} from "@/components/ui/list-toolbar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const patternEntryIds = new Set([
  "activity-feed",
  "list-toolbar",
  "event-list-item",
])

const activityItems = [
  {
    id: "workspace-shared",
    actor: { name: "Jordan Lee", initials: "JL" },
    timestamp: "8 min ago",
    dateTime: "2026-11-05T09:42:00+08:00",
    title: "Workspace shared",
    description: "Design team can now view the project",
  },
  {
    id: "guide-updated",
    actor: { name: "Priya Shah", initials: "PS" },
    timestamp: "1 hr ago",
    dateTime: "2026-11-05T08:50:00+08:00",
    title: "Guide updated",
    description: "The onboarding checklist was revised",
  },
  {
    id: "invite-accepted",
    actor: { name: "Sam Rivera", initials: "SR" },
    timestamp: "Yesterday",
    dateTime: "2026-11-04T16:18:00+08:00",
    title: "Invite accepted",
  },
]

type ResourceKind = "Guide" | "Template"

type Resource = {
  id: string
  name: string
  kind: ResourceKind
  updated: string
}

const initialResources: Resource[] = [
  {
    id: "onboarding",
    name: "New member guide",
    kind: "Guide",
    updated: "2 hr ago",
  },
  {
    id: "event-checklist",
    name: "Event checklist",
    kind: "Template",
    updated: "Yesterday",
  },
  {
    id: "workspace-notes",
    name: "Workspace notes",
    kind: "Guide",
    updated: "Nov 2",
  },
]

function ActivityFeedSpecimen() {
  return (
    <div className="w-full max-w-xl">
      <ActivityFeed
        action={
          <Button size="sm" variant="ghost">
            View all
          </Button>
        }
        items={activityItems}
      />
    </div>
  )
}

function EventListItemSpecimen() {
  const events = [
    {
      id: "planning-sync",
      title: "Planning sync",
      start: new Date(2026, 10, 6, 9, 30),
      end: new Date(2026, 10, 6, 10, 30),
      date: new Date(2026, 10, 6),
      category: "Team",
      location: "Room 3",
    },
    {
      id: "workshop-prep",
      title: "Workshop prep",
      start: new Date(2026, 10, 9, 13),
      end: new Date(2026, 10, 9, 14, 30),
      date: new Date(2026, 10, 9),
      category: "Workshop",
      location: "Studio 2",
    },
    {
      id: "member-check-in",
      title: "Member check-in",
      start: new Date(2026, 10, 10, 15),
      end: new Date(2026, 10, 10, 15, 30),
      date: new Date(2026, 10, 10),
      category: "People",
      location: "Meeting room",
    },
  ]

  return (
    <ol className="w-full max-w-xl divide-y divide-code-line/35">
      {events.map((event) => (
        <li key={event.id}>
          <EventListItem {...event} locale="en-PH" />
        </li>
      ))}
    </ol>
  )
}

function ListToolbarSpecimen() {
  const [search, setSearch] = React.useState("")
  const [kind, setKind] = React.useState("all")
  const [sort, setSort] = React.useState("recent")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [resources, setResources] = React.useState(initialResources)
  const sortLabel = sort === "recent" ? "Recently updated" : "Name"

  const visibleResources = React.useMemo(() => {
    const matching = resources.filter((resource) => {
      const matchesSearch = resource.name
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase())
      return (
        matchesSearch &&
        (kind === "all" || resource.kind.toLowerCase() === kind)
      )
    })

    return [...matching].sort((first, second) => {
      if (sort === "name") return first.name.localeCompare(second.name)
      return (
        initialResources.findIndex((item) => item.id === first.id) -
        initialResources.findIndex((item) => item.id === second.id)
      )
    })
  }, [kind, resources, search, sort])

  const selection: ListToolbarSelection | undefined = selectedIds.length
    ? {
        count: selectedIds.length,
        label: selectedIds.length === 1 ? "item selected" : "items selected",
        onClear: () => setSelectedIds([]),
        actions: (
          <Button
            onClick={() => {
              setResources((current) =>
                current.filter((resource) => !selectedIds.includes(resource.id))
              )
              setSelectedIds([])
            }}
            size="sm"
            variant="destructive"
          >
            Archive
          </Button>
        ),
      }
    : undefined

  const addResource = () => {
    const id = `resource-${Date.now()}`
    setResources((current) => [
      { id, name: "Untitled resource", kind: "Guide", updated: "Just now" },
      ...current,
    ])
  }

  const toggleResource = (id: string, checked: boolean | "indeterminate") => {
    setSelectedIds((current) => {
      if (checked === true)
        return current.includes(id) ? current : [...current, id]
      return current.filter((selectedId) => selectedId !== id)
    })
  }

  return (
    <div className="w-full max-w-3xl space-y-4">
      <ListToolbar
        actions={
          <Button onClick={addResource} size="sm">
            Add resource
          </Button>
        }
        activeFilters={
          kind !== "all" ? (
            <>Type: {kind === "guide" ? "Guide" : "Template"}</>
          ) : undefined
        }
        aria-label="Resource list controls"
        filters={
          <Select onValueChange={setKind} value={kind}>
            <SelectTrigger aria-label="Filter by type" className="w-[8.25rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="guide">Guides</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
            </SelectContent>
          </Select>
        }
        onClearFilters={() => setKind("all")}
        search={{
          value: search,
          onValueChange: setSearch,
          label: "Search resources",
          placeholder: "Search resources",
        }}
        selection={selection}
        sort={
          <Select onValueChange={setSort} value={sort}>
            <SelectTrigger
              aria-label={`Sort resources, ${sortLabel}`}
              className="w-48 max-w-full"
            >
              <TextMorph
                as="span"
                className="min-w-0 flex-1 truncate text-left"
                duration={180}
                respectReducedMotion
              >
                {sortLabel}
              </TextMorph>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <ul className="divide-y divide-code-line/35">
        {visibleResources.length ? (
          visibleResources.map((resource) => (
            <li
              className="flex min-h-14 min-w-0 items-center gap-3 py-2"
              key={resource.id}
            >
              <Checkbox
                aria-label={`Select ${resource.name}`}
                checked={selectedIds.includes(resource.id)}
                onCheckedChange={(checked) =>
                  toggleResource(resource.id, checked)
                }
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-code-ink">
                  {resource.name}
                </p>
                <p className="truncate text-xs text-code-muted">
                  {resource.kind} · {resource.updated}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="py-5 text-sm text-code-muted">
            No matching resources
          </li>
        )}
      </ul>
    </div>
  )
}

export function PatternSpecimen({ entryId }: { entryId: string }) {
  if (entryId === "activity-feed") return <ActivityFeedSpecimen />
  if (entryId === "event-list-item") return <EventListItemSpecimen />
  if (entryId === "list-toolbar") return <ListToolbarSpecimen />
  return null
}

export function getPatternSnippet(entryId: string) {
  if (entryId === "activity-feed") {
    return `import { ActivityFeed } from "@/components/ui/activity-feed"\n\n<ActivityFeed\n  title="Recent activity"\n  items={[\n    { id: "share", title: "Workspace shared", timestamp: "8 min ago" },\n    { id: "updated", title: "Guide updated", timestamp: "1 hr ago" },\n  ]}\n/>`
  }

  if (entryId === "event-list-item") {
    return `import { EventListItem } from "@/components/ui/event-list-item"\n\n<EventListItem\n  title="Planning sync"\n  start={new Date(2026, 10, 6, 9, 30)}\n  end={new Date(2026, 10, 6, 10, 30)}\n  date={new Date(2026, 10, 6)}\n  location="Room 3"\n/>`
  }

  if (entryId === "list-toolbar") {
    return `import { ListToolbar } from "@/components/ui/list-toolbar"\n\n<ListToolbar\n  search={{ value, onValueChange: setValue }}\n  filters={<TypeFilter />}\n  sort={<SortMenu />}\n  actions={<Button>Add resource</Button>}\n/>`
  }

  return ""
}
