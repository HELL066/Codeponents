import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react"
import { LayoutGroup, motion, useReducedMotion } from "motion/react"
import { Menu, Search, X } from "lucide-react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Toaster } from "@/components/ui/toast"
// Keep the shader's animated fallback styles ready before its lazy-loaded demo arrives.
import "@/components/ui/shader-canvas.css"
import { loadComponentSpecimens } from "./component-specimen-loader"
import { LibraryDirectory } from "./library-directory"
import {
  libraryEntries,
  libraryEntryById,
  libraryGroups,
  matchesLibraryEntry,
  type LibraryEntry,
} from "./library-data"
import { ComponentPage } from "./component-page"
import { ExamplePagesPage } from "./example-pages"
import { McpInstallDialog } from "./mcp-install-dialog"
import { ComponentInstallDialog } from "./component-install-dialog"
import { cn } from "@/lib/utils"
import "./library-app.css"

const ComponentSpecimen = lazy(() =>
  loadComponentSpecimens().then((module) => ({
    default: module.ComponentSpecimen,
  }))
)

const MotionCommandGroup = motion.create(CommandGroup)
const MotionCommandItem = motion.create(CommandItem)
const MotionCommandList = motion.create(CommandList)
const commandSpring = {
  type: "spring",
  stiffness: 560,
  damping: 42,
  mass: 0.85,
} as const

function SearchCommandItem({
  children,
  className,
  commandValue,
  reduceMotion,
  value,
  ...props
}: Omit<
  ComponentProps<typeof MotionCommandItem>,
  "children" | "className" | "layout" | "transition" | "value"
> & {
  children: ReactNode
  className?: string
  commandValue: string
  reduceMotion: boolean
  value: string
}) {
  const selected = value === commandValue

  return (
    <MotionCommandItem
      {...props}
      className={cn("relative isolate", className)}
      layout={reduceMotion ? false : "position"}
      transition={reduceMotion ? { duration: 0 } : commandSpring}
      value={value}
    >
      {selected ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[7px]"
          layoutId={reduceMotion ? undefined : "library-command-selection"}
          style={{
            background:
              "color-mix(in srgb, var(--code-accent-soft) 72%, var(--code-surface))",
          }}
          transition={
            reduceMotion ? { layout: { duration: 0 } } : commandSpring
          }
        />
      ) : null}
      <span className="relative z-10 flex min-w-0 flex-1 items-center gap-2">
        {children}
      </span>
    </MotionCommandItem>
  )
}

function readRouteHash() {
  const value = window.location.hash.slice(1)
  if (!value) return null
  const aliases: Record<string, string> = {
    foundations: "colors",
    buttons: "button",
    fields: "input",
    feedback: "badge",
    surfaces: "card",
    overview: "home",
    shader: "shader-canvas",
    "portal-home": "examples",
    "in-practice": "examples",
  }
  const id = aliases[value] ?? value
  return id === "home" || id === "examples" || libraryEntryById[id] ? id : null
}

function firstCommandMatch(query: string) {
  const term = query.trim().toLowerCase()
  const actions = [
    "component gallery browse all components home",
    "example pages overview events profile workspace",
  ]
  const matchingAction = actions.find((value) => !term || value.includes(term))
  if (matchingAction) return matchingAction

  for (const group of libraryGroups) {
    const entries = group.ids
      .map((id) => libraryEntryById[id])
      .filter((entry): entry is LibraryEntry => {
        if (!entry) return false
        return matchesLibraryEntry(entry, term)
      })
      .sort((first, second) => {
        const rank = (entry: LibraryEntry) => {
          const name = entry.name.toLowerCase()
          if (name === term) return 0
          if (name.startsWith(term)) return 1
          if (name.includes(term)) return 2
          if (entry.terms.toLowerCase().includes(term)) return 3
          return 4
        }
        return rank(first) - rank(second)
      })
    const firstEntry = entries[0]
    if (firstEntry) {
      return `${firstEntry.name} ${firstEntry.group} ${firstEntry.description} ${firstEntry.terms}`
    }
  }
  return ""
}

