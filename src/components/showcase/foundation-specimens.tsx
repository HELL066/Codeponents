import type { CSSProperties } from "react"

const tokenRows = [
  ["Navy", "var(--code-hero)"],
  ["Action", "var(--code-accent)"],
  ["Canvas", "var(--code-canvas)"],
  ["Surface", "var(--code-surface)"],
  ["Text", "var(--code-ink)"],
  ["Muted", "var(--code-muted)"],
  ["Divider", "var(--code-line)"],
] as const

export function FoundationSpecimen({ entryId }: { entryId: string }) {
  if (entryId === "colors") {
    return (
      <div className="foundation-colors">
        {tokenRows.map(([label, color]) => (
          <div className="foundation-color" key={label}>
            <span
              aria-hidden="true"
              style={{ "--swatch": color } as CSSProperties}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    )
  }

  if (entryId === "type") {
    return (
      <div className="foundation-type">
        <h2>Project overview</h2>
        <p>Recent work, gathered in one clear view</p>
        <span>Unna · Source Sans 3</span>
      </div>
    )
  }

  if (entryId === "layout") {
    return (
      <div className="foundation-spacing">
        {[4, 8, 12, 16, 24, 32].map((space) => (
          <div className="foundation-spacing__row" key={space}>
            <span>{space}</span>
            <span aria-hidden="true" style={{ width: `${space * 4}px` }} />
          </div>
        ))}
      </div>
    )
  }

  return null
}

export function getFoundationSnippet(entryId: string) {
  if (entryId === "colors") {
    return `:root {\n  --code-hero: #06192f;\n  --code-accent: #0c315c;\n  --code-canvas: #f5f5f6;\n  --code-surface: #ffffff;\n  --code-ink: #121315;\n  --code-muted: #3d5266;\n}`
  }

  if (entryId === "type") {
    return `h1, h2 {\n  font-family: var(--font-heading);\n  font-weight: 400;\n  text-wrap: balance;\n}\n\nbody, button, input {\n  font-family: var(--font-sans);\n}`
  }

  if (entryId === "layout") {
    return `@theme inline {\n  --spacing: 0.25rem;\n}\n\n:root {\n  --space-1: 0.25rem;\n  --space-2: 0.5rem;\n  --space-3: 0.75rem;\n  --space-4: 1rem;\n  --space-6: 1.5rem;\n  --space-8: 2rem;\n}`
  }

  return ""
}
