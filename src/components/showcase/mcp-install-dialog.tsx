import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CopyButton } from "@/components/ui/copy-button"

const endpoint = "https://codeponents.pages.dev/mcp"
const configuration = JSON.stringify(
  {
    mcpServers: {
      codeponents: {
        type: "http",
        url: endpoint,
      },
    },
  },
  null,
  2
)

export function McpInstallDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[36rem]">
        <DialogHeader>
          <DialogTitle className="font-heading text-code-section leading-[1.12] font-normal tracking-[-0.015em]">
            Connect Codeponents
          </DialogTitle>
          <DialogDescription className="mt-1 max-w-[52ch] text-code-body leading-6 text-code-muted">
            Find components, check install commands, and get setup guidance.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <section className="grid min-w-0 gap-2">
            <h3 className="text-sm font-medium text-code-ink">Server URL</h3>
            <div className="flex min-w-0 items-center gap-2">
              <code className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-code-canvas px-3 py-2.5 font-mono text-xs text-code-ink">
                {endpoint}
              </code>
              <CopyButton
                className="shrink-0"
                label="Copy URL"
                copiedLabel="Copied"
                size="sm"
                value={endpoint}
              />
            </div>
          </section>

          <section className="grid min-w-0 gap-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-code-ink">
                Client configuration
              </h3>
              <CopyButton
                label="Copy config"
                copiedLabel="Copied"
                size="sm"
                value={configuration}
              />
            </div>
            <pre className="max-h-56 overflow-auto rounded-lg bg-code-canvas p-3 font-mono text-xs leading-5 text-code-ink">
              <code>{configuration}</code>
            </pre>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
