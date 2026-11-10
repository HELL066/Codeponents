import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { libraryEntries, libraryGroups } from "./library-data"

export function LibraryDirectory({
  onNavigate,
  onPrepareComponent,
}: {
  onNavigate: (id: string) => void
  onPrepareComponent: () => void
}) {
  const [selectedGroup, setSelectedGroup] = useState("all")
  const prefersReducedMotion = useReducedMotion()
  const groupTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }
  const filteredEntries = libraryEntries.filter(
    (entry) => selectedGroup === "all" || entry.group === selectedGroup
  )
  const filteredGroups = libraryGroups
    .map((group) => ({
      ...group,
      entries: group.ids
        .map((id) => filteredEntries.find((entry) => entry.id === id))
        .filter((entry): entry is (typeof filteredEntries)[number] =>
          Boolean(entry)
        ),
    }))
    .filter((group) => group.entries.length > 0)

  return (
    <section
      aria-labelledby="library-component-directory-title"
      className="library-component-directory"
    >
      <header className="library-component-directory__header">
        <h2 id="library-component-directory-title">All components</h2>
        <div className="library-component-directory__controls">
          <Select onValueChange={setSelectedGroup} value={selectedGroup}>
            <SelectTrigger
              aria-label="Filter components by category"
              className="library-component-directory__category"
            >
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {libraryGroups.map((group) => (
                <SelectItem key={group.name} value={group.name}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {filteredGroups.length > 0 ? (
        <div className="library-component-directory__groups">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredGroups.map((group) => {
              const headingId = `library-component-group-${group.name
                .toLowerCase()
                .replaceAll(" ", "-")}`

              return (
                <motion.section
                  animate={{ opacity: 1, y: 0 }}
                  aria-labelledby={headingId}
                  className="library-component-directory__group"
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -4 }
                  }
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                  key={group.name}
                  layout={!prefersReducedMotion}
                  transition={groupTransition}
                >
                  <header className="library-component-directory__group-heading">
                    <h3 id={headingId}>{group.name}</h3>
                    <span aria-label={`${group.entries.length} items`}>
                      {group.entries.length}
                    </span>
                  </header>
                  <ul className="library-component-directory__entries">
                    {group.entries.map((entry) => (
                      <li key={entry.id}>
                        <a
                          aria-label={`${entry.name}: ${entry.description}`}
                          href={`#${entry.id}`}
                          onClick={(event) => {
                            if (
                              event.button !== 0 ||
                              event.metaKey ||
                              event.ctrlKey ||
                              event.shiftKey ||
                              event.altKey
                            )
                              return
                            event.preventDefault()
                            onNavigate(entry.id)
                          }}
                          onFocus={onPrepareComponent}
                          onPointerEnter={onPrepareComponent}
                        >
                          <span>{entry.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        <p className="library-component-directory__empty" role="status">
          No components found
        </p>
      )}
    </section>
  )
}
