import { useEffect, useState, type ReactNode, type RefObject } from "react"
import { TextMorph } from "torph/react"
import { PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentInstallDialog } from "./component-install-dialog"
import { loadComponentSpecimens } from "./component-specimen-loader"
import { libraryEntryById, type LibraryEntry } from "./library-data"
import "./component-page.css"

export function ComponentPage({
  entry,
  children,
  headingRef,
}: {
  entry: LibraryEntry
  children: ReactNode
  headingRef: RefObject<HTMLHeadingElement | null>
}) {
  const [view, setView] = useState("preview")
  const [snippet, setSnippet] = useState("")

  useEffect(() => {
    let current = true
    void loadComponentSpecimens().then((module) => {
      if (current) setSnippet(module.getComponentSnippet(entry.id))
    })
    return () => {
      current = false
    }
  }, [entry.id])

  const hasSnippet = snippet.trim().length > 0

  return (
    <article className="library__component-page library-component-detail">
      <header className="library-component-detail__header">
        <h1 ref={headingRef} tabIndex={-1}>
          <TextMorph
            as="span"
            duration={240}
            ease="cubic-bezier(0.19, 1, 0.22, 1)"
            respectReducedMotion
          >
            {entry.name}
          </TextMorph>
        </h1>
        <p>{entry.description}</p>
      </header>

      <Tabs
        className="library-component-detail__tabs"
        onValueChange={setView}
        value={view}
      >
        <div className="library-component-detail__toolbar">
          <TabsList
            aria-label={`${entry.name} views`}
            className="library-component-detail__switch"
          >
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {hasSnippet ? <TabsTrigger value="usage">Usage</TabsTrigger> : null}
          </TabsList>
          {entry.group !== "Foundations" ? (
            <ComponentInstallDialog
              key={entry.id}
              componentId={entry.id}
              trigger={
                <Button size="sm" variant="outline">
                  <PackagePlus aria-hidden="true" data-icon="inline-start" />
                  Install
                </Button>
              }
            />
          ) : null}
        </div>

        <TabsContent
          className="library-component-detail__content"
          value="preview"
        >
          <div
            className={`library__specimen-stage library__specimen-stage--${entry.id} library-component-detail__stage`}
          >
            {children}
          </div>
        </TabsContent>

        {hasSnippet ? (
          <TabsContent
            className="library-component-detail__content"
            value="usage"
          >
            <CodeBlock
              className="library-component-detail__usage"
              code={snippet}
              language="tsx"
              lineNumbers
              title="Usage"
            />
          </TabsContent>
        ) : null}
      </Tabs>

      {entry.related.length > 0 ? (
        <nav
          className="library-component-detail__related"
          aria-label="Related components"
        >
          <h2>Related</h2>
          <ul>
            {entry.related.map((id) => {
              const relatedEntry = libraryEntryById[id]
              if (!relatedEntry) return null

              return (
                <li key={id}>
                  <a href={`#${id}`}>{relatedEntry.name}</a>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : null}
    </article>
  )
}
