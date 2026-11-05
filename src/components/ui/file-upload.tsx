import * as React from "react"
import { FileText, Upload, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { TextMorph } from "torph/react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export interface FileUploadProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> {
  /** The currently selected files. Pass with `onValueChange` for controlled use. */
  value?: readonly File[]
  /** Initial files for uncontrolled use. */
  defaultValue?: readonly File[]
  /** Called after accepted files are added or removed. */
  onValueChange?: (files: File[]) => void
  /** A comma-separated list of file extensions or MIME types. */
  accept?: string
  /** Whether to allow more than one selected file. Defaults to `true`. */
  multiple?: boolean
  /** Maximum total number of selected files. */
  maxFiles?: number
  /** Maximum size for each file, in bytes. */
  maxSize?: number
  /** Visible name for the picker. */
  label?: string
  /** Optional hint shown below the picker. */
  description?: string
  /** Disable selection and removal. */
  disabled?: boolean
  /** Disable interaction and show an uploading state. */
  busy?: boolean
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function matchesAccept(file: File, accept?: string) {
  const rules = accept
    ?.split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
  if (!rules?.length) return true

  const fileType = file.type.toLowerCase()
  const extension = file.name.includes(".")
    ? `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`
    : ""

  return rules.some((rule) => {
    if (rule.startsWith(".")) return extension === rule
    if (rule.endsWith("/*")) return fileType.startsWith(rule.slice(0, -1))
    return fileType === rule
  })
}

function isSameFile(left: File, right: File) {
  return (
    left.name === right.name &&
    left.size === right.size &&
    left.lastModified === right.lastModified &&
    left.type === right.type
  )
}

function FileUpload({
  value,
  defaultValue,
  onValueChange,
  accept,
  multiple = true,
  maxFiles,
  maxSize,
  label = "Add files",
  description,
  disabled = false,
  busy = false,
  className,
  ...props
}: FileUploadProps) {
  const generatedId = React.useId()
  const inputId = `file-upload-${generatedId}`
  const descriptionId = `${inputId}-description`
  const errorId = `${inputId}-error`
  const prefersReducedMotion = useReducedMotion()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropzoneRef = React.useRef<HTMLButtonElement>(null)
  const dragDepth = React.useRef(0)
  const [uncontrolledFiles, setUncontrolledFiles] = React.useState<File[]>([
    ...(defaultValue ?? []),
  ])
  const [isDragActive, setIsDragActive] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])
  const [announcement, setAnnouncement] = React.useState("")
  const selectedFiles = value === undefined ? uncontrolledFiles : [...value]
  const isDisabled = disabled || busy
  const effectiveMaxFiles =
    maxFiles !== undefined && Number.isFinite(maxFiles)
      ? Math.max(0, Math.floor(maxFiles))
      : multiple
        ? undefined
        : 1
  const effectiveMaxSize =
    maxSize === undefined || !Number.isFinite(maxSize)
      ? undefined
      : Math.max(0, maxSize)
  const maxReached =
    multiple &&
    effectiveMaxFiles !== undefined &&
    effectiveMaxFiles > 0 &&
    selectedFiles.length >= effectiveMaxFiles
  const selectionUnavailable = effectiveMaxFiles === 0
  const isDropzoneDisabled = isDisabled || maxReached || selectionUnavailable
  const dragActive = isDragActive && !isDropzoneDisabled
  const hintParts = [
    effectiveMaxFiles === undefined
      ? null
      : effectiveMaxFiles === 0
        ? "No files allowed"
        : `Up to ${effectiveMaxFiles} ${effectiveMaxFiles === 1 ? "file" : "files"}`,
    effectiveMaxSize === undefined
      ? null
      : `${formatFileSize(effectiveMaxSize)} each`,
  ].filter(Boolean)
  const visibleDescription = maxReached
    ? [description, "Remove a file to add more"].filter(Boolean).join(" · ")
    : (description ?? hintParts.join(" · "))
  const describedBy =
    [visibleDescription ? descriptionId : null, errors.length ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined
  const dropzoneLabel = busy
    ? "Uploading"
    : maxReached && !disabled
      ? "File limit reached"
      : label
  const dropzoneHint = busy
    ? ""
    : disabled || selectionUnavailable
      ? ""
      : dragActive
        ? "Release to add files"
        : maxReached
          ? ""
          : errors.length
            ? "Choose another file to try again"
            : "Drop files here"

  const updateFiles = (nextFiles: File[]) => {
    if (value === undefined) setUncontrolledFiles(nextFiles)
    onValueChange?.(nextFiles)
  }

  const addFiles = (fileList: FileList | readonly File[]) => {
    const incoming = Array.from(fileList)
    if (!incoming.length) return

    const nextFiles = multiple ? [...selectedFiles] : []
    const limit = effectiveMaxFiles ?? Infinity
    const messages: string[] = []
    let added = 0
    setAnnouncement("")

    for (const file of incoming) {
      if (!matchesAccept(file, accept)) {
        messages.push(`${file.name} is not an accepted file type`)
        continue
      }
      if (effectiveMaxSize !== undefined && file.size > effectiveMaxSize) {
        messages.push(
          `${file.name} is larger than ${formatFileSize(effectiveMaxSize)}`
        )
        continue
      }
      if (nextFiles.some((selected) => isSameFile(selected, file))) continue
      if (nextFiles.length >= limit) {
        messages.push(`Choose up to ${limit} ${limit === 1 ? "file" : "files"}`)
        break
      }
      nextFiles.push(file)
      added += 1
    }

    if (added > 0) {
      updateFiles(nextFiles)
      setAnnouncement(`${added} ${added === 1 ? "file" : "files"} added`)
    }
    const summarizedMessages = messages.slice(0, 3)
    if (messages.length > 3)
      summarizedMessages.push(`And ${messages.length - 3} more`)
    setErrors(summarizedMessages)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) addFiles(event.currentTarget.files)
    event.currentTarget.value = ""
  }

  const removeFile = (fileToRemove: File) => {
    const nextFiles = selectedFiles.filter(
      (file) => !isSameFile(file, fileToRemove)
    )
    updateFiles(nextFiles)
    setErrors([])
    setAnnouncement(`${fileToRemove.name} removed`)
    dropzoneRef.current?.focus()
  }

  const handleDragEnter = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (
      isDropzoneDisabled ||
      !Array.from(event.dataTransfer.types).includes("Files")
    )
      return
    dragDepth.current += 1
    setIsDragActive(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setIsDragActive(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dragDepth.current = 0
    setIsDragActive(false)
    if (!isDropzoneDisabled) addFiles(event.dataTransfer.files)
  }

  return (
    <div
      {...props}
      aria-busy={busy}
      className={cn("grid w-full min-w-0 gap-3", className)}
      data-slot="file-upload"
      data-state={
        busy
          ? "busy"
          : disabled
            ? "disabled"
            : dragActive
              ? "dragging"
              : errors.length
                ? "rejected"
                : maxReached
                  ? "limit"
                  : selectedFiles.length
                    ? "selected"
                    : "empty"
      }
    >
      <input
        accept={accept}
        aria-hidden="true"
        className="sr-only"
        disabled={isDropzoneDisabled}
        id={inputId}
        multiple={multiple}
        onChange={handleInputChange}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />

      <button
        aria-describedby={describedBy}
        aria-disabled={(isDropzoneDisabled && !isDisabled) || undefined}
        aria-invalid={errors.length > 0 || undefined}
        className={cn(
          "group/dropzone flex min-h-20 w-full items-center gap-3 rounded-xl bg-code-accent-soft/30 px-4 py-3 text-left text-code-ink transition-[background-color,transform] duration-200 ease-out outline-none focus-visible:ring-3 focus-visible:ring-code-accent/25 motion-reduce:transition-none motion-reduce:active:scale-100",
          !isDropzoneDisabled &&
            "hover:enabled:bg-code-accent-soft/55 active:enabled:scale-[0.995]",
          dragActive && "bg-code-accent-soft/75",
          maxReached && "cursor-default bg-code-quiet/25",
          selectionUnavailable &&
            "cursor-not-allowed bg-code-quiet/35 text-code-muted",
          isDisabled && "cursor-not-allowed bg-code-quiet/35 text-code-muted",
          errors.length > 0 && !isDragActive && "bg-code-danger/5"
        )}
        data-state={
          busy
            ? "busy"
            : isDisabled || selectionUnavailable
              ? "disabled"
              : dragActive
                ? "dragging"
                : errors.length
                  ? "rejected"
                  : maxReached
                    ? "limit"
                    : selectedFiles.length
                      ? "selected"
                      : "empty"
        }
        disabled={isDisabled}
        onClick={() => {
          if (!isDropzoneDisabled) inputRef.current?.click()
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        ref={dropzoneRef}
        type="button"
      >
        {busy ? (
          <Spinner
            aria-hidden="true"
            className="size-5 shrink-0 text-code-accent"
            label="Uploading files"
          />
        ) : (
          <motion.span
            animate={
              dragActive && !prefersReducedMotion
                ? { y: -2, scale: 1.08 }
                : { y: 0, scale: 1 }
            }
            className="inline-flex size-5 shrink-0 items-center justify-center text-code-muted transition-colors group-hover/dropzone:text-code-accent"
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 360, damping: 24 }
            }
          >
            <Upload aria-hidden="true" className="size-5" strokeWidth={1.7} />
          </motion.span>
        )}
        <span className="grid min-w-0 flex-1 gap-0.5">
          <span className="text-sm leading-5 font-medium">
            <TextMorph
              as="span"
              duration={180}
              ease="cubic-bezier(0.19, 1, 0.22, 1)"
              respectReducedMotion
            >
              {dropzoneLabel}
            </TextMorph>
          </span>
          <span
            aria-hidden={!dropzoneHint || undefined}
            className={cn(
              "text-xs leading-4 text-code-muted",
              !dropzoneHint && "invisible"
            )}
          >
            <TextMorph
              as="span"
              duration={180}
              ease="cubic-bezier(0.19, 1, 0.22, 1)"
              respectReducedMotion
            >
              {dropzoneHint || "Drop files here"}
            </TextMorph>
          </span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "shrink-0 text-sm font-medium text-code-accent transition-opacity duration-150 group-hover/dropzone:text-code-ink",
            isDropzoneDisabled && "opacity-0"
          )}
        >
          Browse
        </span>
      </button>

      {visibleDescription ? (
        <p className="m-0 text-xs leading-5 text-code-muted" id={descriptionId}>
          {visibleDescription}
        </p>
      ) : null}

      {errors.length ? (
        <div
          className="grid gap-1 text-sm text-code-danger"
          id={errorId}
          role="alert"
        >
          {errors.map((message, index) => (
            <p className="m-0" key={`${message}-${index}`}>
              {message}
            </p>
          ))}
        </div>
      ) : null}

      <AnimatePresence initial={false}>
        {selectedFiles.length ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid min-w-0 gap-2"
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
            key="selected-files"
            transition={
              prefersReducedMotion
                ? { duration: 0.01 }
                : { duration: 0.18, ease: "easeOut" }
            }
          >
            <div className="flex items-center justify-between gap-3">
              <p className="m-0 text-sm font-medium text-code-ink">
                {selectedFiles.length}{" "}
                {selectedFiles.length === 1
                  ? "file selected"
                  : "files selected"}
              </p>
              {selectedFiles.length > 1 ? (
                <Button
                  className="min-h-10 shrink-0 px-2 text-code-muted"
                  disabled={isDisabled}
                  onClick={() => {
                    updateFiles([])
                    setErrors([])
                    setAnnouncement("Files removed")
                    dropzoneRef.current?.focus()
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Clear all
                </Button>
              ) : null}
            </div>
            <ul className="m-0 grid list-none gap-1 p-0">
              <AnimatePresence initial={false}>
                {selectedFiles.map((file) => (
                  <motion.li
                    animate={{ opacity: 1, y: 0 }}
                    className="group/file flex min-h-12 min-w-0 items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-code-quiet/25 motion-reduce:transition-none"
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -3 }
                    }
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 5 }
                    }
                    key={`${file.name}-${file.size}-${file.lastModified}-${file.type}`}
                    layout={!prefersReducedMotion}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.01 }
                        : { duration: 0.16, ease: "easeOut" }
                    }
                  >
                    <FileText
                      aria-hidden="true"
                      className="size-[18px] shrink-0 text-code-accent"
                      strokeWidth={1.8}
                    />
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="truncate text-sm leading-5 text-code-ink">
                        {file.name}
                      </span>
                      <span className="text-xs leading-4 text-code-muted tabular-nums">
                        {formatFileSize(file.size)}
                      </span>
                    </span>
                    <Button
                      aria-label={`Remove ${file.name}`}
                      className="size-10 shrink-0 text-code-muted hover:bg-code-danger/10 hover:text-code-danger"
                      disabled={isDisabled}
                      onClick={() => removeFile(file)}
                      size="icon-lg"
                      type="button"
                      variant="ghost"
                    >
                      <X aria-hidden="true" className="size-4" />
                    </Button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <span aria-live="polite" className="sr-only" role="status">
        {busy ? "Uploading files" : announcement}
      </span>
    </div>
  )
}

export { FileUpload }
