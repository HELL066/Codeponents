import { lazy, useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { TextMorph } from "torph/react"
import { CopyButton } from "@/components/ui/copy-button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { NativeSelect } from "@/components/ui/native-select"
import { Combobox } from "@/components/ui/combobox"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ProgressRing } from "@/components/ui/progress-ring"
import { Spinner } from "@/components/ui/spinner"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaViewport,
} from "@/components/ui/scroll-area"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel"
import { Kbd } from "@/components/ui/kbd"
import { ShaderCanvas } from "@/components/ui/shader-canvas"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { libraryEntries, libraryGroups } from "./library-data"

const ChartSpecimen = lazy(() => import("./chart-specimen"))

function CarouselTextControls() {
  const { selectedIndex, scrollSnaps, scrollTo } = useCarousel()
  const slideCount = Math.max(scrollSnaps.length, 1)

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <span
          aria-label={`Page ${selectedIndex + 1} of ${slideCount}`}
          aria-live="polite"
          className="inline-flex min-w-16 items-baseline gap-1 text-xs text-code-muted tabular-nums"
        >
          <TextMorph as="span" duration={220} numbers respectReducedMotion>
            {String(selectedIndex + 1).padStart(2, "0")}
          </TextMorph>
          <span aria-hidden="true">
            / {String(slideCount).padStart(2, "0")}
          </span>
        </span>
        <div
          aria-label="Choose a page"
          className="flex items-center gap-0.5"
          role="group"
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-current={selectedIndex === index ? "page" : undefined}
              aria-label={`Go to page ${index + 1}`}
              data-carousel-control=""
              onClick={() => scrollTo(index)}
              className="group flex size-11 items-center justify-center rounded-full transition-[background-color,transform,scale] duration-150 outline-none hover:bg-code-quiet focus-visible:ring-2 focus-visible:ring-code-accent active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-1 rounded-full transition-[width,background-color] duration-200 motion-reduce:transition-none",
                  selectedIndex === index
                    ? "w-3.5 bg-code-ink"
                    : "w-1 bg-code-line/80 group-hover:bg-code-muted"
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <CarouselPrevious aria-label="Previous events" />
        <CarouselNext aria-label="Next events" />
      </div>
    </div>
  )
}

function CarouselEdgeNavigation() {
  const { viewportElementRef, orientation, scrollPrev, scrollNext } =
    useCarousel()

  useEffect(() => {
    const viewport = viewportElementRef.current
    if (!viewport || orientation !== "horizontal") return

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.detail === 0) return
      if (
        event.target instanceof Element &&
        event.target.closest(
          "button, a, input, select, textarea, [role='button'], [data-carousel-control]"
        )
      ) {
        return
      }

      const rect = viewport.getBoundingClientRect()
      if (!rect.width) return

      const edgeWidth = Math.min(64, rect.width * 0.16)
      const x = event.clientX - rect.left
      if (x <= edgeWidth) scrollPrev()
      else if (x >= rect.width - edgeWidth) scrollNext()
    }

    viewport.addEventListener("click", handleClick)
    return () => viewport.removeEventListener("click", handleClick)
  }, [orientation, scrollNext, scrollPrev, viewportElementRef])

  return null
}