function NavHighlight({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="library__nav-highlight"
      initial={false}
      layoutId={reduceMotion ? undefined : "library-active-highlight"}
      transition={
        reduceMotion
          ? { layout: { duration: 0 } }
          : {
              layout: {
                type: "spring",
                stiffness: 520,
                damping: 44,
                mass: 0.72,
              },
            }
      }
    />
  )
}

function EntryLinks({
  entries,
  activeId,
  onNavigate,
  onPrepareComponent,
  reduceMotion,
}: {
  entries: LibraryEntry[]
  activeId: string
  onNavigate?: (id: string) => void
  onPrepareComponent?: () => void
  reduceMotion: boolean
}) {
  return (
    <ul className="library__nav-list">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            aria-current={activeId === entry.id ? "page" : undefined}
            className={
              activeId === entry.id
                ? "library__nav-link is-active"
                : "library__nav-link"
            }
            href={"#" + entry.id}
            onFocus={onPrepareComponent}
            onPointerEnter={onPrepareComponent}
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
              onNavigate?.(entry.id)
            }}
          >
            {activeId === entry.id ? (
              <NavHighlight reduceMotion={reduceMotion} />
            ) : null}
            <span>{entry.name}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function LibraryNavigation({
  query,
  activeId,
  onNavigate,
  onPrepareComponent,
}: {
  query: string
  activeId: string
  onNavigate?: (id: string) => void
  onPrepareComponent?: () => void
}) {
  const normalizedQuery = query.trim().toLowerCase()
  const reduceMotion = useReducedMotion() ?? false

  return (
    <LayoutGroup id="library-side-navigation">
      <nav
        id="component-navigation-list"
        className="library__navigation"
        aria-label="Component library"
      >
        <a
          aria-current={activeId === "home" ? "page" : undefined}
          className={
            activeId === "home"
              ? "library__nav-link library__home-link is-active"
              : "library__nav-link library__home-link"
          }
          href="#home"
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
            onNavigate?.("home")
          }}
        >
          {activeId === "home" ? (
            <NavHighlight reduceMotion={reduceMotion} />
          ) : null}
          <span>Library</span>
        </a>

        <a
          aria-current={activeId === "examples" ? "page" : undefined}
          className={
            activeId === "examples"
              ? "library__nav-link library__home-link is-active"
              : "library__nav-link library__home-link"
          }
          href="#examples"
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
            onNavigate?.("examples")
          }}
        >
          {activeId === "examples" ? (
            <NavHighlight reduceMotion={reduceMotion} />
          ) : null}
          <span>Examples</span>
        </a>

        {libraryGroups.map((group) => {
          const entries = group.ids
            .map((id) => libraryEntryById[id])
            .filter((entry) => {
              if (!entry) return false
              if (!normalizedQuery) return true
              return matchesLibraryEntry(entry, normalizedQuery)
            })
          if (entries.length === 0) return null

          return (
            <div className="library__nav-group" key={group.name}>
              <h2>{group.name}</h2>
              <EntryLinks
                entries={entries}
                activeId={activeId}
                onNavigate={onNavigate}
                onPrepareComponent={onPrepareComponent}
                reduceMotion={reduceMotion}
              />
            </div>
          )
        })}
      </nav>
    </LayoutGroup>
  )
}

function SearchBox({
  value,
  onChange,
  inputRef,
}: {
  value: string
  onChange: (value: string) => void
  inputRef: RefObject<HTMLInputElement | null>
}) {
  return (
    <label className="library__search">
      <Search aria-hidden="true" size={16} />
      <span className="sr-only">Search components</span>
      <Input
        ref={inputRef}
        className="h-auto w-full min-w-0 rounded-none border-0 bg-transparent px-0 text-xs text-white shadow-none hover:border-0 focus-visible:border-0 focus-visible:ring-0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search components"
        type="search"
        aria-label="Search components"
      />
      <span className="library__search-shortcut" aria-hidden="true">
        ⌘ K
      </span>
    </label>
  )
}

