import { useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { TextMorph } from "torph/react"
import {
  ArrowUpRight,
  ChevronsUpDown,
  CircleHelp,
  Info,
  MoreHorizontal,
} from "lucide-react"
import { Alert } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  BottomNavigation,
  type BottomNavigationItem,
} from "@/components/ui/bottom-navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  EventsCalendar,
  type EventCalendarEvent,
} from "@/components/ui/events-calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { CodeBlock } from "@/components/ui/code-block"
import { ColorPicker } from "@/components/ui/color-picker"
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateTitle,
} from "@/components/ui/empty-state"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DatePicker } from "@/components/ui/date-picker"
import {
  DateRangePicker,
  type DateRangeValue,
} from "@/components/ui/date-range-picker"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { FileUpload } from "@/components/ui/file-upload"
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { MetricCard } from "@/components/ui/metric-card"
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select"
import { NumberField } from "@/components/ui/number-field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton, SkeletonReveal } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toast } from "@/components/ui/toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { TimePicker } from "@/components/ui/time-picker"
import { TimeZonePicker } from "@/components/ui/time-zone-picker"
import { TreeView, type TreeViewItem } from "@/components/ui/tree-view"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const generalEntryIds = [
  "button",
  "button-group",
  "input",
  "color-picker",
  "textarea",
  "number-field",
  "select",
  "checkbox",
  "radio-group",
  "switch",
  "calendar",
  "date-picker",
  "date-range-picker",
  "time-picker",
  "time-zone-picker",
  "date-time-picker",
  "events-calendar",
  "bottom-navigation",
  "multi-select",
  "file-upload",
  "tabs",
  "breadcrumb",
  "accordion",
  "dropdown-menu",
  "popover",
  "tooltip",
  "dialog",
  "badge",
  "alert",
  "progress",
  "skeleton",
  "empty-state",
  "toast",
  "avatar",
  "card",
  "item",
  "metric-card",
  "tree-view",
  "table",
  "separator",
  "code-block",
] as const

type GeneralEntryId = (typeof generalEntryIds)[number]
type Navigate = (id: string) => void

const categoryOptions: MultiSelectOption[] = [
  { value: "writing", label: "Writing", group: "Creative" },
  { value: "design", label: "Design", group: "Creative" },
  { value: "research", label: "Research", group: "Creative" },
  { value: "photography", label: "Photography", group: "Interests" },
  { value: "music", label: "Music", group: "Interests" },
]

const previewItems = [
  {
    name: "Design notes",
    archived: false,
    status: "In progress",
    updated: "Today",
    recency: 0,
  },
  {
    name: "Reading list",
    archived: false,
    status: "Draft",
    updated: "Yesterday",
    recency: 1,
  },
  {
    name: "Photo archive",
    archived: true,
    status: "Archived",
    updated: "Oct 30",
    recency: 2,
  },
]

const libraryItems: TreeViewItem[] = [
  {
    id: "library",
    label: "Library",
    children: [
      {
        id: "guides",
        label: "Guides",
        children: [
          { id: "getting-started", label: "Getting started" },
          { id: "shortcuts", label: "Keyboard shortcuts" },
        ],
      },
      { id: "shared", label: "Shared items" },
    ],
  },
  { id: "archive", label: "Archive" },
]

const eventsCalendarToday = new Date()
const eventsCalendarDemoEvents: EventCalendarEvent[] = [
  {
    id: "planning-sync",
    title: "Planning sync",
    start: new Date(
      eventsCalendarToday.getFullYear(),
      eventsCalendarToday.getMonth(),
      3,
      9,
      30
    ),
    end: new Date(
      eventsCalendarToday.getFullYear(),
      eventsCalendarToday.getMonth(),
      3,
      10,
      30
    ),
    category: "Team",
    location: "Meeting room",
    tone: "accent",
  },
  {
    id: "workshop-prep",
    title: "Workshop prep",
    start: new Date(
      eventsCalendarToday.getFullYear(),
      eventsCalendarToday.getMonth(),
      9,
      13
    ),
    end: new Date(
      eventsCalendarToday.getFullYear(),
      eventsCalendarToday.getMonth(),
      9,
      14,
      30
    ),
    category: "Workshop",
    location: "Studio 2",
    tone: "positive",
  },
  {
    id: "research-review",
    title: "Research review",
    start: new Date(
      eventsCalendarToday.getFullYear(),
      eventsCalendarToday.getMonth(),
      16,
      10
    ),
    end: new Date(
      eventsCalendarToday.getFullYear(),
      eventsCalendarToday.getMonth(),
      16,
      11
    ),
    category: "Review",
    location: "Online",
    tone: "warning",
  },
  {
    id: "club-gathering",
    title: "Club gathering",
    start: new Date(
      eventsCalendarToday.getFullYear(),
      eventsCalendarToday.getMonth(),
      23,
      18
    ),
    end: new Date(
      eventsCalendarToday.getFullYear(),
      eventsCalendarToday.getMonth(),
      23,
      19,
      30
    ),
    category: "Social",
    location: "Atrium",
    tone: "neutral",
  },
]