function EventCarouselDemo() {
  const events = [
    {
      dateTime: "2026-11-12T10:30:00",
      date: "Thu, Nov 12 · 10:30 AM",
      duration: "45 min",
      title: "Design review",
      description: "Walk through the latest release",
    },
    {
      dateTime: "2026-11-18T13:00:00",
      date: "Wed, Nov 18 · 1:00 PM",
      duration: "30 min",
      title: "Research playback",
      description: "Share what the team learned",
    },
    {
      dateTime: "2026-11-24T15:30:00",
      date: "Tue, Nov 24 · 3:30 PM",
      duration: "45 min",
      title: "Team retro",
      description: "Capture highlights and next steps",
    },
    {
      dateTime: "2026-12-02T14:00:00",
      date: "Wed, Dec 2 · 2:00 PM",
      duration: "30 min",
      title: "Planning session",
      description: "Set priorities for the next cycle",
    },
  ]
  return (
    <Carousel
      aria-label="Upcoming events"
      className="w-full max-w-2xl"
      opts={{ align: "start", slidesToScroll: 1 }}
    >
      <CarouselEdgeNavigation />
      <CarouselContent>
        {events.map((event) => (
          <CarouselItem key={event.dateTime} className="basis-full">
            <Card className="h-full min-h-48 overflow-hidden rounded-2xl border-code-line/45 bg-code-surface shadow-[0_12px_28px_-22px_rgb(6_25_47/38%)]">
              <CardContent className="grid min-h-48 gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:p-6">
                <div className="grid content-start gap-2">
                  <CardTitle className="font-heading text-xl leading-tight font-normal tracking-[-0.02em] text-code-ink sm:text-2xl">
                    {event.title}
                  </CardTitle>
                  <p className="m-0 max-w-[36ch] text-sm leading-6 text-code-muted">
                    {event.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-code-line/45 pt-4 text-sm text-code-muted sm:flex-col sm:items-end sm:gap-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
                  <time className="leading-5" dateTime={event.dateTime}>
                    {event.date}
                  </time>
                  <span className="text-xs leading-4">{event.duration}</span>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselTextControls />
    </Carousel>
  )
}

type AdvancedId =
  | "toggle"
  | "toggle-group"
  | "copy-button"
  | "field"
  | "label"
  | "input-group"
  | "native-select"
  | "combobox"
  | "slider"
  | "input-otp"
  | "sidebar"
  | "collapsible"
  | "navigation-menu"
  | "menubar"
  | "pagination"
  | "command"
  | "context-menu"
  | "hover-card"
  | "alert-dialog"
  | "sheet"
  | "drawer"
  | "progress-ring"
  | "spinner"
  | "data-table"
  | "chart"
  | "aspect-ratio"
  | "scroll-area"
  | "carousel"
  | "kbd"
  | "shader-canvas"
  | "resizable"

type Navigate = (id: string) => void

export const advancedEntryIds: ReadonlySet<string> = new Set<AdvancedId>([
  "toggle",
  "toggle-group",
  "copy-button",
  "field",
  "label",
  "input-group",
  "native-select",
  "combobox",
  "slider",
  "input-otp",
  "sidebar",
  "collapsible",
  "navigation-menu",
  "menubar",
  "pagination",
  "command",
  "context-menu",
  "hover-card",
  "alert-dialog",
  "sheet",
  "drawer",
  "progress-ring",
  "spinner",
  "data-table",
  "chart",
  "aspect-ratio",
  "scroll-area",
  "carousel",
  "kbd",
  "shader-canvas",
  "resizable",
])

type LinkRow = {
  name: string
  type: string
  updated: string
}

const linkRows: LinkRow[] = [
  { name: "Team handbook", type: "Document", updated: "Today" },
  { name: "Q4 planning", type: "Spreadsheet", updated: "Yesterday" },
  { name: "Support overview", type: "Dashboard", updated: "Oct 28" },
  { name: "Design archive", type: "Folder", updated: "Oct 26" },
  { name: "Project timeline", type: "Spreadsheet", updated: "Oct 24" },
  { name: "Meeting notes", type: "Document", updated: "Oct 21" },
  { name: "Product brief", type: "Document", updated: "Oct 18" },
  { name: "Workspace guide", type: "Guide", updated: "Oct 15" },
]

const filePages = [
  ["Getting started", "Color palette"],
  ["Keyboard shortcuts", "Photo archive"],
  ["Reading list", "Reference guide"],
] as const

const linkColumns: DataTableColumn<LinkRow>[] = [
  {
    id: "name",
    header: "Name",
    sortLabel: "name",
    sortValue: (row) => row.name,
    cell: (row) => (
      <span className="font-medium text-code-ink">{row.name}</span>
    ),
  },
  {
    id: "type",
    header: "Type",
    sortLabel: "type",
    sortValue: (row) => row.type,
    cell: (row) => row.type,
  },
  {
    id: "updated",
    header: "Updated",
    sortLabel: "last updated",
    sortValue: (row) => row.updated,
    cell: (row) => row.updated,
  },
]

const categoryOptions = [
  { value: "writing", label: "Writing" },
  { value: "design", label: "Design" },
  { value: "research", label: "Research" },
  { value: "photography", label: "Photography" },
]

const snippets: Partial<Record<AdvancedId, string>> = {
  toggle: `import { Toggle } from "@/components/ui/toggle"\n\n<Toggle pressed={enabled} onPressedChange={setEnabled}>\n  Email updates\n</Toggle>`,
  "toggle-group": `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"\n\n<ToggleGroup type="single" value={view} onValueChange={setView}>\n  <ToggleGroupItem value="month">Month</ToggleGroupItem>\n  <ToggleGroupItem value="list">List</ToggleGroupItem>\n</ToggleGroup>`,
  "copy-button": `import { CopyButton } from "@/components/ui/copy-button"\n\n<CopyButton value={shortLink} label="Copy link" />`,
  field: `import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"\n\n<Field>\n  <FieldLabel htmlFor="item-title">Item title</FieldLabel>\n  <Input id="item-title" />\n  <FieldDescription>Shown in the list.</FieldDescription>\n</Field>`,
  label: `import { Label } from "@/components/ui/label"\n\n<Label htmlFor="list-name">List name</Label>\n<Input id="list-name" />`,
  "input-group": `import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"\n\n<InputGroup aria-label="Short link">\n  <InputGroupAddon><InputGroupText>site.org/</InputGroupText></InputGroupAddon>\n  <InputGroupInput aria-label="Link name" />\n</InputGroup>`,
  "native-select": `import { NativeSelect } from "@/components/ui/native-select"\n\n<NativeSelect aria-label="Time zone" defaultValue="manila">\n  <option value="manila">Manila</option>\n  <option value="singapore">Singapore</option>\n</NativeSelect>`,
  combobox: `import { Combobox } from "@/components/ui/combobox"\n\n<Combobox\n  ariaLabel="Choose a category"\n  options={categories}\n  value={category}\n  onValueChange={setCategory}\n/>`,
  slider: `import { Slider } from "@/components/ui/slider"\n\n<Slider\n  aria-label="Reminder time"\n  min={0}\n  max={60}\n  step={5}\n  value={[minutes]}\n  onValueChange={([next]) => setMinutes(next)}\n/>`,
  "input-otp": `import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"\n\n<InputOTP aria-label="Verification code" maxLength={6} value={code} onChange={setCode}>\n  <InputOTPGroup>{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup>\n</InputOTP>`,
  sidebar: `import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"\n\n<Sidebar aria-label="Main navigation">\n  <SidebarContent>\n    <SidebarMenu><SidebarMenuButton href="/calendar" isActive>Calendar</SidebarMenuButton></SidebarMenu>\n  </SidebarContent>\n</Sidebar>`,
  collapsible: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"\n\n<Collapsible>\n  <CollapsibleTrigger>More details</CollapsibleTrigger>\n  <CollapsibleContent>Additional details.</CollapsibleContent>\n</Collapsible>`,
  "navigation-menu": `import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"\n\n<NavigationMenu>\n  <NavigationMenuList><NavigationMenuItem>\n    <NavigationMenuLink href="/calendar">Calendar</NavigationMenuLink>\n  </NavigationMenuItem></NavigationMenuList>\n</NavigationMenu>`,
  menubar: `import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"\n\n<Menubar><MenubarMenu>\n  <MenubarTrigger>File</MenubarTrigger>\n  <MenubarContent><MenubarItem>New item</MenubarItem></MenubarContent>\n</MenubarMenu></Menubar>`,
  pagination: `import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"\n\n<Pagination aria-label="Recent files pages">\n  <PaginationContent>\n    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>\n    <PaginationItem><PaginationLink href="?page=2" isActive>2</PaginationLink></PaginationItem>\n    <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>\n  </PaginationContent>\n</Pagination>`,
  command: `import { CommandDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command"\n\n<CommandDialog open={open} onOpenChange={setOpen}>\n  <CommandInput placeholder="Search actions" />\n  <CommandList><CommandItem onSelect={openCalendar}>Open calendar</CommandItem></CommandList>\n</CommandDialog>`,
  "context-menu": `import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"\n\n<ContextMenu>\n  <ContextMenuTrigger>Right-click this row</ContextMenuTrigger>\n  <ContextMenuContent><ContextMenuItem>Open</ContextMenuItem></ContextMenuContent>\n</ContextMenu>`,
  "hover-card": `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"\n\n<HoverCard>\n  <HoverCardTrigger asChild><a href="/profiles/jordan">Jordan Lee</a></HoverCardTrigger>\n  <HoverCardContent>Public profile</HoverCardContent>\n</HoverCard>`,
  "alert-dialog": `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog"\n\n<AlertDialog open={open} onOpenChange={setOpen}>\n  <AlertDialogContent><AlertDialogTitle>Archive this item?</AlertDialogTitle>\n    <AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Archive</AlertDialogAction>\n  </AlertDialogContent>\n</AlertDialog>`,
  sheet: `import { Checkbox } from "@/components/ui/checkbox"\nimport { FieldLegend, FieldSet } from "@/components/ui/field"\nimport { Label } from "@/components/ui/label"\nimport { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"\nimport { Button } from "@/components/ui/button"\n\n<Sheet open={open} onOpenChange={setOpen}>\n  <SheetContent side="right" className="w-[min(24rem,calc(100vw-1.5rem))] gap-4 p-5">\n    <SheetHeader className="gap-1"><SheetTitle>Activity</SheetTitle><SheetDescription>Choose which items appear.</SheetDescription></SheetHeader>\n    <FieldSet className="gap-1">\n      <FieldLegend className="mb-0">Time period</FieldLegend>\n      <div className="grid gap-0.5">\n        <div className="flex min-h-10 items-center gap-3"><Checkbox id="upcoming" checked={upcoming} onCheckedChange={(checked) => setUpcoming(checked === true)} /><Label htmlFor="upcoming" className="min-h-10 flex-1 cursor-pointer font-normal">Upcoming</Label></div>\n        <div className="flex min-h-10 items-center gap-3"><Checkbox id="past" checked={past} onCheckedChange={(checked) => setPast(checked === true)} /><Label htmlFor="past" className="min-h-10 flex-1 cursor-pointer font-normal">Past</Label></div>\n      </div>\n    </FieldSet>\n    <SheetFooter className="mt-auto flex-row justify-between sm:justify-between"><Button className="min-h-10" variant="ghost">Reset</Button><SheetClose asChild><Button className="min-h-10">Done</Button></SheetClose></SheetFooter>\n  </SheetContent>\n</Sheet>`,
  drawer: `import { Button } from "@/components/ui/button"\nimport { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"\n\n<Drawer open={open} onOpenChange={setOpen}>\n  <DrawerContent>\n    <DrawerHeader><DrawerTitle>Design notes</DrawerTitle><DrawerDescription>Updated today</DrawerDescription></DrawerHeader>\n    <p className="mx-auto w-full max-w-xl">One recent change and a short description.</p>\n    <DrawerFooter className="flex-row gap-2 sm:justify-stretch"><DrawerClose asChild><Button className="min-h-10 flex-1" variant="outline">Close</Button></DrawerClose><Button className="min-h-10 flex-1">Open item</Button></DrawerFooter>\n  </DrawerContent>\n</Drawer>`,
  "progress-ring": `import { ProgressRing } from "@/components/ui/progress-ring"\n\n<ProgressRing\n  label="Saved items"\n  value={7}\n  max={10}\n  center={<span className="font-heading text-2xl tabular-nums">7</span>}\n/>`,
  spinner: `import { Spinner } from "@/components/ui/spinner"\n\n<Spinner label="Saving changes" />`,
  "data-table": `import { DataTable } from "@/components/ui/data-table"\n\n<DataTable\n  aria-label="Recent files"\n  columns={columns}\n  getRowLabel={(row) => row.name}\n  pageSize={8}\n  rows={files}\n  rowKey={(row) => row.id}\n  searchBy={(row) => row.name + " " + row.type}\n  selectable\n/>`,
  chart: `import { ChartContainer, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "@/components/ui/chart"\n\n<ChartContainer aria-label="Weekly activity" config={config} className="h-56">\n  <ResponsiveContainer width="100%" height="100%">\n    <LineChart data={activity}><XAxis dataKey="day" /><YAxis /><Line dataKey="count" /></LineChart>\n  </ResponsiveContainer>\n</ChartContainer>`,
  "aspect-ratio": `import { AspectRatio } from "@/components/ui/aspect-ratio"\n\n<AspectRatio ratio={16 / 9}>\n  <img src={imageUrl} alt="Image preview" />\n</AspectRatio>`,
  "scroll-area": `import { ScrollArea, ScrollAreaScrollbar, ScrollAreaViewport } from "@/components/ui/scroll-area"\n\n<ScrollArea className="h-56">\n  <ScrollAreaViewport>{children}</ScrollAreaViewport>\n  <ScrollAreaScrollbar orientation="vertical" />\n</ScrollArea>`,
  carousel: `import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"\n\n<Carousel aria-label="Featured guides">\n  <CarouselContent>{items.map((item) => <CarouselItem key={item.id}>{item.title}</CarouselItem>)}</CarouselContent>\n  <CarouselPrevious aria-label="Previous guide" /><CarouselNext aria-label="Next guide" />\n</Carousel>`,
  kbd: `import { Kbd } from "@/components/ui/kbd"\n\n<Kbd>⌘</Kbd> <Kbd>K</Kbd>`,
  "shader-canvas": `import { ShaderCanvas } from "@/components/ui/shader-canvas"\n\n<ShaderCanvas className="h-72 w-full" label="Animated navy and blue surface" />`,
  resizable: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"\n\n<ResizablePanelGroup aria-label="Items and details" className="min-h-64 rounded-lg border border-code-line">\n  <ResizablePanel defaultSize="42%" minSize="24%">Item list</ResizablePanel>\n  <ResizableHandle aria-label="Resize item list" />\n  <ResizablePanel minSize="30%">Selected item</ResizablePanel>\n</ResizablePanelGroup>`,
}

export function AdvancedSpecimen({
  entryId,
  onNavigate,
}: {
  entryId: string
  onNavigate?: Navigate
}) {
  const [enabled, setEnabled] = useState(true)
  const [view, setView] = useState("month")
  const [category, setCategory] = useState<string | null>("design")
  const [reminder, setReminder] = useState([20])
  const [code, setCode] = useState("248")
  const [moreOpen, setMoreOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(2)
  const [message, setMessage] = useState("")
  const [selectedResource, setSelectedResource] = useState("Design notes")
  const [savedCount, setSavedCount] = useState(7)
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [showPast, setShowPast] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  const runCommand = (destination: string) => {
    setCommandOpen(false)
    onNavigate?.(destination)
  }

  switch (entryId as AdvancedId) {
    case "toggle":
      return (
        <div className="w-full max-w-lg space-y-4">
          <Toggle pressed={enabled} onPressedChange={setEnabled}>
            Email updates
          </Toggle>
          <p
            aria-live="polite"
            className="text-sm text-code-muted"
            role="status"
          >
            <span className="sr-only">
              Email updates {enabled ? "on" : "off"}
            </span>
            <span
              aria-hidden="true"
              className="inline-grid w-10 place-items-center tabular-nums"
            >
              <TextMorph as="span" duration={220} respectReducedMotion>
                {enabled ? "On" : "Off"}
              </TextMorph>
            </span>
          </p>
        </div>
      )
    case "toggle-group":
      return (
        <div className="space-y-3">
          <p className="text-sm font-medium text-code-ink">Calendar view</p>
          <ToggleGroup
            aria-label="Calendar view"
            type="single"
            value={view}
            onValueChange={(next) => next && setView(next)}
          >
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
            <ToggleGroupItem value="list">List</ToggleGroupItem>
          </ToggleGroup>
          <p className="sr-only" aria-live="polite">
            {view} view selected
          </p>
        </div>
      )
    case "copy-button":
      return (
        <CopyButton
          value="https://example.com/design-notes"
          label="Copy link"
        />
      )
    case "field":
      return (
        <Field className="w-full max-w-sm" data-invalid>
          <FieldLabel htmlFor="advanced-item-name">Item name</FieldLabel>
          <Input
            id="advanced-item-name"
            aria-invalid="true"
            aria-describedby="advanced-item-error"
            defaultValue=""
            placeholder="Add a name"
          />
          <FieldDescription>Shown in the list.</FieldDescription>
          <FieldError id="advanced-item-error">Enter a name.</FieldError>
        </Field>
      )
    case "label":
      return (
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="list-label">List name</Label>
          <Input id="list-label" defaultValue="Reading list" />
        </div>
      )
    case "input-group":
      return (
        <div className="w-full max-w-lg">
          <Label className="mb-2 block" htmlFor="short-link">
            Short link
          </Label>
          <InputGroup aria-label="Create a short link">
            <InputGroupAddon>
              <InputGroupText>example.com/</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Link name"
              id="short-link"
              defaultValue="welcome"
            />
          </InputGroup>
        </div>
      )
    case "native-select":
      return (
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="time-zone">Time zone</Label>
          <NativeSelect id="time-zone" defaultValue="manila">
            <option value="manila">Manila (UTC+8)</option>
            <option value="singapore">Singapore (UTC+8)</option>
            <option value="tokyo">Tokyo (UTC+9)</option>
          </NativeSelect>
        </div>
      )
    case "combobox":
      return (
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="category-choice">Category</Label>
          <Combobox
            ariaLabel="Choose a category"
            options={categoryOptions}
            value={category}
            onValueChange={setCategory}
            placeholder="Choose a category"
            searchPlaceholder="Find a category"
            emptyMessage="No categories found"
          />
        </div>
      )
    case "slider":
      return (
        <div className="w-full max-w-lg space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="reminder-slider">Reminder</Label>
            <span className="text-lg font-medium text-code-ink tabular-nums">
              <TextMorph as="span" duration={220} numbers respectReducedMotion>
                {reminder[0]}
              </TextMorph>
              <span className="ml-1 text-sm font-normal text-code-muted">
                min
              </span>
            </span>
          </div>
          <Slider
            id="reminder-slider"
            aria-label="Reminder time"
            min={0}
            max={60}
            step={5}
            value={reminder}
            onValueChange={setReminder}
          />
          <div className="flex justify-between text-xs text-code-muted">
            <span>At start</span>
            <span>1 hour before</span>
          </div>
        </div>
      )
    case "input-otp":
      return (
        <div className="grid gap-4">
          <Label htmlFor="verification-code">Verification code</Label>
          <InputOTP
            aria-label="Verification code"
            id="verification-code"
            maxLength={6}
            value={code}
            onChange={setCode}
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }, (_, index) => (
                <InputOTPSlot index={index} key={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <span className="text-xs text-code-muted">
            Enter the 6-digit code.
          </span>
        </div>
      )
    case "sidebar":
      return (
        <div className="flex min-h-72 w-full max-w-3xl overflow-hidden rounded-xl border border-code-line bg-code-surface">
          <Sidebar aria-label="Main navigation" className="min-h-72">
            <SidebarHeader className="text-base font-semibold tracking-tight">
              Library
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Browse</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="#home">Recent</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="#collections" isActive>
                      Collections
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton href="#saved">
                      Saved items
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <span className="text-sm text-white/85">Preferences</span>
            </SidebarFooter>
          </Sidebar>
          <div className="grid min-w-0 flex-1 place-items-center p-8 text-sm text-code-muted">
            Recent items
          </div>
        </div>
      )
    case "collapsible":
      return (
        <Collapsible
          className="w-full max-w-xl"
          open={moreOpen}
          onOpenChange={setMoreOpen}
        >
          <CollapsibleTrigger className="flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-medium text-code-ink transition-colors hover:bg-code-quiet/60 motion-reduce:transition-none">
            More details{" "}
            <span className="text-code-muted">
              {moreOpen ? "Hide" : "Show"}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 text-sm leading-6 text-code-muted">
            The details stay close to the control that reveals them.
          </CollapsibleContent>
        </Collapsible>
      )
    case "navigation-menu":
      return (
        <div className="relative min-h-48 w-full max-w-lg">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-60 gap-1 p-1">
                    <li>
                      <NavigationMenuLink href="#guides">
                        Guides
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="#files">
                        Files
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="#items">
                        Items
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#updates">Updates</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>
      )
    case "menubar":
      return (
        <div className="grid gap-2">
          <Menubar aria-label="Editing commands">
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onSelect={() => setMessage("New item")}>
                  New item
                </MenubarItem>
                <MenubarItem onSelect={() => setMessage("Import")}>
                  Import
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onSelect={() => setMessage("Export")}>
                  Export
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onSelect={() => setMessage("Preferences")}>
                  Preferences
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <p
            className="m-0 min-h-5 text-xs text-code-muted"
            role="status"
            aria-live="polite"
          >
            {message ? (
              <TextMorph as="span" duration={220} respectReducedMotion>
                {message}
              </TextMorph>
            ) : null}
          </p>
        </div>
      )
    case "pagination":
      return (
        <div className="grid w-full max-w-lg gap-3">
          <h3 className="m-0 text-sm font-medium text-code-ink">
            Recent files
          </h3>
          <div className="min-h-24 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                aria-label={`Files on page ${page}`}
                className="m-0 grid list-none gap-1 p-0"
                key={page}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {filePages[page - 1]!.map((file) => (
                  <li
                    className="flex min-h-10 items-center rounded-lg px-3 text-sm text-code-ink"
                    key={file}
                  >
                    {file}
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
          <Pagination aria-label="Recent files pages">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#previous"
                  onClick={(event) => {
                    event.preventDefault()
                    setPage((current) => Math.max(1, current - 1))
                  }}
                />
              </PaginationItem>
              {[1, 2, 3].map((item) => (
                <PaginationItem key={item}>
                  <PaginationLink
                    href={`#page-${item}`}
                    isActive={page === item}
                    onClick={(event) => {
                      event.preventDefault()
                      setPage(item)
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#next"
                  onClick={(event) => {
                    event.preventDefault()
                    setPage((current) => Math.min(3, current + 1))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p
            className="m-0 text-center text-xs text-code-muted"
            aria-live="polite"
          >
            Page {page} of 3
          </p>
        </div>
      )
    case "command":
      return (
        <div className="flex items-center gap-3">
          <Button
            aria-expanded={commandOpen}
            aria-haspopup="dialog"
            onClick={() => setCommandOpen(true)}
            variant="outline"
          >
            Open command menu
          </Button>
          <CommandDialog
            description="Find a destination or action."
            open={commandOpen}
            onOpenChange={setCommandOpen}
            title="Quick actions"
          >
            <CommandInput placeholder="Search components or actions" />
            <CommandList>
              <CommandEmpty>No matching components</CommandEmpty>
              {libraryGroups.map((group) => {
                const entries = group.ids
                  .map((id) => libraryEntries.find((entry) => entry.id === id))
                  .filter(
                    (entry): entry is (typeof libraryEntries)[number] =>
                      entry !== undefined
                  )

                return entries.length ? (
                  <CommandGroup heading={group.name} key={group.name}>
                    {entries.map((entry) => (
                      <CommandItem
                        key={entry.id}
                        onSelect={() => runCommand(entry.id)}
                        value={`${entry.name} ${entry.group} ${entry.description} ${entry.terms}`}
                      >
                        <span>{entry.name}</span>
                        <CommandShortcut>{entry.group}</CommandShortcut>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null
              })}
            </CommandList>
          </CommandDialog>
        </div>
      )
    case "context-menu":
      return (
        <ContextMenu>
          <ContextMenuTrigger className="grid min-h-36 w-full max-w-lg place-items-center rounded-xl border border-dashed border-code-line bg-code-surface text-sm text-code-muted outline-none focus-visible:ring-2 focus-visible:ring-code-accent/30">
            Right-click this space
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => setMessage("Item opened")}>
              Open
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => setMessage("Link copied")}>
              Copy link
            </ContextMenuItem>
          </ContextMenuContent>
          <span className="sr-only" role="status" aria-live="polite">
            {message}
          </span>
        </ContextMenu>
      )
    case "hover-card":
      return (
        <HoverCard openDelay={180} closeDelay={100}>
          <HoverCardTrigger asChild>
            <a
              className="font-medium text-code-accent underline decoration-code-accent/35 underline-offset-4"
              href="#profile"
            >
              Jordan Lee
            </a>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-64">
            <div className="grid gap-1">
              <strong className="text-sm text-code-ink">Jordan Lee</strong>
              <span className="text-xs text-code-muted">
                Contributor · Joined in 2024
              </span>
            </div>
          </HoverCardContent>
        </HoverCard>
      )
    case "alert-dialog":
      return (
        <div className="grid justify-items-center gap-3">
          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Archive item</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive this item?</AlertDialogTitle>
                <AlertDialogDescription>
                  It will move out of the active list. You can restore it later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => setMessage("Item archived")}>
                  Archive item
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <span
            className="text-xs text-code-muted"
            role="status"
            aria-live="polite"
          >
            {message}
          </span>
        </div>
      )
    case "sheet": {
      const activity = [
        { title: "Release review", date: "Nov 12", period: "upcoming" },
        { title: "Design handoff", date: "Yesterday", period: "past" },
        { title: "Planning session", date: "Nov 18", period: "upcoming" },
      ] as const
      const visibleActivity = activity.filter(
        (item) =>
          (item.period === "upcoming" && showUpcoming) ||
          (item.period === "past" && showPast)
      )
      const activeFilterCount = Number(!showUpcoming) + Number(!showPast)

      return (
        <div className="grid w-full max-w-lg gap-3">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="min-w-32 justify-start" variant="outline">
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
            </SheetTrigger>
            <SheetContent
              className="w-[min(24rem,calc(100vw-1.5rem))] gap-4 p-5"
              side="right"
            >
              <SheetHeader className="gap-1">
                <SheetTitle>Activity</SheetTitle>
                <SheetDescription>
                  Choose which items appear in the list.
                </SheetDescription>
              </SheetHeader>
              <FieldSet className="gap-1">
                <FieldLegend className="mb-0">Time period</FieldLegend>
                <div className="grid gap-0.5">
                  <div className="flex min-h-10 items-center gap-3">
                    <Checkbox
                      checked={showUpcoming}
                      id="sheet-filter-upcoming"
                      onCheckedChange={(checked) =>
                        setShowUpcoming(checked === true)
                      }
                    />
                    <Label
                      className="min-h-10 flex-1 cursor-pointer leading-normal font-normal"
                      htmlFor="sheet-filter-upcoming"
                    >
                      Upcoming
                    </Label>
                  </div>
                  <div className="flex min-h-10 items-center gap-3">
                    <Checkbox
                      checked={showPast}
                      id="sheet-filter-past"
                      onCheckedChange={(checked) =>
                        setShowPast(checked === true)
                      }
                    />
                    <Label
                      className="min-h-10 flex-1 cursor-pointer leading-normal font-normal"
                      htmlFor="sheet-filter-past"
                    >
                      Past
                    </Label>
                  </div>
                </div>
              </FieldSet>
              <SheetFooter className="mt-auto flex-row justify-between sm:justify-between">
                <Button
                  className="min-h-10"
                  disabled={showUpcoming && showPast}
                  onClick={() => {
                    setShowUpcoming(true)
                    setShowPast(true)
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Reset
                </Button>
                <SheetClose asChild>
                  <Button className="min-h-10" size="sm" type="button">
                    Done
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <section aria-label="Filtered activity" className="grid gap-1">
            {visibleActivity.map((item) => (
              <div
                className="flex min-h-10 items-center justify-between gap-4 rounded-lg px-2 text-sm"
                key={item.title}
              >
                <span className="text-code-ink">{item.title}</span>
                <span className="text-xs text-code-muted">{item.date}</span>
              </div>
            ))}
            {visibleActivity.length === 0 ? (
              <p className="m-0 py-3 text-sm text-code-muted">No activity</p>
            ) : null}
          </section>
        </div>
      )
    }
    case "drawer":
      return (
        <div className="grid justify-items-start gap-2">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button onClick={() => setMessage("")} variant="outline">
                View item
              </Button>
            </DrawerTrigger>
            <DrawerContent className="gap-4">
              <DrawerHeader className="gap-1">
                <DrawerTitle>Design notes</DrawerTitle>
                <DrawerDescription>Updated today</DrawerDescription>
              </DrawerHeader>
              <div className="mx-auto grid w-full max-w-xl gap-3 pb-1 text-sm">
                <p className="m-0 leading-5 text-code-muted">
                  A short description with one recent change.
                </p>
                <div className="flex items-center justify-between gap-4 border-t border-code-line/45 pt-3 text-xs text-code-muted">
                  <span>Last updated</span>
                  <time dateTime="2026-11-06">Today</time>
                </div>
              </div>
              <DrawerFooter className="mx-auto flex w-full max-w-xl flex-row gap-2 sm:justify-stretch">
                <DrawerClose asChild>
                  <Button
                    className="min-h-10 flex-1"
                    size="sm"
                    variant="outline"
                  >
                    Close
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    className="min-h-10 flex-1"
                    onClick={() => setMessage("Design notes opened")}
                    size="sm"
                  >
                    Open item
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          {message ? (
            <span className="text-xs text-code-muted" role="status">
              {message}
            </span>
          ) : null}
        </div>
      )
    case "progress-ring":
      return (
        <div className="flex w-full max-w-md items-center justify-center gap-6 sm:gap-8">
          <ProgressRing
            label="Saved items"
            value={savedCount}
            max={12}
            size={112}
            center={
              <span className="grid justify-items-center leading-none">
                <TextMorph
                  as="span"
                  className="font-heading text-[1.8rem] text-code-ink tabular-nums"
                  duration={300}
                  numbers
                  respectReducedMotion
                >
                  {savedCount}
                </TextMorph>
                <span className="mt-1 text-[10px] text-code-muted tabular-nums">
                  of 12
                </span>
              </span>
            }
          />
          <div className="grid justify-items-start gap-1">
            <p className="m-0 text-sm font-medium text-code-ink">Saved items</p>
            <Button
              className="mt-2 min-w-32 justify-center"
              disabled={savedCount >= 12}
              onClick={() => setSavedCount((count) => Math.min(12, count + 1))}
              size="sm"
              variant="outline"
            >
              <TextMorph as="span" duration={220} respectReducedMotion>
                {savedCount >= 12 ? "Limit reached" : "Add item"}
              </TextMorph>
            </Button>
          </div>
        </div>
      )
    case "spinner":
      return (
        <div className="flex items-center gap-4 text-code-accent">
          <Spinner label="Saving changes" size="lg" />
          <span className="text-sm text-code-muted">Saving changes</span>
        </div>
      )
    case "data-table":
      return (
        <div className="w-full max-w-3xl">
          <DataTable
            aria-label="Recent files"
            columns={linkColumns}
            getRowLabel={(row) => row.name}
            pageSize={4}
            rows={linkRows}
            rowKey={(row) => row.name}
            searchBy={(row) => `${row.name} ${row.type} ${row.updated}`}
            searchPlaceholder="Search files"
            selectable
          />
        </div>
      )
    case "chart":
      return <ChartSpecimen />
    case "aspect-ratio":
      return (
        <div className="w-full max-w-xl">
          <AspectRatio
            className="overflow-hidden rounded-xl bg-code-quiet"
            ratio={16 / 9}
          >
            <div className="flex size-full items-end bg-[linear-gradient(135deg,var(--code-hero),var(--code-accent))] p-5 text-white">
              <div>
                <p className="m-0 text-sm font-medium">Image preview</p>
                <p className="m-0 mt-1 text-xs text-white/75">16:9</p>
              </div>
            </div>
          </AspectRatio>
        </div>
      )
    case "scroll-area":
      return (
        <div className="w-full max-w-md overflow-hidden rounded-xl bg-code-surface shadow-[0_1px_2px_rgb(12_29_48/7%),0_10px_30px_-24px_rgb(12_29_48/24%)]">
          <div className="px-4 pt-4 pb-2 text-sm font-semibold text-code-ink">
            Recent files
          </div>
          <ScrollArea className="h-52">
            <ScrollAreaViewport
              className="grid gap-0.5 px-2 pb-3"
              role="region"
              aria-label="Recent files"
            >
              {[
                ["Project brief", "Just now"],
                ["Research plan", "Yesterday"],
                ["Workshop notes", "Monday"],
                ["Design feedback", "Friday"],
                ["Team handbook", "Oct 30"],
                ["Release checklist", "Oct 28"],
                ["Reference library", "Oct 24"],
              ].map(([item, updated]) => (
                <div
                  className="flex min-h-10 items-center justify-between gap-4 rounded-lg px-3 transition-colors hover:bg-code-canvas motion-reduce:transition-none"
                  key={item}
                >
                  <span className="text-sm text-code-ink">{item}</span>
                  <span className="text-xs text-code-muted tabular-nums">
                    {updated}
                  </span>
                </div>
              ))}
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical" />
          </ScrollArea>
        </div>
      )
    case "carousel":
      return <EventCarouselDemo />
    case "kbd":
      return (
        <p className="flex items-center gap-2 text-sm text-code-muted">
          Search <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </p>
      )
    case "shader-canvas":
      return (
        <ShaderCanvas
          className="h-72 w-full rounded-xl"
          label="A theme-aware animated color field"
          resolution={0.65}
          stillTime={3.8}
        />
      )
    case "resizable":
      return (
        <ResizablePanelGroup
          aria-label="Item list and details"
          className="h-72 w-full max-w-3xl overflow-hidden rounded-lg border border-code-line bg-code-surface"
        >
          <ResizablePanel defaultSize="40%" minSize="24%">
            <div className="grid h-full content-start gap-1 p-3">
              <span className="px-2 pb-1 text-xs font-medium text-code-muted">
                Items
              </span>
              {[
                { name: "Design notes", updated: "Updated today" },
                { name: "Reference guide", updated: "Updated Nov 1" },
              ].map((resource) => (
                <button
                  aria-pressed={selectedResource === resource.name}
                  className={
                    selectedResource === resource.name
                      ? "min-h-9 rounded-md bg-code-accent-soft px-2 text-left text-sm text-code-ink"
                      : "min-h-9 rounded-md px-2 text-left text-sm text-code-muted transition-colors hover:bg-code-quiet hover:text-code-ink"
                  }
                  key={resource.name}
                  onClick={() => setSelectedResource(resource.name)}
                  type="button"
                >
                  {resource.name}
                </button>
              ))}
            </div>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize resource list" />
          <ResizablePanel minSize="30%">
            <div className="grid h-full content-start gap-2 p-4">
              <span className="text-sm font-medium text-code-ink">
                <TextMorph as="span" duration={220} respectReducedMotion>
                  {selectedResource}
                </TextMorph>
              </span>
              <span className="text-xs text-code-muted">
                {selectedResource === "Design notes"
                  ? "Updated today"
                  : "Updated Nov 1"}
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
    default:
      return null
  }
}

export function getAdvancedSnippet(entryId: string) {
  return snippets[entryId as AdvancedId] ?? ""
}
