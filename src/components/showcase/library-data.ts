export type LibraryGroup = {
  name: string
  ids: string[]
}

export type LibraryEntry = {
  id: string
  name: string
  description: string
  terms: string
  related: string[]
  group: string
}

export const libraryGroups: LibraryGroup[] = [
  { name: "Foundations", ids: ["colors", "type", "layout"] },
  {
    name: "Actions",
    ids: ["button", "button-group", "toggle", "toggle-group", "copy-button"],
  },
  {
    name: "Forms",
    ids: [
      "field",
      "label",
      "color-picker",
      "input",
      "textarea",
      "input-group",
      "number-field",
      "select",
      "native-select",
      "combobox",
      "checkbox",
      "radio-group",
      "switch",
      "slider",
      "calendar",
      "date-picker",
      "date-range-picker",
      "time-picker",
      "time-zone-picker",
      "date-time-picker",
      "multi-select",
      "file-upload",
      "input-otp",
    ],
  },
  {
    name: "Navigation",
    ids: [
      "sidebar",
      "tree-view",
      "tabs",
      "breadcrumb",
      "accordion",
      "collapsible",
      "navigation-menu",
      "menubar",
      "pagination",
      "bottom-navigation",
    ],
  },
  {
    name: "Overlays",
    ids: [
      "command",
      "dropdown-menu",
      "context-menu",
      "popover",
      "tooltip",
      "hover-card",
      "dialog",
      "alert-dialog",
      "sheet",
      "drawer",
    ],
  },
  {
    name: "Feedback",
    ids: [
      "badge",
      "alert",
      "progress",
      "progress-ring",
      "spinner",
      "skeleton",
      "empty-state",
      "toast",
    ],
  },
  {
    name: "Data display",
    ids: [
      "avatar",
      "card",
      "item",
      "metric-card",
      "activity-feed",
      "list-toolbar",
      "event-list-item",
      "events-calendar",
      "table",
      "data-table",
      "chart",
    ],
  },
  {
    name: "Layout and media",
    ids: [
      "separator",
      "resizable",
      "aspect-ratio",
      "scroll-area",
      "carousel",
      "kbd",
    ],
  },
  { name: "Developer tools", ids: ["code-block"] },
  {
    name: "Motion",
    ids: [
      "confetti-burst",
      "success-check",
      "change-highlight",
      "shader-canvas",
    ],
  },
]

