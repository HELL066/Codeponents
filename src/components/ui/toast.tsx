import { Toaster as SonnerToaster, toast } from "sonner"

export interface ToasterProps {
  theme?: "light" | "dark" | "system"
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
}

function Toaster({ theme = "light", position = "bottom-right" }: ToasterProps) {
  return (
    <SonnerToaster
      closeButton
      position={position}
      theme={theme}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-lg !border !border-code-line/35 !bg-code-surface !text-code-ink !shadow-[0_12px_32px_-20px_color-mix(in_srgb,var(--code-hero,#06192f)_30%,transparent),0_2px_8px_-4px_color-mix(in_srgb,var(--code-hero,#06192f)_14%,transparent)]",
          title: "!text-sm !font-medium !text-code-ink",
          description: "!text-sm !text-code-muted",
          actionButton: "!bg-code-ink !text-code-surface hover:!opacity-90",
          cancelButton: "!bg-code-quiet !text-code-ink hover:!opacity-90",
          closeButton:
            "!border-code-line/35 !bg-code-surface !text-code-muted hover:!bg-code-quiet",
        },
      }}
    />
  )
}

export { Toaster, toast }
