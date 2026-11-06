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

- Use CSS transitions for frequent, interruptible control feedback: hover, focus, selected, and pressed states. Transition only the changing properties, use `150ms` as the default duration, and use an ease-out curve. Prefer `transition-[color,background-color,border-color,box-shadow,opacity,transform]` over `transition-all`; remove transitions with `motion-reduce:transition-none` where appropriate.
- Use Motion when the spatial relationship matters, such as a selected surface moving between choices or keyed list rows reordering. Keep React keys stable and animate `layout="position"` when only an item's position changes. The default spring is `{ type: "spring", duration: 0.3, bounce: 0 }`: it settles quickly without overshoot. Use `LayoutGroup` to scope shared `layoutId` indicators.
- Use Torph for short stateful text changes, such as status labels, counts, and `On` / `Off`. Prefer `duration={220}` with `respectReducedMotion`. Reserve the maximum label width or use tabular numerals when a changing value could shift nearby content.
- Keep interactions interruptible: CSS transitions and Motion layout animations should retarget from their current rendered state when the user changes direction. Avoid keyframes for controls, broad `transition-all`, large positional travel, and unrequested page-load entrances. Use `AnimatePresence initial={false}` when an exit transition is needed for content already present at mount.
- A `scale(0.96)` press response may be used for actions that benefit from tactile feedback; keep it on a short CSS transition and omit it from controls where scaling would distract.
- Respect `prefers-reduced-motion` across CSS, Motion, Torph, and `ShaderCanvas`. Disable positional or scale movement while preserving clear immediate state changes. The app-level Motion provider uses `reducedMotion="user"` as a baseline; component-specific CSS and Torph effects still need their own reduced-motion handling.
- Treat `ShaderCanvas` as an optional visual component with a themed fallback; core controls must not depend on WebGL.

## Component and gallery standards

- Keep component behavior and appearance reusable outside CODE-specific workflows.
- Use semantic HTML and accessible names, visible focus, keyboard operation, touch-friendly targets, and responsive layouts.
- Show useful idle, hover, focus, selected, disabled, loading, empty, and error states where relevant.
- Make each gallery preview functional and representative. Use plausible data and concise labels; do not add decorative states that imply unsupported behavior.
- Keep the `Preview` and `Usage` views focused on the component. Document dependencies in `THIRD_PARTY.md` and export reusable components from `src/components/ui/index.ts`.

## Implementation foundation

The current library uses React, TypeScript, Vite, Tailwind CSS 4, semantic CSS variables, Radix primitives, and Lucide icons. Component source is owned by this project. Add a runtime dependency only when it materially improves behavior or accessibility, and document its role and fallback.