const snippets: Record<GeneralEntryId, string> = {
  button: `import { Button } from "@/components/ui/button"\n\n<Button>Save changes</Button>\n<Button variant="outline">Cancel</Button>`,
  "button-group": `import { ButtonGroup } from "@/components/ui/button-group"\n\n<ButtonGroup aria-label="Pagination controls">\n  <Button variant="outline">Previous</Button>\n  <Button variant="outline">Next</Button>\n</ButtonGroup>`,
  "color-picker": `import { ColorPicker } from "@/components/ui/color-picker"\n\n<ColorPicker\n  ariaLabel="Accent color"\n  label="Accent color"\n  value={accentColor}\n  onValueChange={setAccentColor}\n  swatches={[\n    { value: "#06192F", label: "Navy" },\n    { value: "#0C315C", label: "Blue" },\n    { value: "#4986AC", label: "Sky" },\n  ]}\n/>`,
  input: `import { Input } from "@/components/ui/input"\n\n<label htmlFor="display-name">Display name</label>\n<Input id="display-name" aria-describedby="name-help" />\n<p id="name-help">Use a name people can scan quickly.</p>`,
  textarea: `import { Textarea } from "@/components/ui/textarea"\n\n<label htmlFor="note">Note</label>\n<Textarea id="note" maxLength={240} />`,
  "number-field": `import { NumberField } from "@/components/ui/number-field"\n\n<label htmlFor="quantity">Quantity</label>\n<NumberField id="quantity" min={0} max={99} defaultValue={12} />`,
  select: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"\n\n<Select defaultValue="active">\n  <SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger>\n  <SelectContent>\n    <SelectItem value="draft">Draft</SelectItem>\n    <SelectItem value="active">In progress</SelectItem>\n    <SelectItem value="complete">Complete</SelectItem>\n  </SelectContent>\n</Select>`,
  checkbox: `import { Checkbox } from "@/components/ui/checkbox"\n\n<label htmlFor="include-archived">\n  <Checkbox id="include-archived" /> Include archived items\n</label>`,
  "radio-group": `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"\n\n<RadioGroup defaultValue="recent" aria-label="Item order">\n  <label><RadioGroupItem value="recent" /> Recently updated</label>\n  <label><RadioGroupItem value="name" /> Name</label>\n</RadioGroup>`,
  switch: `import { Switch } from "@/components/ui/switch"\n\n<label htmlFor="current-items">Show current items only</label>\n<Switch id="current-items" />`,
  calendar: `import { Calendar } from "@/components/ui/calendar"\n\n<Calendar\n  selected={selectedDate ?? null}\n  onSelect={setSelectedDate}\n  locale="en-PH"\n/>`,
  "events-calendar": `import { EventsCalendar, type EventCalendarEvent } from "@/components/ui/events-calendar"\n\nconst events: EventCalendarEvent[] = [\n  { id: "planning", title: "Planning sync", start: new Date(2026, 10, 6, 9, 30), category: "Team", location: "Meeting room" },\n  { id: "workshop", title: "Workshop prep", start: new Date(2026, 10, 9, 13), category: "Workshop", location: "Studio 2", tone: "positive" },\n]\n\n<EventsCalendar events={events} locale="en-PH" />`,
  "bottom-navigation": `import { useState } from "react"\nimport { BottomNavigation, type BottomNavigationItem } from "@/components/ui/bottom-navigation"\n\nconst sections: BottomNavigationItem[] = [\n  { value: "overview", label: "Overview" },\n  { value: "events", label: "Events" },\n  { value: "profile", label: "Profile" },\n]\n\nconst [view, setView] = useState("overview")\n\n<BottomNavigation\n  items={sections}\n  label="Workspace pages"\n  value={view}\n  onValueChange={setView}\n/>`,
  "date-picker": `import { DatePicker } from "@/components/ui/date-picker"\n\n<DatePicker\n  aria-label="Due date"\n  value={date}\n  onValueChange={setDate}\n/>`,
  "date-range-picker": `import { useState } from "react"\nimport { DateRangePicker, type DateRangeValue } from "@/components/ui/date-range-picker"\n\nconst [range, setRange] = useState<DateRangeValue>({})\n\n<DateRangePicker value={range} onValueChange={setRange} />`,
  "time-picker": `import { useState } from "react"\nimport { TimePicker } from "@/components/ui/time-picker"\n\nconst [time, setTime] = useState<string | null>("14:30")\n\n<TimePicker\n  aria-label="Reminder time"\n  locale="en-PH"\n  value={time}\n  onValueChange={setTime}\n/>`,
  "time-zone-picker": `import { useState } from "react"\nimport { TimeZonePicker } from "@/components/ui/time-zone-picker"\n\nconst [timeZone, setTimeZone] = useState<string | null>("Asia/Manila")\n\n<TimeZonePicker\n  aria-label="Team time zone"\n  locale="en-PH"\n  value={timeZone}\n  onValueChange={setTimeZone}\n/>`,
  "date-time-picker": `import { DateTimePicker } from "@/components/ui/date-time-picker"\n\n<DateTimePicker\n  aria-label="Meeting time"\n  value={meetingTime}\n  onValueChange={setMeetingTime}\n/>`,
  "multi-select": `import { MultiSelect } from "@/components/ui/multi-select"\n\n<MultiSelect\n  ariaLabel="Categories"\n  options={categories}\n  value={selectedCategories}\n  onValueChange={setSelectedCategories}\n/>`,
  "file-upload": `import { useState } from "react"\nimport { FileUpload } from "@/components/ui/file-upload"\n\nconst [files, setFiles] = useState<File[]>([])\n\n<FileUpload\n  accept=".csv,.pdf,image/*"\n  maxFiles={3}\n  maxSize={5 * 1024 * 1024}\n  value={files}\n  onValueChange={setFiles}\n/>`,
  tabs: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"\n\n<Tabs defaultValue="items">\n  <TabsList>\n    <TabsTrigger value="items">Items</TabsTrigger>\n    <TabsTrigger value="activity">Activity</TabsTrigger>\n  </TabsList>\n  <TabsContent value="items">A short list</TabsContent>\n  <TabsContent value="activity">Recent changes</TabsContent>\n</Tabs>`,
  breadcrumb: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"\n\n<Breadcrumb aria-label="Breadcrumb">\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="/">Library</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbLink href="/guides">Guides</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>Getting started</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`,
  accordion: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"\n\n<Accordion type="single" collapsible>\n  <AccordionItem value="details">\n    <AccordionTrigger>Who can view this?</AccordionTrigger>\n    <AccordionContent>Choose who can see this page.</AccordionContent>\n  </AccordionItem>\n</Accordion>`,
  "dropdown-menu": `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"\nimport { Button } from "@/components/ui/button"\n\n<DropdownMenu>\n  <DropdownMenuTrigger asChild><Button variant="outline">Item actions</Button></DropdownMenuTrigger>\n  <DropdownMenuContent align="start">\n    <DropdownMenuItem>Open item</DropdownMenuItem>\n    <DropdownMenuItem>Copy link</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`,
  popover: `import { Checkbox } from "@/components/ui/checkbox"\nimport { FieldLegend, FieldSet } from "@/components/ui/field"\nimport { Label } from "@/components/ui/label"\nimport { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"\nimport { Button } from "@/components/ui/button"\n\n<Popover>\n  <PopoverTrigger asChild><Button variant="outline">Filters</Button></PopoverTrigger>\n  <PopoverContent className="w-72 p-3">\n    <FieldSet className="gap-1">\n      <FieldLegend className="mb-0">Show items</FieldLegend>\n      <div className="flex min-h-10 items-center gap-3">\n        <Checkbox id="active-only" checked={activeOnly} onCheckedChange={(checked) => setActiveOnly(checked === true)} />\n        <Label htmlFor="active-only" className="min-h-10 flex-1 cursor-pointer font-normal leading-normal">Active only</Label>\n      </div>\n    </FieldSet>\n  </PopoverContent>\n</Popover>`,
  tooltip: `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"\nimport { Button } from "@/components/ui/button"\n\n<TooltipProvider>\n  <Tooltip>\n    <TooltipTrigger asChild><Button aria-label="More information" size="icon">i</Button></TooltipTrigger>\n    <TooltipContent>Last updated today</TooltipContent>\n  </Tooltip>\n</TooltipProvider>`,
  dialog: `import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"\nimport { Button } from "@/components/ui/button"\n\n<Dialog>\n  <DialogTrigger asChild><Button>Open item</Button></DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Item details</DialogTitle>\n    <DialogDescription>Review the title and description.</DialogDescription>\n  </DialogContent>\n</Dialog>`,
  badge: `import { Badge } from "@/components/ui/badge"\n\n<Badge appearance="tinted" tone="positive">Complete</Badge>\n<Badge appearance="minimal" tone="warning">In progress</Badge>`,
  alert: `import { Alert } from "@/components/ui/alert"\n\n<Alert role="alert" tone="warning" title="Unsaved changes">\n  Save your edits before leaving this page.\n</Alert>`,
  progress: `import { Progress } from "@/components/ui/progress"\n\n<Progress aria-label="Upload progress" value={60} />`,
  skeleton: `import { SkeletonReveal } from "@/components/ui/skeleton"\n\n<SkeletonReveal id="item-details" loading={loading} label="Loading details">\n  <ItemDetails item={item} />\n</SkeletonReveal>`,
  "empty-state": `import { EmptyState, EmptyStateAction, EmptyStateDescription, EmptyStateTitle } from "@/components/ui/empty-state"\n\n<EmptyState>\n  <EmptyStateTitle>No results</EmptyStateTitle>\n  <EmptyStateDescription>Try another search.</EmptyStateDescription>\n  <EmptyStateAction><Button variant="outline">Clear search</Button></EmptyStateAction>\n</EmptyState>`,
  toast: `import { toast } from "@/components/ui/toast"\n\n<Button onClick={() => toast.success("Changes saved")}>Save changes</Button>`,
  avatar: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"\n\n<Avatar>\n  <AvatarImage src={person.avatarUrl} alt={person.name} />\n  <AvatarFallback aria-label={person.name}>JD</AvatarFallback>\n</Avatar>`,
  card: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"\n\n<Card>\n  <CardHeader><CardTitle>Quick note</CardTitle></CardHeader>\n  <CardContent>A title and short summary in one place.</CardContent>\n</Card>`,
  item: `import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"\nimport { Button } from "@/components/ui/button"\n\n<ItemGroup>\n  <Item variant="outline">\n    <ItemContent>\n      <ItemTitle>Design notes</ItemTitle>\n      <ItemDescription>Updated yesterday</ItemDescription>\n    </ItemContent>\n    <ItemActions><Button size="sm" variant="outline">Open</Button></ItemActions>\n  </Item>\n</ItemGroup>`,
  "metric-card": `import { MetricCard } from "@/components/ui/metric-card"\n\n<MetricCard\n  label="Files reviewed"\n  value={34}\n  change="−6"\n  comparison="since Monday"\n  tone="positive"\n/>`,
  "tree-view": `import { TreeView, type TreeViewItem } from "@/components/ui/tree-view"\n\nconst items: TreeViewItem[] = [\n  { id: "library", label: "Library", children: [\n    { id: "guides", label: "Guides" },\n    { id: "shared", label: "Shared items" },\n  ] },\n]\n\n<TreeView aria-label="Library items" items={items} defaultExpandedIds={["library"]} />`,
  table: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"\n\n<Table>\n  <TableHeader><TableRow><TableHead scope="col">Name</TableHead></TableRow></TableHeader>\n  <TableBody><TableRow><TableCell>Design notes</TableCell></TableRow></TableBody>\n</Table>`,
  separator: `import { Separator } from "@/components/ui/separator"\n\n<section aria-labelledby="details-title">\n  <h2 id="details-title">Details</h2>\n  <Separator className="my-5" />\n  <h2>Recent activity</h2>\n</section>`,
  "code-block": `import { CodeBlock } from "@/components/ui/code-block"\n\n<CodeBlock\n  title="Button"\n  language="tsx"\n  lineNumbers\n  code={'<Button>Continue</Button>'}\n/>`,
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-code-ink"
    >
      {children}
    </label>
  )
}