function LibraryHome({
  onNavigate,
  onPrepareComponent,
}: {
  onNavigate: (id: string) => void
  onPrepareComponent: () => void
}) {
  const foundationCount =
    libraryGroups.find((group) => group.name === "Foundations")?.ids.length ?? 0
  const componentCount = libraryEntries.length - foundationCount
  const [buttonSize, setButtonSize] = useState<"sm" | "default" | "lg">(
    "default"
  )
  const [isSaved, setIsSaved] = useState(false)
  const saveResetTimeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (saveResetTimeoutRef.current !== null) {
        window.clearTimeout(saveResetTimeoutRef.current)
      }
    },
    []
  )

  const saveChanges = () => {
    if (saveResetTimeoutRef.current !== null) {
      window.clearTimeout(saveResetTimeoutRef.current)
    }

    setIsSaved(true)
    saveResetTimeoutRef.current = window.setTimeout(() => {
      setIsSaved(false)
      saveResetTimeoutRef.current = null
    }, 1800)
  }

  const resetChanges = () => {
    if (saveResetTimeoutRef.current !== null) {
      window.clearTimeout(saveResetTimeoutRef.current)
      saveResetTimeoutRef.current = null
    }
    setIsSaved(false)
  }

  return (
    <div className="library__home">
      <header className="library__home-heading">
        <h1>Codeponents</h1>
        <div className="library__home-heading-actions">
          <span aria-label={componentCount + " components"}>
            <TextMorph
              as="span"
              duration={260}
              ease="cubic-bezier(0.19, 1, 0.22, 1)"
            >
              {componentCount} components
            </TextMorph>
          </span>
          <div className="library__home-install-actions">
            <ComponentInstallDialog />
            <McpInstallDialog
              trigger={
                <Button size="sm" variant="outline">
                  Connect MCP
                </Button>
              }
            />
          </div>
        </div>
      </header>

      <div className="library__home-view">
        <section
          aria-label="Component specimens"
          className="library__home-specimen-field"
        >
          <div className="library__home-specimen library__home-specimen--actions">
            <h2 className="library__home-specimen-title">Actions</h2>
            <div
              aria-label="Change actions"
              className="library__home-action-row"
              role="group"
            >
              <Button
                className="library__home-save-button"
                onClick={saveChanges}
                size={buttonSize}
              >
                <span className="library__home-save-label">
                  <span
                    aria-hidden="true"
                    className="library__home-save-label-reserve"
                  >
                    Save changes
                  </span>
                  <TextMorph
                    as="span"
                    aria-live="polite"
                    className="library__home-save-label-value"
                    duration={220}
                    ease="cubic-bezier(0.19, 1, 0.22, 1)"
                    respectReducedMotion
                  >
                    {isSaved ? "Saved" : "Save changes"}
                  </TextMorph>
                </span>
              </Button>
              <Button
                className="library__home-reset-button"
                onClick={resetChanges}
                size={buttonSize}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="library__home-specimen library__home-specimen--size">
            <span
              className="library__home-specimen-title"
              id="library-home-button-size-label"
            >
              Button size
            </span>
            <ToggleGroup
              aria-labelledby="library-home-button-size-label"
              className="library__home-size-toggle"
              onValueChange={(value) => {
                if (value) setButtonSize(value as typeof buttonSize)
              }}
              type="single"
              value={buttonSize}
            >
              <ToggleGroupItem value="sm">Small</ToggleGroupItem>
              <ToggleGroupItem value="default">Default</ToggleGroupItem>
              <ToggleGroupItem value="lg">Large</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="library__home-specimen library__home-specimen--input">
            <label
              className="library__home-specimen-title"
              htmlFor="library-home-text-input"
            >
              Input
            </label>
            <Input
              autoComplete="off"
              id="library-home-text-input"
              placeholder="Type here"
            />
          </div>
        </section>
        <LibraryDirectory
          onNavigate={onNavigate}
          onPrepareComponent={onPrepareComponent}
        />
      </div>
    </div>
  )
}

