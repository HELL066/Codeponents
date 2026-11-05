import { useEffect, useState, type ComponentProps } from "react"
import type { ThemeRegistration } from "shiki"
import { CopyButton } from "@/components/ui/copy-button"
import { cn } from "@/lib/utils"
import "./code-block.css"

const THEME_NAME = "codeponents-navy"

const CODEPONENTS_THEME = {
  name: THEME_NAME,
  type: "dark",
  colors: {
    "editor.background": "#06192f",
    "editor.foreground": "#eaf1f6",
    "editor.selectionBackground": "#25415b",
    "editor.lineHighlightBackground": "#0d2740",
    "editorCursor.foreground": "#88b7d5",
    "editorLineNumber.foreground": "#71869a",
  },
  tokenColors: [
    {
      scope: ["comment"],
      settings: { foreground: "#8ba0b2", fontStyle: "italic" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: "#9fcbe4" },
    },
    { scope: ["string", "string.quoted"], settings: { foreground: "#d7e6a6" } },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: "#91c4e3" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.boolean"],
      settings: { foreground: "#f0c58e" },
    },
    {
      scope: ["entity.name.type", "support.type"],
      settings: { foreground: "#c8b9e7" },
    },
    {
      scope: ["punctuation", "keyword.operator"],
      settings: { foreground: "#c4d0dc" },
    },
  ],
} satisfies ThemeRegistration

type ShikiModule = typeof import("shiki")
type ShikiHighlighter = Awaited<ReturnType<ShikiModule["createHighlighter"]>>
type CodeToken = { content: string; color?: string }

let highlighterPromise: Promise<ShikiHighlighter> | null = null
const languagePromises = new Map<string, Promise<unknown>>()

async function getHighlighter(language: string) {
  const { createHighlighter } = await import("shiki")
  const pending =
    highlighterPromise ??
    (highlighterPromise = createHighlighter({
      themes: [CODEPONENTS_THEME],
      langs: [],
    }))

  let highlighter: ShikiHighlighter
  try {
    highlighter = await pending
  } catch (error) {
    highlighterPromise = null
    throw error
  }

  let languagePromise = languagePromises.get(language)
  if (!languagePromise) {
    languagePromise = highlighter.loadLanguage(
      language as Parameters<ShikiHighlighter["loadLanguage"]>[0]
    )
    languagePromises.set(language, languagePromise)
  }
  await languagePromise

  return highlighter
}

export interface CodeBlockProps extends Omit<
  ComponentProps<"section">,
  "children"
> {
  /** Source text copied exactly as provided. */
  code: string
  /** Shiki language id, loaded only when this component is rendered. */
  language?: string
  /** Short context shown in the block header. */
  title?: string
  /** Show source line numbers. */
  lineNumbers?: boolean
  /** Wrap long lines instead of allowing horizontal scroll. */
  wrap?: boolean
  /** Hide the copy action when the surrounding UI provides one. */
  copyable?: boolean
}

interface HighlightState {
  code: string
  language: string
  tokens: CodeToken[][] | null
}

function CodeBlock({
  code,
  language = "tsx",
  title,
  lineNumbers = false,
  wrap = false,
  copyable = true,
  className,
  ...sectionProps
}: CodeBlockProps) {
  const [highlightState, setHighlightState] = useState<HighlightState | null>(
    null
  )
  const currentTokens =
    highlightState?.code === code && highlightState.language === language
      ? highlightState.tokens
      : null

  useEffect(() => {
    let active = true

    void getHighlighter(language)
      .then((highlighter) => {
        const { tokens } = highlighter.codeToTokens(code, {
          lang: language as Parameters<
            ShikiHighlighter["codeToTokens"]
          >[1]["lang"],
          theme: THEME_NAME,
        })
        if (active) {
          setHighlightState({
            code,
            language,
            tokens: tokens as CodeToken[][],
          })
        }
      })
      .catch(() => {
        if (active) setHighlightState({ code, language, tokens: null })
      })

    return () => {
      active = false
    }
  }, [code, language])

  const plainLines: CodeToken[][] = code
    .split("\n")
    .map((line) => [{ content: line }])
  const lines = currentTokens ?? plainLines

  return (
    <section
      {...sectionProps}
      className={cn("code-block", className)}
      data-slot="code-block"
    >
      <header className="code-block__header">
        <div className="code-block__heading">
          {title ? <span className="code-block__title">{title}</span> : null}
          <span className="code-block__language">{language}</span>
        </div>
        {copyable ? (
          <CopyButton
            className="code-block__copy"
            copiedLabel="Copied"
            label="Copy"
            size="sm"
            value={code}
            variant="ghost"
          />
        ) : null}
      </header>
      <pre
        aria-label={title ? `${title} code` : `${language} code`}
        className={cn(
          "code-block__content",
          lineNumbers && "code-block__content--numbered",
          wrap && "code-block__content--wrapped"
        )}
        dir="ltr"
        tabIndex={0}
      >
        <code>
          {lines.map((line, lineIndex) => (
            <span className="code-block__line" key={lineIndex}>
              {lineNumbers ? (
                <span aria-hidden="true" className="code-block__line-number">
                  {lineIndex + 1}
                </span>
              ) : null}
              {line.map((token, tokenIndex) => (
                <span
                  key={`${lineIndex}-${tokenIndex}`}
                  style={token.color ? { color: token.color } : undefined}
                >
                  {token.content}
                </span>
              ))}
              {lineIndex < lines.length - 1 ? "\n" : null}
            </span>
          ))}
        </code>
      </pre>
    </section>
  )
}

export { CodeBlock }
