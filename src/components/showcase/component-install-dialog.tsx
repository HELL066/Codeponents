import { useState, type ReactNode } from "react"
import { PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { CopyButton } from "@/components/ui/copy-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { libraryEntries } from "./library-data"

const registryUrl = "https://codeponents.pages.dev/r/v1/{name}.json"
const themeImport = '@import "@/components/ui/codeponents-theme.css";'

const componentOptions: ComboboxOption[] = libraryEntries
  .filter((entry) => entry.group !== "Foundations")
  .map((entry) => ({
    value: entry.id,
    label: entry.name,
    group: entry.group,
    keywords: entry.terms.split(/\s+/),
  }))

function InstallStep({
  title,
  detail,
  value,
  copyLabel,
}: {
  title: string
  detail: string
  value: string
  copyLabel: string
}) {
  return (
    <section className="grid min-w-0 gap-2.5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-code-ink">{title}</h3>
          <p className="mt-0.5 text-xs leading-5 text-code-muted">{detail}</p>
        </div>
        <CopyButton
          aria-label={`Copy ${copyLabel}`}
          className="shrink-0"
          copiedLabel="Copied"
          label="Copy"
          size="sm"
          value={value}
        />
      </div>
      <pre className="min-w-0 rounded-lg bg-code-canvas px-3 py-2.5 text-[11px] leading-5 [overflow-wrap:anywhere] whitespace-pre-wrap text-code-ink">
        <code>{value}</code>
      </pre>
    </section>
  )
}

export function ComponentInstallDialog({
  trigger,
  componentId,
}: {
  trigger?: ReactNode
  componentId?: string
}) {
  const [selectedId, setSelectedId] = useState(componentId ?? "button")

  const selectedOption = componentOptions.find(
    (option) => option.value === selectedId
  )
  const registryCommand = `npx shadcn@latest registry add @codeponents=${registryUrl}`
  const componentCommand = `npx shadcn@latest add @codeponents/${selectedId}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <PackagePlus aria-hidden="true" data-icon="inline-start" />
            Add components
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[min(42rem,calc(100vw-1.5rem))] max-w-none gap-0 p-0">
        <div className="grid gap-5 p-5 sm:gap-6 sm:p-7">
          <DialogHeader className="gap-1.5">
            <DialogTitle className="font-heading text-code-section leading-[1.12] font-normal tracking-[-0.015em]">
              Add to your project
            </DialogTitle>
            <DialogDescription className="mt-1 max-w-[56ch] text-code-body leading-6 font-normal text-code-muted not-italic">
              Copy editable components into a React and Tailwind CSS 4 project.
            </DialogDescription>
          </DialogHeader>

          <div className="grid min-w-0 gap-2">
            <label
              className="text-sm font-medium text-code-ink"
              id="codeponents-component-picker-label"
            >
              Choose a component
            </label>
            <Combobox
              ariaLabel="Component"
              className="bg-code-surface"
              emptyMessage="No matching components"
              id="codeponents-component-picker"
              aria-labelledby="codeponents-component-picker-label"
              options={componentOptions}
              placeholder="Search components"
              searchPlaceholder="Type a component name"
              value={selectedId}
              onValueChange={(value) => {
                if (value) setSelectedId(value)
              }}
            />
          </div>

          <div className="grid gap-5 border-t border-code-line/50 pt-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5">
            <InstallStep
              copyLabel="registry command"
              detail="Add Codeponents to your shadcn registry list once."
              title="Connect the registry"
              value={registryCommand}
            />
            <InstallStep
              copyLabel="component command"
              detail={`Install ${selectedOption?.label ?? "the selected component"} and its dependencies.`}
              title="Add the component"
              value={componentCommand}
            />
          </div>

          <section className="grid gap-2 border-t border-code-line/50 pt-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-code-ink">
                  Add the theme
                </h3>
                <p className="mt-0.5 text-xs leading-5 text-code-muted">
                  Import once from your global stylesheet.
                </p>
              </div>
              <CopyButton
                aria-label="Copy theme import"
                className="shrink-0"
                copiedLabel="Copied"
                label="Copy"
                size="sm"
                value={themeImport}
              />
            </div>
            <pre className="min-w-0 rounded-lg bg-code-canvas px-3 py-2.5 text-[11px] leading-5 [overflow-wrap:anywhere] whitespace-pre-wrap text-code-ink">
              <code>{themeImport}</code>
            </pre>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