function SearchResults({
  query,
  entries,
  onNavigate,
  onPrepareComponent,
}: {
  query: string
  entries: LibraryEntry[]
  onNavigate: (id: string) => void
  onPrepareComponent: () => void
}) {
  return (
    <section
      className="library__search-results"
      aria-labelledby="search-results-title"
    >
      <div className="library__page-heading">
        <div>
          <h1 id="search-results-title">Search results</h1>
          <p>
            {entries.length} matches for “{query.trim()}”
          </p>
        </div>
      </div>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={"#" + entry.id}
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
              <small>{entry.group}</small>
              <p>{entry.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ComponentShowcase() {
  const [activeId, setActiveId] = useState(() => readRouteHash() ?? "home")
  const [query, setQuery] = useState("")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState("")
  const reduceMotion = useReducedMotion() ?? false
  const [selectedCommandValue, setSelectedCommandValue] = useState(
    "component gallery browse all components home"
  )
  const searchRef = useRef<HTMLInputElement>(null)
  const mobileMenuRef = useRef<HTMLButtonElement>(null)
  const mobileNavRef = useRef<HTMLElementTagNameMap["aside"]>(null)
  const pageHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousActiveIdRef = useRef(activeId)
  const pageNavigationFocusRef = useRef(false)
  const activeEntry = libraryEntryById[activeId]
  const visibleEntries = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return libraryEntries
    return libraryEntries.filter((entry) => matchesLibraryEntry(entry, term))
  }, [query])
  const commandTerm = commandQuery.trim().toLowerCase()
  const matchesCommand = (value: string) =>
    !commandTerm || value.toLowerCase().includes(commandTerm)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void loadComponentSpecimens().catch(() => undefined)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const commandMatchRank = (entry: LibraryEntry) => {
    const name = entry.name.toLowerCase()
    if (name === commandTerm) return 0
    if (name.startsWith(commandTerm)) return 1
    if (name.includes(commandTerm)) return 2
    if (entry.terms.toLowerCase().includes(commandTerm)) return 3
    return 4
  }

  useEffect(() => {
    const handleHash = () => {
      const nextId = readRouteHash()
      if (!nextId) return
      if (nextId !== activeId) {
        pageNavigationFocusRef.current = Boolean(
          libraryEntryById[nextId] || nextId === "examples"
        )
      }
      setActiveId(nextId)
    }
    window.addEventListener("hashchange", handleHash)
    window.addEventListener("popstate", handleHash)
    return () => {
      window.removeEventListener("hashchange", handleHash)
      window.removeEventListener("popstate", handleHash)
    }
  }, [activeId])

  useEffect(() => {
    const previousId = previousActiveIdRef.current
    previousActiveIdRef.current = activeId
    if (
      previousId === activeId ||
      (!libraryEntryById[activeId] && activeId !== "examples")
    )
      return

    const frame = window.requestAnimationFrame(() => {
      pageHeadingRef.current?.focus()
      pageNavigationFocusRef.current = false
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activeId])

  useEffect(() => {
    if (!libraryEntryById[activeId]) return
    const navigation = mobileNavRef.current?.querySelector<HTMLElement>(
      ".library__navigation"
    )
    const activeLink = navigation?.querySelector<HTMLElement>(
      ".library__nav-link.is-active"
    )
    if (!navigation || !activeLink) return

    const navigationBounds = navigation.getBoundingClientRect()
    const activeBounds = activeLink.getBoundingClientRect()
    if (activeBounds.top < navigationBounds.top) {
      navigation.scrollTop -= navigationBounds.top - activeBounds.top
    } else if (activeBounds.bottom > navigationBounds.bottom) {
      navigation.scrollTop += activeBounds.bottom - navigationBounds.bottom
    }
  }, [activeId])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target
      const editing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          Boolean(target.closest("input, textarea, select")))

      if (mobileNavOpen) return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setCommandQuery("")
        setSelectedCommandValue(firstCommandMatch(""))
        setCommandOpen(true)
        return
      }
      if (event.key === "/" && !editing) {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (
        event.key === "Escape" &&
        document.activeElement === searchRef.current
      ) {
        setQuery("")
        searchRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [mobileNavOpen])

  useLayoutEffect(() => {
    if (!mobileNavOpen) return
    const isMobile = window.matchMedia("(max-width: 820px)").matches
    const dialog = mobileNavRef.current
    if (!isMobile || !dialog) return

    const getFocusableItems = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0)

    const getSidebarFocusTarget = () =>
      dialog.querySelector<HTMLElement>(".library__sidebar-close") ??
      getFocusableItems()[0]

    const focusInitialItem = () => {
      const target = getSidebarFocusTarget()
      target?.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setMobileNavOpen(false)
        window.requestAnimationFrame(() => mobileMenuRef.current?.focus())
        return
      }
      if (event.key !== "Tab") return

      const items = getFocusableItems()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) {
        event.preventDefault()
        dialog.focus()
        return
      }
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialog.contains(event.target)) {
        getSidebarFocusTarget()?.focus()
      }
    }

    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    focusInitialItem()
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("focusin", handleFocusIn)

    const closeAtDesktopWidth = () => {
      if (!window.matchMedia("(max-width: 820px)").matches) {
        setMobileNavOpen(false)
      }
    }
    window.addEventListener("resize", closeAtDesktopWidth)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("focusin", handleFocusIn)
      window.removeEventListener("resize", closeAtDesktopWidth)
    }
  }, [mobileNavOpen])

  const navigate = (id: string) => {
    const wasMobileNavOpen =
      mobileNavOpen && window.matchMedia("(max-width: 820px)").matches
    pageNavigationFocusRef.current =
      id !== activeId && Boolean(libraryEntryById[id] || id === "examples")
    setQuery("")
    setCommandQuery("")
    setCommandOpen(false)
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`)
    }
    setActiveId(id)
    setMobileNavOpen(false)
    if (wasMobileNavOpen && id === "home") {
      window.requestAnimationFrame(() => mobileMenuRef.current?.focus())
    }
  }

  const prepareComponent = () => {
    void loadComponentSpecimens()
  }

  const closeMobileNav = () => {
    setMobileNavOpen(false)
    if (window.matchMedia("(max-width: 820px)").matches) {
      window.requestAnimationFrame(() => mobileMenuRef.current?.focus())
    }
  }

  const openGallery = () => {
    navigate("home")
  }

  const commandGroups = libraryGroups
    .map((group) => ({
      ...group,
      entries: group.ids
        .map((id) => libraryEntryById[id])
        .filter((entry): entry is LibraryEntry => Boolean(entry))
        .filter((entry) => matchesLibraryEntry(entry, commandTerm))
        .sort(
          (first, second) => commandMatchRank(first) - commandMatchRank(second)
        ),
    }))
    .filter((group) => group.entries.length > 0)

  const showGalleryAction = matchesCommand(
    "component gallery browse all components home"
  )
  const showExamplesAction = matchesCommand(
    "example pages built with codeponents overview events profile workspace"
  )
  const hasCommandActions = showGalleryAction || showExamplesAction
  const handleCommandQueryChange = (value: string) => {
    setCommandQuery(value)
    setSelectedCommandValue(firstCommandMatch(value))
  }

  return (
    <div className="library">
      <a
        className="library__skip-link"
        href="#main-content"
        inert={mobileNavOpen || undefined}
      >
        Skip to content
      </a>
      <button
        aria-hidden="true"
        className={mobileNavOpen ? "library__scrim is-open" : "library__scrim"}
        inert={!mobileNavOpen || undefined}
        onClick={closeMobileNav}
        tabIndex={-1}
        type="button"
      />
      <aside
        id="component-navigation"
        aria-label={mobileNavOpen ? "Component navigation" : undefined}
        aria-modal={mobileNavOpen ? true : undefined}
        className={
          mobileNavOpen ? "library__sidebar is-open" : "library__sidebar"
        }
        ref={mobileNavRef}
        role={mobileNavOpen ? "dialog" : undefined}
        tabIndex={-1}
      >
        <a
          className="library__brand"
          href="#home"
          aria-label="Codeponents"
          onClick={closeMobileNav}
        >
          <img alt="" height="38" src="/code-falcon-white.png" width="35" />
        </a>
        <button
          aria-label="Close component navigation"
          className="library__icon-button library__sidebar-close"
          onClick={closeMobileNav}
          type="button"
        >
          <X aria-hidden="true" size={18} />
        </button>

        <div className="library__side-search">
          <SearchBox value={query} onChange={setQuery} inputRef={searchRef} />
        </div>

        <LibraryNavigation
          activeId={activeId}
          query={query}
          onNavigate={navigate}
          onPrepareComponent={prepareComponent}
        />

        <div className="library__sidebar-footer">
          <span>v1</span>
        </div>
      </aside>

      <div className="library__workspace" inert={mobileNavOpen || undefined}>
        <header className="library__topbar">
          <div className="library__topbar-left">
            <button
              aria-label={
                mobileNavOpen
                  ? "Close component navigation"
                  : "Open component navigation"
              }
              aria-expanded={mobileNavOpen}
              aria-controls="component-navigation"
              className="library__mobile-menu"
              ref={mobileMenuRef}
              onClick={() => setMobileNavOpen((open) => !open)}
              type="button"
            >
              <Menu aria-hidden="true" size={19} />
            </button>
            <span className="library__breadcrumb">
              {activeId === "home"
                ? "Library"
                : activeId === "examples"
                  ? "Examples"
                  : "Codeponents"}
            </span>
          </div>
          <div className="library__topbar-actions">
            <Button
              aria-label="Search components"
              aria-expanded={commandOpen}
              aria-haspopup="dialog"
              className="library__topbar-search"
              onClick={() => {
                setCommandQuery("")
                setSelectedCommandValue(firstCommandMatch(""))
                setCommandOpen(true)
              }}
              size="sm"
              variant="ghost"
            >
              <Search aria-hidden="true" />
              <span className="library__topbar-search-label">Search</span>
              <Kbd className="library__topbar-shortcut">⌘ K</Kbd>
            </Button>
          </div>
        </header>

        <main
          className="library__main"
          id="main-content"
          onClickCapture={(event) => {
            const target = event.target
            if (
              target instanceof Element &&
              target.closest('.library__specimen-stage a[href^="#"]')
            ) {
              event.preventDefault()
            }
          }}
          tabIndex={-1}
        >
          {activeId === "examples" ? (
            <ExamplePagesPage headingRef={pageHeadingRef} />
          ) : activeId === "home" || !activeEntry ? (
            query.trim() ? (
              visibleEntries.length ? (
                <SearchResults
                  query={query}
                  entries={visibleEntries}
                  onNavigate={navigate}
                  onPrepareComponent={prepareComponent}
                />
              ) : (
                <div className="library__no-results" role="status">
                  <h1>No matches</h1>
                  <p>Try another search.</p>
                  <Button onClick={() => setQuery("")} variant="outline">
                    Clear search
                  </Button>
                </div>
              )
            ) : (
              <LibraryHome
                onNavigate={navigate}
                onPrepareComponent={prepareComponent}
              />
            )
          ) : (
            <ComponentPage
              entry={activeEntry}
              headingRef={pageHeadingRef}
              key={activeEntry.id}
            >
              <Suspense fallback={null}>
                <ComponentSpecimen
                  entryId={activeEntry.id}
                  onNavigate={navigate}
                />
              </Suspense>
            </ComponentPage>
          )}
        </main>
      </div>
      <Dialog
        open={commandOpen}
        onOpenChange={(open) => {
          setCommandOpen(open)
          if (!open) setCommandQuery("")
        }}
      >
        <DialogContent
          className="overflow-hidden p-0"
          onCloseAutoFocus={(event) => {
            if (pageNavigationFocusRef.current) event.preventDefault()
          }}
          showCloseButton={false}
        >
          <Command
            className="rounded-xl"
            onValueChange={setSelectedCommandValue}
            shouldFilter={false}
            value={selectedCommandValue}
          >
            <DialogTitle className="sr-only">Search Codeponents</DialogTitle>
            <DialogDescription className="sr-only">
              Find a component or open a destination.
            </DialogDescription>
            <div className="library__command">
              <CommandInput
                aria-label="Search components and actions"
                onValueChange={handleCommandQueryChange}
                placeholder="Search components and actions"
                value={commandQuery}
              />
              <LayoutGroup id="library-command-results">
                <MotionCommandList
                  aria-label="Components and actions"
                  layoutScroll
                >
                  <CommandEmpty>No matches. Try another search.</CommandEmpty>
                  {hasCommandActions ? (
                    <MotionCommandGroup
                      heading="Actions"
                      layout={reduceMotion ? false : "position"}
                      transition={
                        reduceMotion ? { duration: 0 } : commandSpring
                      }
                    >
                      {showGalleryAction ? (
                        <SearchCommandItem
                          commandValue={selectedCommandValue}
                          reduceMotion={reduceMotion}
                          onSelect={openGallery}
                          value="component gallery browse all components home"
                        >
                          <span>Component gallery</span>
                        </SearchCommandItem>
                      ) : null}
                      {showExamplesAction ? (
                        <SearchCommandItem
                          commandValue={selectedCommandValue}
                          reduceMotion={reduceMotion}
                          onSelect={() => navigate("examples")}
                          value="example pages built with codeponents overview events profile workspace"
                        >
                          <span>Examples</span>
                        </SearchCommandItem>
                      ) : null}
                    </MotionCommandGroup>
                  ) : null}
                  {commandGroups.map((group) => (
                    <MotionCommandGroup
                      heading={group.name}
                      key={group.name}
                      layout={reduceMotion ? false : "position"}
                      transition={
                        reduceMotion ? { duration: 0 } : commandSpring
                      }
                    >
                      {group.entries.map((entry) => {
                        const value = `${entry.name} ${entry.group} ${entry.description} ${entry.terms}`

                        return (
                          <SearchCommandItem
                            commandValue={selectedCommandValue}
                            key={entry.id}
                            onSelect={() => navigate(entry.id)}
                            reduceMotion={reduceMotion}
                            value={value}
                          >
                            <span>{entry.name}</span>
                            <CommandShortcut>{entry.group}</CommandShortcut>
                          </SearchCommandItem>
                        )
                      })}
                    </MotionCommandGroup>
                  ))}
                </MotionCommandList>
              </LayoutGroup>
              <div aria-hidden="true" className="library__command-footer">
                <span>
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> Navigate
                </span>
                <span>
                  <Kbd>↵</Kbd> Open
                </span>
                <span>
                  <Kbd>Esc</Kbd> Close
                </span>
              </div>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
      <Toaster theme="light" position="bottom-right" />
    </div>
  )
}

export { ComponentShowcase }
export default ComponentShowcase
