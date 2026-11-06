import { useState } from "react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import { ChangeHighlight } from "@/components/ui/change-highlight"
import { ConfettiBurst } from "@/components/ui/confetti-burst"
import { MetricCard } from "@/components/ui/metric-card"
import {
  SuccessCheck,
  type SuccessCheckState,
} from "@/components/ui/success-check"

const snippets: Record<string, string> = {
  "confetti-burst": [
    'import { useState } from "react"',
    'import { Button } from "@/components/ui/button"',
    'import { ConfettiBurst } from "@/components/ui/confetti-burst"',
    'import { SuccessCheck } from "@/components/ui/success-check"',
    "",
    "function UploadComplete() {",
    "  const [burst, setBurst] = useState(0)",
    "",
    "  return (",
    '    <div className="space-y-3">',
    '      <div className="relative grid size-10 place-items-center">',
    '        <SuccessCheck state="success" label="Upload complete" />',
    "        <ConfettiBurst triggerKey={burst} />",
    "      </div>",
    "      <Button onClick={() => setBurst((value) => value + 1)}>",
    "        Celebrate upload",
    "      </Button>",
    "    </div>",
    "  )",
    "}",
  ].join("\n"),
  "success-check": [
    'import { SuccessCheck } from "@/components/ui/success-check"',
    "",
    '<SuccessCheck state="success" size="lg" label="Upload complete" />',
    '<SuccessCheck state="loading" label="Uploading files" />',
    '<SuccessCheck state="error" label="Upload failed" />',
  ].join("\n"),
  "change-highlight": [
    'import { useState } from "react"',
    'import { ChangeHighlight } from "@/components/ui/change-highlight"',
    'import { MetricCard } from "@/components/ui/metric-card"',
    "",
    "function CompletedTasks() {",
    "  const [completed, setCompleted] = useState(4)",
    "",
    "  return (",
    "    <ChangeHighlight",
    "      triggerKey={completed}",
    "    >",
    "      <MetricCard",
    '        label="Completed tasks"',
    "        value={completed}",
    '        comparison="today"',
    '        tone="positive"',
    "      />",
    "    </ChangeHighlight>",
    "  )",
    "}",
  ].join("\n"),
}

export const delightEntryIds: ReadonlySet<string> = new Set(
  Object.keys(snippets)
)

function ConfettiBurstSpecimen() {
  const [burst, setBurst] = useState(0)

  return (
    <div className="mx-auto flex w-full max-w-md flex-wrap items-center gap-4 rounded-xl border border-code-line bg-code-surface p-4">
      <div className="relative grid size-10 shrink-0 place-items-center">
        <SuccessCheck label="File uploaded" size="md" state="success" />
        <ConfettiBurst triggerKey={burst} />
      </div>
      <div className="min-w-32 flex-1">
        <p className="text-sm font-medium text-code-ink">File uploaded</p>
        <p className="mt-0.5 text-xs text-code-muted">Ready to share</p>
      </div>
      <Button
        onClick={() => setBurst((value) => value + 1)}
        size="sm"
        variant="outline"
      >
        Celebrate
      </Button>
    </div>
  )
}

const statusSequence: SuccessCheckState[] = ["loading", "success", "error"]

function SuccessCheckSpecimen() {
  const [state, setState] = useState<SuccessCheckState>("loading")
  const stateCopy: Record<
    SuccessCheckState,
    { label: string; title: string; description: string; control: string }
  > = {
    loading: {
      label: "Uploading files",
      title: "Uploading files",
      description: "Preparing three files to share.",
      control: "Loading",
    },
    success: {
      label: "Upload complete",
      title: "Upload complete",
      description: "Three files are ready to share.",
      control: "Complete",
    },
    error: {
      label: "Upload failed",
      title: "Upload needs attention",
      description: "One file type is not supported.",
      control: "Error",
    },
  }

  return (
    <div className="space-y-3">
      <div className="flex min-w-0 items-center gap-4 rounded-xl border border-code-line bg-code-surface p-5">
        <SuccessCheck label={stateCopy[state].label} size="lg" state={state} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-code-ink">
            <TextMorph
              as="span"
              duration={220}
              key={state}
              respectReducedMotion
            >
              {stateCopy[state].title}
            </TextMorph>
          </p>
          <p className="mt-1 text-xs leading-5 text-code-muted">
            {stateCopy[state].description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          aria-label="Preview a status"
          className="flex items-center gap-1.5"
          role="group"
        >
          {statusSequence.map((nextState) => (
            <Button
              key={nextState}
              aria-pressed={state === nextState}
              onClick={() => setState(nextState)}
              size="sm"
              variant={state === nextState ? "secondary" : "ghost"}
            >
              {stateCopy[nextState].control}
            </Button>
          ))}
        </div>
        <div
          aria-label="Success check sizes"
          className="flex items-center gap-3 rounded-lg border border-code-line/70 bg-code-surface px-3 py-2"
          role="group"
        >
          <span className="text-xs text-code-muted">Sizes</span>
          <SuccessCheck
            label="Small complete state"
            size="sm"
            state="success"
          />
          <SuccessCheck
            label="Medium complete state"
            size="md"
            state="success"
          />
          <SuccessCheck
            label="Large complete state"
            size="lg"
            state="success"
          />
        </div>
      </div>
    </div>
  )
}

function ChangeHighlightSpecimen() {
  const [completed, setCompleted] = useState(4)

  return (
    <div className="mx-auto grid w-full max-w-xs justify-items-center gap-3">
      <ChangeHighlight className="w-full rounded-xl" triggerKey={completed}>
        <MetricCard
          className="w-full justify-items-center text-center"
          change={completed === 4 ? "Baseline" : "+1"}
          comparison="today"
          label="Completed tasks"
          tone="positive"
          value={completed}
        />
      </ChangeHighlight>
      <Button
        onClick={() => setCompleted((value) => value + 1)}
        size="sm"
        variant="outline"
      >
        Complete one task
      </Button>
    </div>
  )
}

export function DelightSpecimen({ entryId }: { entryId: string }) {
  if (entryId === "confetti-burst") return <ConfettiBurstSpecimen />
  if (entryId === "success-check") return <SuccessCheckSpecimen />
  if (entryId === "change-highlight") return <ChangeHighlightSpecimen />
  return null
}

export function getDelightSnippet(entryId: string) {
  return snippets[entryId] ?? ""
}
