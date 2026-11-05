# Codeponents design system

## Purpose

Codeponents is a browsable, reusable React component library for Ateneo CODE. Components stay general-purpose; gallery examples use familiar, fictional interface content instead of encoding CODE consulting workflows or simulating the portal.

## Brand anchors

Use the current portal's verified palette and typography as the starting point:

| Token           | Value     | Use                                  |
| --------------- | --------- | ------------------------------------ |
| `--code-hero`   | `#06192f` | Deep CODE navy and dark surfaces     |
| `--code-accent` | `#0c315c` | Primary accent and selected controls |
| `--code-canvas` | `#f5f5f6` | Light page background                |
| `--code-muted`  | `#3d5266` | Secondary text and quiet icons       |
| `--code-ring`   | `#4986ac` | Visible keyboard focus               |

- Use Source Sans 3 for interface text and Unna for large headings. Keep Unna out of labels and controls.
- Use the approved falcon at `public/code-falcon-white.png` on compatible dark surfaces. Do not recreate, redraw, recolor, or approximate the mark.
- Keep semantic tokens in `src/components/ui/codeponents-theme.css`; `src/tokens.css` composes it for the gallery. Components should consume tokens instead of introducing local brand colors.
- The dark theme may adjust contrast while keeping the navy and blue identity recognizable.

## Visual character

Professional, modern, precise, and quietly expressive. Let CODE identity show through its navy, typography, and real falcon asset. Give visual richness to a small number of component previews or meaningful states; keep navigation and supporting chrome calm.

- Make the component itself the subject. Avoid portal mockups and CODE-specific consulting content.
- Prefer clear surface changes and spacing over stacked cards or repeated outlines. Use borders for separation, state, or focus when they add meaning.
- Keep descriptions brief. Do not add eyebrow labels, decorative arrows, or filler copy.
- Use badges only when they carry real status or category information. They are not a default treatment for emphasis.
- Use Lucide icons sparingly and consistently. Never use emoji as interface icons or invent a replacement CODE mark.

## Motion and feedback

- Use Torph for dynamic or stateful text, including labels such as `On` / `Off`, action feedback, and changing values. Give the text a fixed-width slot or reserve its maximum dimensions before it changes so feedback never shifts the layout.
- Use Motion for meaningful state transitions and layout changes. Use CSS transitions for small hover, focus, and pressed states.
- Keep movement short and interruptible. Do not animate page-load content indiscriminately or add continuous motion without a clear purpose.
- Respect `prefers-reduced-motion` across CSS, Motion, Torph, and `ShaderCanvas`.
- Treat `ShaderCanvas` as an optional visual component with a themed fallback; core controls must not depend on WebGL.

## Component and gallery standards

- Keep component behavior and appearance reusable outside CODE-specific workflows.
- Use semantic HTML and accessible names, visible focus, keyboard operation, touch-friendly targets, and responsive layouts.
- Show useful idle, hover, focus, selected, disabled, loading, empty, and error states where relevant.
- Make each gallery preview functional and representative. Use plausible data and concise labels; do not add decorative states that imply unsupported behavior.
- Keep the `Preview` and `Usage` views focused on the component. Document dependencies in `THIRD_PARTY.md` and export reusable components from `src/components/ui/index.ts`.

## Implementation foundation

The current library uses React, TypeScript, Vite, Tailwind CSS 4, semantic CSS variables, Radix primitives, and Lucide icons. Component source is owned by this project. Add a runtime dependency only when it materially improves behavior or accessibility, and document its role and fallback.
