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
        <p>Recent work and team updates</p>
        <div className="foundation-type__section">
          <h3>Recent activity</h3>
          <p>Use a consistent type scale for headings and interface text</p>
        </div>
        <span>Unna 400 · Source Sans 3 400–700</span>
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
    return `:root {
  --font-sans: "Source Sans 3 Variable", sans-serif;
  --font-heading: "Unna", Georgia, serif;
  --code-type-display: clamp(2.75rem, 4.4vw, 3.5rem);
  --code-type-page: clamp(2rem, 3.2vw, 2.75rem);
  --code-type-section: clamp(1.625rem, 2.2vw, 1.875rem);
  --code-type-group: 1.5rem;
  --code-type-compact: 1.25rem;
  --code-type-body: 1rem;
  --code-type-ui: 0.875rem;
  --code-type-meta: 0.75rem;
}

h1, h2 {
  font-family: var(--font-heading);
  font-weight: 400;
  text-wrap: balance;
}

h1 {
  font-size: var(--code-type-page);
  line-height: 1.08;
}

h2 {
  font-size: var(--code-type-section);
  line-height: 1.1;
}

body {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.5;
}`
  }

  if (entryId === "layout") {
    return `@theme inline {\n  --spacing: 0.25rem;\n}\n\n:root {\n  --space-1: 0.25rem;\n  --space-2: 0.5rem;\n  --space-3: 0.75rem;\n  --space-4: 1rem;\n  --space-6: 1.5rem;\n  --space-8: 2rem;\n}`
  }

  return ""
}