const definitions = [
  [
    "colors",
    "Color tokens",
    "Color tokens for text, surfaces, and actions",
    "color theme palette semantic tokens light dark",
  ],
  [
    "type",
    "Typography",
    "Type styles for headings, body text, and interface labels.",
    "type font typography heading body scale",
  ],
  [
    "layout",
    "Spacing and layout",
    "Spacing tokens for consistent layouts",
    "spacing layout grid gap container responsive",
  ],
  [
    "button",
    "Button",
    "Actions with a clear hierarchy.",
    "button action primary secondary disabled loading",
  ],
  [
    "button-group",
    "Button group",
    "Related actions in one place.",
    "actions group toolbar button",
  ],
  [
    "toggle",
    "Toggle",
    "A button with on and off states.",
    "toggle pressed state button tactile on off",
  ],
  [
    "toggle-group",
    "Toggle group",
    "A small set of related choices.",
    "toggle group selection tabs view mode",
  ],
  [
    "copy-button",
    "Copy button",
    "Copy a value and show whether it worked.",
    "copy clipboard copied link feedback",
  ],
  [
    "field",
    "Field",
    "A label, control, and message together.",
    "field form label description error",
  ],
  [
    "label",
    "Label",
    "A visible name for a control.",
    "label form input accessible",
  ],
  [
    "color-picker",
    "Color picker",
    "Choose and refine a color.",
    "color picker hex swatch theme custom value",
  ],
  [
    "input",
    "Input",
    "Enter a short value in a single-line field.",
    "input text field search email",
  ],
  [
    "textarea",
    "Textarea",
    "Room for a longer response.",
    "textarea text message note",
  ],
  [
    "input-group",
    "Input group",
    "Pair a field with a prefix, suffix, or action.",
    "input group prefix suffix search URL",
  ],
  [
    "number-field",
    "Number field",
    "Change a number with increment and decrement controls.",
    "number field increment decrement quantity",
  ],
  [
    "select",
    "Select",
    "Choose from a short list.",
    "select options dropdown form",
  ],
  [
    "native-select",
    "Native select",
    "A dropdown that uses the browser's native menu.",
    "select native dropdown options",
  ],
  [
    "combobox",
    "Combobox",
    "Search and select from a longer list.",
    "combobox autocomplete search select",
  ],
  [
    "checkbox",
    "Checkbox",
    "Select independent options.",
    "checkbox checked indeterminate multiple",
  ],
  [
    "radio-group",
    "Radio group",
    "Choose one visible option.",
    "radio group single choice selection",
  ],
  [
    "switch",
    "Switch",
    "Change a setting immediately.",
    "switch toggle preference setting",
  ],
  [
    "slider",
    "Slider",
    "Adjust a value across a range.",
    "slider range value volume",
  ],
  [
    "calendar",
    "Calendar",
    "Browse dates and choose a day.",
    "calendar date month day",
  ],
  [
    "event-list-item",
    "Event list item",
    "Display event timing and details in one row",
    "event row agenda time date details location participants",
  ],
  [
    "events-calendar",
    "Events calendar",
    "View events by month or agenda.",
    "events calendar agenda schedule event time location month",
  ],
  [
    "activity-feed",
    "Activity feed",
    "Show recent changes as a timeline",
    "activity feed timeline updates notifications history",
  ],
  [
    "list-toolbar",
    "List toolbar",
    "Search, filter, and sort list items",
    "list toolbar search filter sort bulk selection actions",
  ],
  [
    "date-picker",
    "Date picker",
    "Choose a date from a field.",
    "date picker calendar date form",
  ],
  [
    "date-range-picker",
    "Date range picker",
    "Choose a start and end date.",
    "date range picker calendar scheduling filter period",
  ],
  [
    "time-picker",
    "Time picker",
    "Choose a time.",
    "time picker clock scheduling local time custom wheel",
  ],
  [
    "time-zone-picker",
    "Time zone picker",
    "Find and choose an IANA time zone, then check its UTC offset.",
    "timezone time zone world city region utc offset daylight saving scheduling",
  ],
  [
    "date-time-picker",
    "Date and time picker",
    "Choose a local date and time.",
    "date time picker scheduling time input",
  ],
  [
    "multi-select",
    "Multi-select",
    "Choose several options from a searchable list.",
    "multi select combobox tags filter multiple choices",
  ],
  [
    "file-upload",
    "File upload",
    "Select and review files before uploading",
    "file upload drag drop select validation busy attachment",
  ],
  [
    "input-otp",
    "One-time code",
    "Enter a short verification code.",
    "input otp one time password verification",
  ],
  [
    "sidebar",
    "Sidebar",
    "Place navigation beside the page content.",
    "sidebar app shell navigation menu active",
  ],
  [
    "tree-view",
    "Tree view",
    "Browse and select nested items.",
    "tree view hierarchy folders navigation nested list",
  ],
  ["tabs", "Tabs", "Switch between related views.", "tabs panels navigation"],
  [
    "breadcrumb",
    "Breadcrumb",
    "Show the current place in a hierarchy.",
    "breadcrumb navigation hierarchy current page",
  ],
  [
    "accordion",
    "Accordion",
    "Reveal optional details on demand.",
    "accordion disclosure expand collapse",
  ],
  [
    "collapsible",
    "Collapsible",
    "Show or hide a section.",
    "collapsible disclosure toggle",
  ],
  [
    "navigation-menu",
    "Navigation menu",
    "Browse related destinations.",
    "navigation menu links dropdown",
  ],
  [
    "menubar",
    "Menubar",
    "Group app-level commands.",
    "menubar file edit view menu",
  ],
  [
    "pagination",
    "Pagination",
    "Move through a long list.",
    "pagination previous next pages",
  ],
  [
    "bottom-navigation",
    "Bottom navigation",
    "Move between the main areas of a workspace.",
    "bottom navigation app bar mobile tabs workspace",
  ],
  [
    "command",
    "Command menu",
    "Search and select actions in a command menu.",
    "command menu search keyboard shortcut",
  ],
  [
    "dropdown-menu",
    "Dropdown menu",
    "Open secondary actions near an item.",
    "dropdown menu actions more",
  ],
  [
    "context-menu",
    "Context menu",
    "Show actions for a specific surface.",
    "context menu right click actions",
  ],
  [
    "popover",
    "Popover",
    "Show a small panel next to a control.",
    "popover anchored panel filters",
  ],
  [
    "tooltip",
    "Tooltip",
    "Add a short hint to a control.",
    "tooltip hover focus hint",
  ],
  [
    "hover-card",
    "Hover card",
    "Preview related details in context.",
    "hover card preview profile",
  ],
  [
    "dialog",
    "Dialog",
    "Open a dialog for a focused task.",
    "dialog modal form details",
  ],
  [
    "alert-dialog",
    "Alert dialog",
    "Confirm an action with consequences.",
    "alert dialog confirmation destructive",
  ],
  [
    "sheet",
    "Sheet",
    "Open a side panel beside the current view.",
    "sheet side panel drawer",
  ],
  [
    "drawer",
    "Drawer",
    "Open a bottom panel on small screens.",
    "drawer mobile bottom panel",
  ],
  [
    "badge",
    "Badge",
    "Label a status or category.",
    "badge status category tag",
  ],
  [
    "alert",
    "Alert",
    "Show a message in the page flow.",
    "alert message warning success error",
  ],
  [
    "progress",
    "Progress bar",
    "Show progress toward completion.",
    "progress bar completion status",
  ],
  [
    "progress-ring",
    "Progress ring",
    "Show progress in a compact space.",
    "progress ring circle percentage metric",
  ],
  ["spinner", "Spinner", "Signal an active wait.", "spinner loading busy"],
  [
    "skeleton",
    "Skeleton",
    "Hold a place while content loads.",
    "skeleton loading placeholder",
  ],
  [
    "empty-state",
    "Empty state",
    "Explain an empty view and offer a next step.",
    "empty state no results zero data",
  ],
  [
    "toast",
    "Toast",
    "Confirm a change without interrupting.",
    "toast notification status success",
  ],
  [
    "confetti-burst",
    "Confetti burst",
    "Celebrate a completed task with a short confetti burst.",
    "confetti celebration success completion milestone animation",
  ],
  [
    "success-check",
    "Success check",
    "Show a task's loading, success, and error states.",
    "success check status loading error transition feedback",
  ],
  [
    "change-highlight",
    "Change highlight",
    "Briefly call attention to content that just changed.",
    "change highlight update pulse row value animation",
  ],
  [
    "avatar",
    "Avatar",
    "Identify a person or team.",
    "avatar profile image initials presence",
  ],
  [
    "card",
    "Card",
    "Group related content and actions in one surface.",
    "card surface content section",
  ],
  [
    "item",
    "Item",
    "Place related content and actions in a row.",
    "item list row content action people resource notification",
  ],
  [
    "metric-card",
    "Metric card",
    "Pair a value with its change or comparison",
    "metric card dashboard statistic comparison value",
  ],
  [
    "table",
    "Table",
    "Display data in rows and columns.",
    "table data rows columns responsive",
  ],
  [
    "data-table",
    "Data table",
    "Sort a dense list of records.",
    "data table sort rows records",
  ],
  [
    "chart",
    "Chart",
    "Compare values over time.",
    "chart line bar data visualization",
  ],
  [
    "separator",
    "Separator",
    "Separate sections with a divider.",
    "separator divider horizontal vertical",
  ],
  [
    "resizable",
    "Resizable panels",
    "Resize adjacent panels.",
    "resizable panels splitter split view layout",
  ],
  [
    "aspect-ratio",
    "Aspect ratio",
    "Keep media within a fixed aspect ratio.",
    "aspect ratio image media",
  ],
  [
    "scroll-area",
    "Scroll area",
    "Scroll through content inside a fixed area.",
    "scroll area overflow list",
  ],
  [
    "carousel",
    "Carousel",
    "Browse a short sequence of items.",
    "carousel slides previous next",
  ],
  [
    "kbd",
    "Keyboard shortcut",
    "Display a keyboard key or shortcut.",
    "kbd keyboard shortcut keycap",
  ],
  [
    "code-block",
    "Code block",
    "Show code with syntax highlighting and a copy button.",
    "code block syntax snippet source copy lines",
  ],
  [
    "shader-canvas",
    "Shader canvas",
    "A soft animated color surface.",
    "shader canvas WebGL motion reduced",
  ],
] as const

const groupForId = new Map<string, string>()
for (const group of libraryGroups) {
  for (const id of group.ids) groupForId.set(id, group.name)
}

export const libraryEntries: LibraryEntry[] = definitions.map(
  ([id, name, description, terms]) => ({
    id,
    name,
    description: description.replace(/\.$/, ""),
    terms,
    group: groupForId.get(id) ?? "Components",
    related: (
      libraryGroups.find((group) => group.name === groupForId.get(id))?.ids ??
      []
    )
      .filter((relatedId) => relatedId !== id)
      .slice(0, 3),
  })
)

export function matchesLibraryEntry(entry: LibraryEntry, query: string) {
  const term = query.trim().toLowerCase()
  if (!term) return true
  return `${entry.name} ${entry.id} ${entry.group} ${entry.description} ${entry.terms}`
    .toLowerCase()
    .includes(term)
}

export const libraryEntryById = Object.fromEntries(
  libraryEntries.map((entry) => [entry.id, entry])
) as Record<string, LibraryEntry>