function FieldHelp({
  id,
  children,
  className,
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <p
      id={id}
      className={cn("mt-1.5 text-xs leading-5 text-code-muted", className)}
    >
      {children}
    </p>
  )
}

function timeZoneCityName(timeZone: string) {
  if (timeZone === "UTC" || timeZone === "Etc/UTC") return "UTC"
  return (timeZone.split("/").at(-1) ?? timeZone).replaceAll("_", " ")
}

function GeneralSpecimen({
  entryId,
  onNavigate,
}: {
  entryId: GeneralEntryId
  onNavigate: Navigate
}) {
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({})
  const actionTimeouts = useRef(new Map<string, number>())
  const [inputValue, setInputValue] = useState("")
  const [accentColor, setAccentColor] = useState("#0C315C")
  const [note, setNote] = useState("")
  const [quantity, setQuantity] = useState<number | string>(12)
  const [itemStatus, setItemStatus] = useState("active")
  const [includeArchived, setIncludeArchived] = useState(true)
  const [sortOrder, setSortOrder] = useState("recent")
  const [activeOnly, setActiveOnly] = useState(false)
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    () => new Date()
  )
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [timeOnly, setTimeOnly] = useState<string | null>("14:30")
  const [timeZone, setTimeZone] = useState<string | null>("Asia/Manila")
  const [meetingTime, setMeetingTime] = useState<Date | null>(() => {
    const today = new Date()
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      14,
      30
    )
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "design",
    "research",
  ])
  const [treeValue, setTreeValue] = useState("getting-started")
  const [expandedTreeIds, setExpandedTreeIds] = useState(["library", "guides"])
  const [bottomNavigationView, setBottomNavigationView] = useState("overview")
  const [dateRange, setDateRange] = useState<DateRangeValue>(() => {
    const today = new Date()
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - ((today.getDay() + 6) % 7)
    )
    return {
      from: monday,
      to: new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + 4
      ),
    }
  })
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [uploadBusy, setUploadBusy] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const uploadTimeout = useRef<number | null>(null)
  const uploadResetTimeout = useRef<number | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [popoverIncludeArchived, setPopoverIncludeArchived] = useState(false)
  const [popoverActiveOnly, setPopoverActiveOnly] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogSaveComplete, setDialogSaveComplete] = useState(false)
  const dialogSaveTimeout = useRef<number | null>(null)
  const [badgeIndex, setBadgeIndex] = useState(0)
  const [badgeAppearance, setBadgeAppearance] = useState<"minimal" | "tinted">(
    "tinted"
  )
  const [progressValue, setProgressValue] = useState(60)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [showEmptyState, setShowEmptyState] = useState(true)
  const [sortAscending, setSortAscending] = useState(true)
  const [metricPeriod, setMetricPeriod] = useState<
    "week" | "month" | "quarter"
  >("month")
  const prefersReducedMotion = useReducedMotion()

  const bottomNavigationItems: BottomNavigationItem[] = [
    { value: "overview", label: "Overview" },
    { value: "events", label: "Events" },
    { value: "profile", label: "Profile" },
  ]

  const actionKey = (action: string) => `${entryId}:${action}`

  const completeAction = (action: string) => {
    const key = actionKey(action)
    const currentTimeout = actionTimeouts.current.get(key)
    if (currentTimeout !== undefined) window.clearTimeout(currentTimeout)

    setActionStates((current) => ({ ...current, [key]: true }))
    const timeout = window.setTimeout(() => {
      setActionStates((current) => {
        if (!current[key]) return current
        const next = { ...current }
        delete next[key]
        return next
      })
      actionTimeouts.current.delete(key)
    }, 1800)
    actionTimeouts.current.set(key, timeout)
  }

  const actionIsComplete = (action: string) =>
    actionStates[actionKey(action)] === true

  const closeDialog = () => {
    if (dialogSaveTimeout.current !== null) {
      window.clearTimeout(dialogSaveTimeout.current)
      dialogSaveTimeout.current = null
    }
    setShowDialog(false)
  }

  const sampleDate = (date: Date | undefined | null) =>
    date
      ? new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(date)
      : "No date selected"

  useEffect(
    () => () => {
      if (uploadTimeout.current !== null) {
        window.clearTimeout(uploadTimeout.current)
      }
      if (uploadResetTimeout.current !== null) {
        window.clearTimeout(uploadResetTimeout.current)
      }
      for (const timeout of actionTimeouts.current.values()) {
        window.clearTimeout(timeout)
      }
      actionTimeouts.current.clear()
      if (dialogSaveTimeout.current !== null) {
        window.clearTimeout(dialogSaveTimeout.current)
      }
    },
    []
  )

  switch (entryId) {
    case "code-block":
      return (
        <div className="w-full max-w-3xl">
          <CodeBlock
            code={snippets.button}
            language="tsx"
            lineNumbers
            title="Button"
          />
        </div>
      )

    case "button":
      return (
        <div className="library__button-demo">
          <div className="library__button-demo-actions">
            <Button onClick={() => completeAction("button.save")}>
              <TextMorph
                as="span"
                duration={220}
                ease="cubic-bezier(0.19, 1, 0.22, 1)"
                respectReducedMotion
              >
                {actionIsComplete("button.save") ? "Saved" : "Save changes"}
              </TextMorph>
            </Button>
            <Button variant="outline" onClick={() => toast.info("Canceled")}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={() => toast.info("Opening item")}>
              View item
            </Button>
            <Button
              variant="destructive"
              onClick={() => completeAction("button.archive")}
            >
              <TextMorph
                as="span"
                duration={220}
                ease="cubic-bezier(0.19, 1, 0.22, 1)"
                respectReducedMotion
              >
                {actionIsComplete("button.archive")
                  ? "Archived"
                  : "Archive item"}
              </TextMorph>
            </Button>
          </div>
          <div className="library__button-demo-unavailable">
            <Button disabled>Unavailable action</Button>
          </div>
        </div>
      )

    case "button-group":
      return (
        <div className="w-full max-w-lg space-y-4">
          <ButtonGroup aria-label="Pagination controls">
            <Button
              onClick={() => toast.info("Showing the previous page")}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => toast.info("Showing the next page")}
              variant="outline"
            >
              Next
            </Button>
          </ButtonGroup>
          <div className="flex items-center gap-2">
            <Button
              className="min-w-[96px]"
              onClick={() => completeAction("button-group.add")}
              size="sm"
            >
              <TextMorph
                as="span"
                duration={220}
                ease="cubic-bezier(0.19, 1, 0.22, 1)"
                respectReducedMotion
              >
                {actionIsComplete("button-group.add") ? "Added" : "Add item"}
              </TextMorph>
            </Button>
            <Button
              className="min-w-[112px]"
              onClick={() => toast.info("Opening item")}
              size="sm"
              variant="outline"
            >
              Open item
            </Button>
          </div>
        </div>
      )

    case "input": {
      const isShort = inputValue.length > 0 && inputValue.trim().length < 5
      return (
        <div className="w-full max-w-md">
          <FieldLabel htmlFor="general-item-name">Display name</FieldLabel>
          <Input
            id="general-item-name"
            value={inputValue}
            onChange={(event) => setInputValue(event.currentTarget.value)}
            aria-invalid={isShort || undefined}
            aria-describedby="general-item-help"
            placeholder="e.g. Design notes"
          />
          <FieldError
            id="general-item-help"
            className={cn("mt-1.5 text-xs", !isShort && "text-code-muted")}
            role={isShort ? "alert" : undefined}
          >
            {isShort ? "Use 5+ characters." : "Minimum 5 characters."}
          </FieldError>
        </div>
      )
    }

    case "color-picker":
      return (
        <div className="w-full max-w-lg rounded-xl bg-code-surface p-5 shadow-[0_1px_2px_rgb(12_29_48/6%),0_10px_30px_-22px_rgb(12_29_48/24%)] sm:p-6">
          <div className="grid gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-code-ink">Accent color</p>
              <p className="mt-1 text-sm text-code-muted">
                Applied to links and focus states
              </p>
            </div>
            <ColorPicker
              ariaLabel="Accent color"
              onValueChange={setAccentColor}
              swatches={[
                { value: "#06192F", label: "Navy" },
                { value: "#0C315C", label: "Blue" },
                { value: "#4986AC", label: "Sky" },
                { value: "#D7DFE9", label: "Mist" },
              ]}
              value={accentColor}
            />
          </div>
          <div
            className="mt-5 h-14 rounded-lg transition-colors duration-200 motion-reduce:transition-none"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      )

    case "textarea":
      return (
        <div className="w-full max-w-lg">
          <FieldLabel htmlFor="general-note">Note</FieldLabel>
          <Textarea
            id="general-note"
            value={note}
            maxLength={240}
            onChange={(event) => setNote(event.currentTarget.value)}
            aria-describedby="general-note-help general-note-count"
            placeholder="Add a few details"
          />
          <div className="mt-1.5 flex items-start justify-between gap-4">
            <FieldHelp id="general-note-help" className="mt-0">
              240 characters max
            </FieldHelp>
            <span
              id="general-note-count"
              className="shrink-0 text-xs text-code-muted tabular-nums"
            >
              {note.length}/240
            </span>
          </div>
        </div>
      )

    case "number-field":
      return (
        <div className="w-full max-w-xs">
          <FieldLabel htmlFor="general-quantity">Quantity</FieldLabel>
          <NumberField
            aria-label="Quantity"
            id="general-quantity"
            value={quantity}
            onValueChange={(value) => setQuantity(value ?? "")}
            min={0}
            max={99}
            aria-describedby="general-quantity-help"
          />
          <FieldHelp id="general-quantity-help">0–99</FieldHelp>
        </div>
      )

    case "select":
      return (
        <div className="w-full max-w-sm">
          <FieldLabel htmlFor="general-item-status">Status</FieldLabel>
          <Select value={itemStatus} onValueChange={setItemStatus}>
            <SelectTrigger id="general-item-status" aria-label="Status">
              <SelectValue placeholder="Choose a status" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">In progress</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    case "checkbox":
      return (
        <div className="w-full max-w-md space-y-4">
          <label
            htmlFor="general-include-archived"
            className="flex cursor-pointer items-start gap-3"
          >
            <Checkbox
              id="general-include-archived"
              checked={includeArchived}
              onCheckedChange={(checked) =>
                setIncludeArchived(checked === true)
              }
            />
            <span className="grid gap-0.5">
              <span className="text-sm font-medium text-code-ink">
                Include archived items
              </span>
              <span className="text-xs leading-5 text-code-muted">
                Items that are no longer current
              </span>
            </span>
          </label>
        </div>
      )

    case "radio-group": {
      const orderedItems = [...previewItems].sort((first, second) => {
        if (sortOrder === "name") return first.name.localeCompare(second.name)
        if (sortOrder === "status")
          return first.status.localeCompare(second.status)
        return first.recency - second.recency
      })
      return (
        <fieldset className="w-full max-w-md">
          <legend className="mb-3 text-sm font-medium text-code-ink">
            Sort items
          </legend>
          <RadioGroup
            value={sortOrder}
            onValueChange={setSortOrder}
            aria-label="Sort items"
          >
            {[
              ["recent", "Recently updated"],
              ["name", "Name"],
              ["status", "Status"],
            ].map(([value, label]) => (
              <label
                key={value}
                htmlFor={`general-order-${value}`}
                className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-code-ink"
              >
                <RadioGroupItem id={`general-order-${value}`} value={value} />
                {label}
              </label>
            ))}
          </RadioGroup>
          <ul aria-label="Items" className="mt-4 grid gap-3">
            {orderedItems.map((item) => (
              <li
                className="flex items-center justify-between gap-4 text-sm"
                key={item.name}
              >
                <span className="font-medium text-code-ink">{item.name}</span>
                <span className="text-xs text-code-muted">
                  {sortOrder === "status" ? item.status : item.updated}
                </span>
              </li>
            ))}
          </ul>
          <span className="sr-only" role="status" aria-live="polite">
            Sorted by{" "}
            {sortOrder === "recent"
              ? "recent activity"
              : sortOrder === "name"
                ? "name"
                : "status"}
          </span>
        </fieldset>
      )
    }

    case "switch": {
      const visibleItems = previewItems.filter(
        (item) => !activeOnly || !item.archived
      )
      return (
        <div className="grid w-full max-w-md gap-5">
          <div className="flex items-center justify-between gap-5">
            <label
              htmlFor="general-active-only"
              className="text-sm font-medium text-code-ink"
            >
              Current items only
            </label>
            <Switch
              id="general-active-only"
              checked={activeOnly}
              onCheckedChange={setActiveOnly}
            />
          </div>
          <ul aria-label="Items" className="grid gap-3">
            {visibleItems.map((item) => (
              <li
                className="flex items-center justify-between gap-4 text-sm"
                key={item.name}
              >
                <span className="font-medium text-code-ink">{item.name}</span>
                <span className="text-xs text-code-muted">
                  {item.archived ? "Archived" : "Active"}
                </span>
              </li>
            ))}
          </ul>
          <span className="sr-only" role="status" aria-live="polite">
            {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}{" "}
            shown
          </span>
        </div>
      )
    }

    case "calendar":
      return (
        <div className="grid w-full max-w-sm justify-items-center gap-3">
          <Calendar
            selected={calendarDate ?? null}
            onSelect={setCalendarDate}
            locale="en-PH"
            weekStartsOn={0}
          />
          <p
            className="text-xs text-code-muted"
            role="status"
            aria-live="polite"
          >
            Selected date: {sampleDate(calendarDate)}
          </p>
        </div>
      )

    case "events-calendar":
      return (
        <EventsCalendar
          className="events-calendar-specimen"
          events={eventsCalendarDemoEvents}
          locale="en-PH"
          defaultMonth={eventsCalendarToday}
          defaultSelectedDate={eventsCalendarDemoEvents[1]!.start}
        />
      )

    case "date-picker":
      return (
        <div className="w-full max-w-sm">
          <label
            htmlFor="general-due-date"
            className="mb-1.5 block text-sm font-medium text-code-ink"
          >
            Due date
          </label>
          <DatePicker
            id="general-due-date"
            aria-label="Due date"
            value={dueDate}
            onValueChange={(date) => setDueDate(date ?? null)}
            placeholder="Choose a date"
          />
        </div>
      )

    case "date-range-picker":
      return (
        <div className="w-full max-w-xl">
          <DateRangePicker
            locale="en-PH"
            onValueChange={setDateRange}
            value={dateRange}
          />
        </div>
      )

    case "time-picker":
      return (
        <div className="w-full max-w-xs">
          <TimePicker
            aria-label="Time"
            locale="en-PH"
            onValueChange={setTimeOnly}
            value={timeOnly}
          />
        </div>
      )

    case "time-zone-picker":
      return (
        <div className="w-full max-w-xs space-y-1.5">
          <label
            className="block text-sm font-medium text-code-ink"
            htmlFor="general-time-zone"
          >
            Team time zone
          </label>
          <TimeZonePicker
            id="general-time-zone"
            locale="en-PH"
            onValueChange={setTimeZone}
            value={timeZone}
          />
          {timeZone ? (
            <p
              aria-live="polite"
              className="pt-1 text-xs text-code-muted"
              role="status"
            >
              Scheduling uses {timeZoneCityName(timeZone)} time.
            </p>
          ) : null}
        </div>
      )

    case "date-time-picker":
      return (
        <div className="w-full max-w-xl space-y-3">
          <DateTimePicker
            aria-label="Meeting date and time"
            locale="en-PH"
            onValueChange={setMeetingTime}
            value={meetingTime}
          />
          {meetingTime ? (
            <p
              aria-live="polite"
              className="text-xs text-code-muted"
              role="status"
            >
              {new Intl.DateTimeFormat("en-PH", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(meetingTime)}
            </p>
          ) : null}
        </div>
      )

    case "multi-select":
      return (
        <div className="w-full max-w-sm">
          <MultiSelect
            ariaLabel="Categories"
            onValueChange={setSelectedCategories}
            options={categoryOptions}
            value={selectedCategories}
          />
        </div>
      )

    case "file-upload":
      return (
        <div className="w-full max-w-xl space-y-3">
          <FileUpload
            accept=".csv,.pdf,image/*"
            description="CSV, PDF, or image · Up to 3 files, 5 MB each"
            maxFiles={3}
            maxSize={5 * 1024 * 1024}
            onValueChange={(files) => {
              setUploadFiles(files)
              setUploadComplete(false)
              if (uploadResetTimeout.current !== null) {
                window.clearTimeout(uploadResetTimeout.current)
                uploadResetTimeout.current = null
              }
            }}
            value={uploadFiles}
            busy={uploadBusy}
          />
          {uploadFiles.length > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <Button
                aria-live="polite"
                className="min-w-[112px]"
                disabled={uploadBusy}
                onClick={() => {
                  setUploadBusy(true)
                  uploadTimeout.current = window.setTimeout(() => {
                    setUploadBusy(false)
                    setUploadComplete(true)
                    uploadTimeout.current = null
                    uploadResetTimeout.current = window.setTimeout(() => {
                      setUploadComplete(false)
                      uploadResetTimeout.current = null
                    }, 1800)
                  }, 900)
                }}
                size="sm"
              >
                <TextMorph
                  as="span"
                  duration={220}
                  ease="cubic-bezier(0.19, 1, 0.22, 1)"
                  respectReducedMotion
                >
                  {uploadBusy
                    ? "Uploading"
                    : uploadComplete
                      ? "Uploaded"
                      : "Upload files"}
                </TextMorph>
              </Button>
            </div>
          ) : null}
        </div>
      )

    case "bottom-navigation": {
      const currentView =
        bottomNavigationView === "events"
          ? { title: "Upcoming events", detail: "1:30 PM · Member check-in" }
          : bottomNavigationView === "profile"
            ? { title: "Profile", detail: "Maya Lee · Workspace member" }
            : { title: "Team overview", detail: "24 team members" }

      return (
        <section
          aria-label="Workspace preview"
          className="mx-auto grid min-h-[320px] w-full max-w-2xl grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl bg-code-canvas shadow-[0_1px_2px_color-mix(in_srgb,var(--code-hero)_10%,transparent),0_18px_36px_-28px_color-mix(in_srgb,var(--code-hero)_25%,transparent)]"
        >
          <header className="flex min-h-12 items-center justify-between px-5">
            <span className="text-xs font-semibold text-code-muted">
              Studio workspace
            </span>
            <Avatar aria-label="Maya Lee" className="size-8">
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
          </header>
          <div
            aria-live="polite"
            className="grid content-center gap-4 px-5 py-5"
          >
            <div>
              <p className="m-0 text-xs text-code-muted">Monday, November 9</p>
              <h3 className="mt-1 text-lg leading-6 font-semibold text-code-ink">
                {currentView.title}
              </h3>
            </div>
            <div className="flex min-h-14 items-center justify-between gap-3 rounded-xl bg-code-surface px-4 py-3 shadow-[0_1px_2px_color-mix(in_srgb,var(--code-hero)_8%,transparent)]">
              <span className="min-w-0 truncate text-sm font-medium text-code-ink">
                {currentView.detail}
              </span>
            </div>
          </div>
          <BottomNavigation
            items={bottomNavigationItems}
            label="Workspace pages"
            onValueChange={setBottomNavigationView}
            value={bottomNavigationView}
          />
        </section>
      )
    }

    case "tabs":
      return (
        <Tabs defaultValue="items" className="w-full max-w-xl">
          <TabsList aria-label="Content views">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="items">
            <ItemGroup className="pt-3">
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>Design notes</ItemTitle>
                  <ItemDescription>Updated today</ItemDescription>
                </ItemContent>
              </Item>
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>Color palette</ItemTitle>
                  <ItemDescription>Updated yesterday</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </TabsContent>
          <TabsContent value="people">
            <ItemGroup className="pt-3">
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>Ava Chen</ItemTitle>
                  <ItemDescription>Editor</ItemDescription>
                </ItemContent>
              </Item>
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>Noah Cruz</ItemTitle>
                  <ItemDescription>Editor</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </TabsContent>
          <TabsContent value="activity">
            <ItemGroup className="pt-3">
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>New file uploaded</ItemTitle>
                  <ItemDescription>Research notes · 9:41 AM</ItemDescription>
                </ItemContent>
              </Item>
              <Item size="sm">
                <ItemContent>
                  <ItemTitle>Item updated</ItemTitle>
                  <ItemDescription>Design notes · Yesterday</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </TabsContent>
        </Tabs>
      )

    case "breadcrumb":
      return (
        <Breadcrumb className="w-full max-w-2xl">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#home" onClick={() => onNavigate("home")}>
                Library
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#card" onClick={() => onNavigate("card")}>
                Guides
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Getting started</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

    case "accordion":
      return (
        <Accordion
          className="w-full max-w-xl border-y border-code-line"
          type="single"
          collapsible
          defaultValue="visibility"
        >
          <AccordionItem value="visibility">
            <AccordionTrigger>Who can view this?</AccordionTrigger>
            <AccordionContent>Choose who can see this page.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="notifications">
            <AccordionTrigger>Notifications</AccordionTrigger>
            <AccordionContent>
              Choose which updates you receive.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case "dropdown-menu":
      return (
        <div className="grid w-full max-w-sm justify-items-start gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Item actions <MoreHorizontal aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Design notes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast.success("Item opened")}>
                Open item
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => toast.success("Details opened")}
              >
                Edit details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast.success("Item archived")}>
                Archive item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )

    case "popover": {
      const filterItems = [
        {
          name: "Quarterly plan",
          updated: "Today",
          active: true,
          archived: false,
        },
        {
          name: "Workshop notes",
          updated: "Yesterday",
          active: true,
          archived: false,
        },
        {
          name: "Team priorities",
          updated: "Oct 28",
          active: false,
          archived: false,
        },
        {
          name: "Planning draft",
          updated: "Oct 24",
          active: false,
          archived: true,
        },
      ]
      const visibleItems = filterItems.filter(
        (item) =>
          (popoverIncludeArchived || !item.archived) &&
          (!popoverActiveOnly || item.active)
      )
      const visibleItemCount = visibleItems.length
      const activeFilterCount =
        Number(popoverActiveOnly) + Number(popoverIncludeArchived)

      return (
        <div className="w-full max-w-sm">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                aria-expanded={popoverOpen}
                className="min-w-32"
                variant="outline"
              >
                <TextMorph
                  as="span"
                  duration={180}
                  numbers
                  respectReducedMotion
                >
                  {activeFilterCount
                    ? `Filters · ${activeFilterCount}`
                    : "Filters"}
                </TextMorph>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              aria-labelledby="general-popover-title"
              className="w-72 p-3"
            >
              <div className="grid gap-3">
                <FieldSet className="gap-1">
                  <FieldLegend className="mb-0" id="general-popover-title">
                    Show items
                  </FieldLegend>
                  <div className="grid gap-0.5">
                    <div className="flex min-h-10 items-center gap-3">
                      <Checkbox
                        id="general-popover-active"
                        checked={popoverActiveOnly}
                        onCheckedChange={(checked) =>
                          setPopoverActiveOnly(checked === true)
                        }
                      />
                      <Label
                        className="min-h-10 flex-1 cursor-pointer font-normal leading-normal"
                        htmlFor="general-popover-active"
                      >
                        Active only
                      </Label>
                    </div>
                    <div className="flex min-h-10 items-center gap-3">
                      <Checkbox
                        id="general-popover-archived"
                        checked={popoverIncludeArchived}
                        onCheckedChange={(checked) =>
                          setPopoverIncludeArchived(checked === true)
                        }
                      />
                      <Label
                        className="min-h-10 flex-1 cursor-pointer font-normal leading-normal"
                        htmlFor="general-popover-archived"
                      >
                        Include archived items
                      </Label>
                    </div>
                  </div>
                </FieldSet>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    className="min-h-10"
                    disabled={!popoverActiveOnly && !popoverIncludeArchived}
                    onClick={() => {
                      setPopoverActiveOnly(false)
                      setPopoverIncludeArchived(false)
                    }}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    Clear
                  </Button>
                  <Button
                    className="min-h-10"
                    onClick={() => setPopoverOpen(false)}
                    size="sm"
                    type="button"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <ul aria-label="Filtered items" className="mt-3 grid gap-0.5">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleItems.map((item) => (
                <motion.li
                  key={item.name}
                  layout={prefersReducedMotion ? false : "position"}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -3 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                  }
                  className="flex min-h-10 items-center justify-between gap-4 rounded-md px-2 text-sm"
                >
                  <span className="font-medium text-code-ink">{item.name}</span>
                  <span className="shrink-0 text-xs text-code-muted">
                    {item.updated}
                  </span>
                </motion.li>
              ))}
              {visibleItems.length === 0 ? (
                <motion.li
                  key="no-match"
                  layout={prefersReducedMotion ? false : "position"}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -3 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                  }
                  className="px-2 py-2 text-sm text-code-muted"
                >
                  No items match
                </motion.li>
              ) : null}
            </AnimatePresence>
          </ul>
          <p
            aria-atomic="true"
            aria-live="polite"
            className="mt-1 px-2 text-xs text-code-muted tabular-nums"
            role="status"
          >
            <TextMorph as="span" duration={220} respectReducedMotion>
              {`${visibleItemCount} ${visibleItemCount === 1 ? "item" : "items"}`}
            </TextMorph>
          </p>
        </div>
      )
    }

    case "tooltip":
      return (
        <TooltipProvider delayDuration={250}>
          <div className="flex items-center gap-3">
            <span className="text-sm text-code-ink">More information</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="More information"
                  size="icon-sm"
                  variant="ghost"
                >
                  <CircleHelp aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Last updated today</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )

    case "dialog":
      return (
        <div className="grid w-full max-w-sm justify-items-start gap-3">
          <Dialog
            open={showDialog}
            onOpenChange={(open) => {
              if (dialogSaveTimeout.current !== null) {
                window.clearTimeout(dialogSaveTimeout.current)
                dialogSaveTimeout.current = null
              }
              setShowDialog(open)
              if (open) setDialogSaveComplete(false)
            }}
          >
            <DialogTrigger asChild>
              <Button>Open item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add item</DialogTitle>
                <DialogDescription>
                  Add a title and short description
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <Label htmlFor="general-item-title">Item title</Label>
                <Input
                  defaultValue="Design notes"
                  id="general-item-title"
                  placeholder="Item title"
                />
              </div>
              <DialogFooter>
                <Button onClick={closeDialog} variant="outline">
                  Cancel
                </Button>
                <Button
                  aria-live="polite"
                  className="min-w-[136px]"
                  onClick={() => {
                    if (dialogSaveTimeout.current !== null) {
                      window.clearTimeout(dialogSaveTimeout.current)
                    }
                    setDialogSaveComplete(true)
                    dialogSaveTimeout.current = window.setTimeout(() => {
                      setDialogSaveComplete(false)
                      dialogSaveTimeout.current = null
                    }, 1800)
                  }}
                >
                  <TextMorph
                    as="span"
                    duration={220}
                    ease="cubic-bezier(0.19, 1, 0.22, 1)"
                    respectReducedMotion
                  >
                    {dialogSaveComplete ? "Added" : "Add item"}
                  </TextMorph>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )

    case "badge": {
      const states = [
        { label: "Draft", tone: "neutral" as const },
        { label: "In progress", tone: "warning" as const },
        { label: "Complete", tone: "positive" as const },
      ]
      const state = states[badgeIndex % states.length]!
      return (
        <div className="grid w-full max-w-sm gap-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-code-muted">Appearance</span>
            <Select
              onValueChange={(value) => {
                if (value === "minimal" || value === "tinted") {
                  setBadgeAppearance(value)
                }
              }}
              value={badgeAppearance}
            >
              <SelectTrigger aria-label="Badge appearance" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="tinted">Tinted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex min-h-10 items-center justify-between gap-3">
            <Badge
              aria-live="polite"
              appearance={badgeAppearance}
              role="status"
              tone={state.tone}
            >
              <TextMorph
                as="span"
                duration={220}
                ease="cubic-bezier(0.19, 1, 0.22, 1)"
                respectReducedMotion
              >
                {state.label}
              </TextMorph>
            </Badge>
            <Button
              onClick={() => setBadgeIndex((current) => current + 1)}
              size="sm"
              variant="outline"
            >
              Change status
            </Button>
          </div>
        </div>
      )
    }

    case "alert":
      return (
        <div className="w-full max-w-xl">
          <Alert
            icon={<Info size={17} />}
            role="alert"
            title="Unsaved changes"
            tone="warning"
          >
            <p className="text-sm leading-6">
              Save your edits before leaving this page.
            </p>
          </Alert>
        </div>
      )

    case "progress":
      return (
        <div className="w-full max-w-lg space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor="general-progress-value"
              className="text-sm font-medium text-code-ink"
            >
              Upload progress
            </label>
            <output
              htmlFor="general-progress-value"
              className="text-sm text-code-muted tabular-nums"
            >
              {progressValue}%
            </output>
          </div>
          <Progress aria-label="Upload progress" value={progressValue} />
          <label
            htmlFor="general-progress-value"
            className="block text-xs text-code-muted"
          >
            Progress value
          </label>
          <input
            id="general-progress-value"
            type="range"
            min="0"
            max="100"
            value={progressValue}
            onChange={(event) =>
              setProgressValue(Number(event.currentTarget.value))
            }
            className="h-8 w-full accent-code-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-code-accent"
          />
        </div>
      )

    case "skeleton": {
      const files = [
        { name: "Getting started", updated: "Today" },
        { name: "Design notes", updated: "Yesterday" },
        { name: "Reference guide", updated: "Oct 30" },
      ]

      return (
        <div className="w-full max-w-2xl space-y-4">
          <div className="flex justify-end">
            <Button
              aria-pressed={showSkeleton}
              className="min-w-32"
              onClick={() => setShowSkeleton((visible) => !visible)}
              size="sm"
              variant="outline"
            >
              {showSkeleton ? "Show content" : "Show skeleton"}
            </Button>
          </div>
          <SkeletonReveal
            id="recent-files"
            label="Loading recent files"
            loading={showSkeleton}
            skeleton={
              <section
                aria-hidden="true"
                className="rounded-2xl bg-code-surface p-5 shadow-[0_1px_2px_rgb(12_29_48/5%),0_10px_28px_-24px_rgb(12_29_48/24%)]"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="grid gap-1">
                  {files.map((file) => (
                    <div
                      className="flex min-h-12 items-center gap-3 px-2"
                      key={file.name}
                    >
                      <Skeleton className="size-8 shrink-0 rounded-lg" />
                      <Skeleton className="h-3.5 w-36 max-w-[45%]" />
                      <Skeleton className="ml-auto h-3 w-16" />
                    </div>
                  ))}
                </div>
              </section>
            }
          >
            <section
              aria-label="Recent files"
              className="rounded-2xl bg-code-surface p-5 shadow-[0_1px_2px_rgb(12_29_48/5%),0_10px_28px_-24px_rgb(12_29_48/24%)]"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="m-0 text-sm font-semibold text-code-ink">
                  Recent files
                </h3>
                <span className="text-xs text-code-muted">
                  {files.length} items
                </span>
              </div>
              <ul className="m-0 grid list-none gap-1 p-0">
                {files.map((file) => (
                  <li
                    className="flex min-h-12 items-center gap-3 rounded-lg px-2"
                    key={file.name}
                  >
                    <span
                      aria-hidden="true"
                      className="size-8 shrink-0 rounded-lg bg-code-accent-soft"
                    />
                    <span className="text-sm font-medium text-code-ink">
                      {file.name}
                    </span>
                    <span className="ml-auto text-xs text-code-muted">
                      {file.updated}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </SkeletonReveal>
        </div>
      )
    }

    case "empty-state":
      return (
        <div className="w-full max-w-lg py-3">
          {showEmptyState ? (
            <EmptyState
              aria-labelledby="empty-items-title"
              className="justify-items-start px-0 py-5 text-left"
            >
              <EmptyStateTitle id="empty-items-title">
                No results
              </EmptyStateTitle>
              <EmptyStateDescription>Try another search.</EmptyStateDescription>
              <EmptyStateAction className="justify-start">
                <Button
                  onClick={() => setShowEmptyState(false)}
                  size="sm"
                  variant="outline"
                >
                  Clear search
                </Button>
              </EmptyStateAction>
            </EmptyState>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <h3 className="text-sm font-medium text-code-ink">
                  Search cleared
                </h3>
                <p className="mt-1 text-xs text-code-muted">
                  All items are visible.
                </p>
              </div>
              <Button
                onClick={() => setShowEmptyState(true)}
                size="sm"
                variant="ghost"
              >
                Restore empty state
              </Button>
            </div>
          )}
        </div>
      )

    case "toast":
      return (
        <Button onClick={() => toast.success("Changes saved")} size="sm">
          Save changes
        </Button>
      )

    case "avatar":
      return (
        <div className="flex w-full max-w-lg items-center gap-4">
          <div className="flex -space-x-2" role="group" aria-label="People">
            <Avatar
              className="size-11 border-2 border-code-surface"
              role="img"
              aria-label="Contributor A"
            >
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar
              className="size-11 border-2 border-code-surface"
              role="img"
              aria-label="Contributor B"
            >
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar
              className="size-11 border-2 border-code-surface"
              role="img"
              aria-label="Contributor C"
            >
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-medium text-code-ink">People</p>
          </div>
        </div>
      )

    case "card":
      return (
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Quick note</CardTitle>
              <CardDescription>
                A title and short summary in one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-code-ink">
                Write something worth remembering.
              </p>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                className="min-w-[112px]"
                onClick={() => toast.info("Opening details")}
                size="sm"
                variant="outline"
              >
                View details
              </Button>
            </CardFooter>
          </Card>
        </div>
      )

    case "item":
      return (
        <ItemGroup className="w-full max-w-xl">
          <Item
            interactive
            onClick={() => toast.info("Opening item")}
            variant="outline"
          >
            <ItemContent>
              <ItemTitle>Design notes</ItemTitle>
              <ItemDescription>Updated yesterday · 12 pages</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-code-muted"
              />
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Reference guide</ItemTitle>
              <ItemDescription>Updated today · 24 pages</ItemDescription>
            </ItemContent>
            <ItemActions>
              <span className="text-xs text-code-muted">Today</span>
            </ItemActions>
          </Item>
        </ItemGroup>
      )

    case "metric-card": {
      const metrics = {
        week: {
          value: 24,
          change: "+4",
          comparison: "from the prior week",
          line: "M 4 54 C 20 48 29 34 45 37 C 61 40 72 53 88 43 C 104 33 114 26 130 28 C 146 30 157 16 172 12",
          point: 12,
        },
        month: {
          value: 86,
          change: "+12",
          comparison: "from the prior month",
          line: "M 4 56 C 21 51 29 30 45 33 C 61 36 72 46 88 36 C 104 26 114 19 130 22 C 146 25 157 12 172 8",
          point: 8,
        },
        quarter: {
          value: 218,
          change: "+28",
          comparison: "from the prior quarter",
          line: "M 4 58 C 20 49 29 42 45 43 C 61 44 72 29 88 32 C 104 35 114 16 130 18 C 146 20 157 9 172 6",
          point: 6,
        },
      } as const
      const metric = metrics[metricPeriod]
      const area = `${metric.line} L 172 68 L 4 68 Z`
      const chartTransition = prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.46, ease: [0.22, 1, 0.36, 1] as const }

      return (
        <div className="grid w-full max-w-4xl gap-5">
          <ToggleGroup
            aria-label="Activity period"
            className="justify-self-end border-0 bg-transparent p-0"
            onValueChange={(value) => {
              if (value) setMetricPeriod(value as typeof metricPeriod)
            }}
            type="single"
            value={metricPeriod}
          >
            <ToggleGroupItem className="min-h-10 px-3 text-xs" value="week">
              7D
            </ToggleGroupItem>
            <ToggleGroupItem className="min-h-10 px-3 text-xs" value="month">
              30D
            </ToggleGroupItem>
            <ToggleGroupItem className="min-h-10 px-3 text-xs" value="quarter">
              90D
            </ToggleGroupItem>
          </ToggleGroup>
          <MetricCard
            change={metric.change}
            className="w-full p-5 sm:p-6"
            comparison={metric.comparison}
            label="Files reviewed"
            tone="positive"
            value={metric.value}
            visual={
              <svg
                aria-label={`Files reviewed trend for the ${metricPeriod} period`}
                className="h-16 w-40 max-w-full"
                fill="none"
                role="img"
                viewBox="0 0 176 72"
              >
                <path
                  d="M 4 22 H 172 M 4 45 H 172 M 4 68 H 172"
                  stroke="var(--code-line)"
                  strokeWidth="1"
                />
                <motion.path
                  animate={{ d: area }}
                  d={area}
                  fill="var(--code-accent-soft)"
                  initial={false}
                  transition={chartTransition}
                />
                <motion.path
                  animate={{ d: metric.line }}
                  d={metric.line}
                  initial={false}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.25"
                  transition={chartTransition}
                />
                <motion.circle
                  animate={{ cy: metric.point }}
                  cx="172"
                  cy={metric.point}
                  fill="currentColor"
                  initial={false}
                  r="3.5"
                  transition={chartTransition}
                />
              </svg>
            }
          />
        </div>
      )
    }

    case "tree-view":
      return (
        <div className="w-full max-w-sm space-y-3">
          <TreeView
            aria-label="Library items"
            expandedIds={expandedTreeIds}
            items={libraryItems}
            onExpandedChange={setExpandedTreeIds}
            onValueChange={setTreeValue}
            value={treeValue}
          />
          <p
            aria-live="polite"
            className="text-xs text-code-muted"
            role="status"
          >
            {treeValue === "getting-started"
              ? "Getting started"
              : treeValue === "shortcuts"
                ? "Keyboard shortcuts"
                : treeValue === "shared"
                  ? "Shared items"
                  : treeValue === "archive"
                    ? "Archive"
                    : "Library"}
          </p>
        </div>
      )

    case "table": {
      const rows = [
        {
          name: "Design notes",
          category: "Writing",
          status: "In progress",
        },
        {
          name: "Color palette",
          category: "Design",
          status: "Planned",
        },
        {
          name: "Photo archive",
          category: "Photography",
          status: "Complete",
        },
      ].sort((a, b) =>
        sortAscending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )

      return (
        <div className="w-full max-w-3xl">
          <Table>
            <TableCaption>Recent items</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  scope="col"
                  aria-sort={sortAscending ? "ascending" : "descending"}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-code-accent/35"
                    onClick={() => setSortAscending((ascending) => !ascending)}
                  >
                    Name{" "}
                    <ChevronsUpDown aria-hidden="true" className="size-3.5" />
                  </button>
                </TableHead>
                <TableHead scope="col">Category</TableHead>
                <TableHead scope="col">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p
            className="mt-2 text-xs text-code-muted"
            role="status"
            aria-live="polite"
          >
            Name · {sortAscending ? "A to Z" : "Z to A"}
          </p>
        </div>
      )
    }

    case "separator":
      return (
        <div className="w-full max-w-lg">
          <section aria-labelledby="separator-details-title">
            <h3
              id="separator-details-title"
              className="text-sm font-medium text-code-ink"
            >
              Details
            </h3>
            <p className="mt-1 text-sm leading-6 text-code-muted">
              Updated today
            </p>
          </section>
          <Separator className="my-5" />
          <section aria-labelledby="separator-activity-title">
            <h3
              id="separator-activity-title"
              className="text-sm font-medium text-code-ink"
            >
              Recent activity
            </h3>
            <p className="mt-1 text-sm leading-6 text-code-muted">
              Updated today
            </p>
          </section>
        </div>
      )
  }
}

export function renderGeneralSpecimen(
  entryId: string,
  onNavigate: Navigate
): ReactNode | null {
  if (!generalEntryIds.includes(entryId as GeneralEntryId)) return null
  return (
    <GeneralSpecimen
      entryId={entryId as GeneralEntryId}
      onNavigate={onNavigate}
    />
  )
}

export function getGeneralSnippet(entryId: string): string {
  return snippets[entryId as GeneralEntryId] ?? ""
}
