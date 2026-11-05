import { useEffect, useRef, useState, type ComponentProps } from "react"
import { Check, Copy } from "lucide-react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CopyButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "onClick"
> {
  value: string
  label?: string
  copiedLabel?: string
  onCopied?: () => void
}

function copyFallback(value: string) {
  if (!document.execCommand) return false

  const activeElement = document.activeElement
  const editableElement =
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement
      ? activeElement
      : null
  const selection = editableElement
    ? {
        start: editableElement.selectionStart,
        end: editableElement.selectionEnd,
        direction: editableElement.selectionDirection,
      }
    : null
  const documentRanges = editableElement
    ? []
    : Array.from(
        { length: document.getSelection()?.rangeCount ?? 0 },
        (_, index) => {
          const range = document.getSelection()?.getRangeAt(index)
          return range && !range.collapsed ? range.cloneRange() : null
        }
      ).filter((range): range is Range => range !== null)
  const input = document.createElement("textarea")
  input.value = value
  input.setAttribute("readonly", "")
  input.style.position = "fixed"
  input.style.insetInlineStart = "-9999px"
  input.style.opacity = "0"

  try {
    document.body.append(input)
    input.select()
    return document.execCommand("copy")
  } finally {
    input.remove()
    if (activeElement instanceof HTMLElement && activeElement.isConnected) {
      activeElement.focus({ preventScroll: true })
      if (
        editableElement &&
        selection &&
        selection.start !== null &&
        selection.end !== null
      ) {
        try {
          editableElement.setSelectionRange(
            selection.start,
            selection.end,
            selection.direction ?? undefined
          )
        } catch {
          // Some input types do not support text selection.
        }
      }
      if (documentRanges.length > 0) {
        const documentSelection = document.getSelection()
        if (documentSelection) {
          documentSelection.removeAllRanges()
          for (const range of documentRanges) {
            if (
              range.startContainer.isConnected &&
              range.endContainer.isConnected
            ) {
              try {
                documentSelection.addRange(range)
              } catch {
                // A detached or invalid range should not prevent copy feedback.
              }
            }
          }
        }
      }
    }
  }
}

function CopyButton({
  value,
  label = "Copy link",
  copiedLabel = "Copied",
  onCopied,
  className,
  ...props
}: CopyButtonProps) {
  const [copyResult, setCopyResult] = useState<{
    state: "idle" | "copied" | "error"
    value: string
  }>(() => ({ state: "idle", value }))
  const timeoutRef = useRef<number | null>(null)
  const valueRef = useRef(value)
  const copyRequestRef = useRef(0)

  useEffect(() => {
    return () => {
      copyRequestRef.current += 1
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    valueRef.current = value
    copyRequestRef.current += 1
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [value])

  const state = copyResult.value === value ? copyResult.state : "idle"

  const copy = async () => {
    const copiedValue = value
    const copyRequest = ++copyRequestRef.current
    const resetLabel = () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null
        if (copyRequest === copyRequestRef.current) {
          setCopyResult({ state: "idle", value: copiedValue })
        }
      }, 1800)
    }

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(copiedValue)
        } catch {
          if (!copyFallback(copiedValue))
            throw new Error("Clipboard access failed.")
        }
      } else if (!copyFallback(copiedValue)) {
        throw new Error("Clipboard access is unavailable.")
      }
    } catch {
      if (
        copyRequest !== copyRequestRef.current ||
        copiedValue !== valueRef.current
      )
        return
      setCopyResult({ state: "error", value: copiedValue })
      resetLabel()
      return
    }

    if (
      copyRequest !== copyRequestRef.current ||
      copiedValue !== valueRef.current
    )
      return

    // Copy feedback describes the clipboard result. A consumer callback must not
    // turn a successful copy into a visible copy error.
    setCopyResult({ state: "copied", value: copiedValue })
    resetLabel()
    onCopied?.()
  }

  const errorLabel = "Try again"
  const currentLabel =
    state === "copied" ? copiedLabel : state === "error" ? errorLabel : label
  const possibleLabels = [label, copiedLabel, errorLabel]

  return (
    <>
      <Button
        {...props}
        className={cn(
          "group/copy-button min-h-9 data-[copy-state=copied]:hover:bg-background data-[copy-state=copied]:hover:text-foreground data-[copy-state=error]:border-code-danger/30 data-[copy-state=error]:text-code-danger",
          className
        )}
        data-copy-state={state}
        onClick={copy}
        type="button"
        variant={props.variant ?? "outline"}
      >
        <span aria-hidden="true" className="grid shrink-0 grid-cols-1">
          <span className="invisible col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <Copy className="size-3.5" />
            <span>
              {possibleLabels.reduce(
                (longest, next) =>
                  next.length > longest.length ? next : longest,
                label
              )}
            </span>
          </span>
          <span className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="relative grid size-3.5 shrink-0">
              <Copy className="absolute inset-0 size-3.5 transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-data-[copy-state=copied]/copy-button:scale-90 group-data-[copy-state=copied]/copy-button:opacity-0 motion-reduce:transition-none" />
              <Check className="absolute inset-0 size-3.5 scale-90 opacity-0 transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-data-[copy-state=copied]/copy-button:scale-100 group-data-[copy-state=copied]/copy-button:opacity-100 motion-reduce:transition-none" />
            </span>
            <TextMorph
              as="span"
              className="whitespace-nowrap"
              duration={240}
              ease="cubic-bezier(0.19, 1, 0.22, 1)"
              key={value}
              scale={false}
              respectReducedMotion
            >
              {currentLabel}
            </TextMorph>
          </span>
        </span>
      </Button>
      <span aria-live="polite" className="sr-only" role="status">
        {state === "copied"
          ? copiedLabel
          : state === "error"
            ? "Could not copy. Try again."
            : ""}
      </span>
    </>
  )
}

export { CopyButton }
