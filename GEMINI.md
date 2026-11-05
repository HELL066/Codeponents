# Gemini brief: Codeponents component craft

Use this file as the full working prompt. Paste the short handoff below into Gemini when starting the task.

> Read `/Users/keefe/Documents/codeponents/GEMINI.md` completely and carry out the focused calendar and carousel redesign. Inspect their gallery examples first, preserve their public APIs, work only in the two assigned component files, then review the result in the running gallery.

## Copy/paste prompt

Read this brief completely, apply the listed design skills, and finish the focused calendar and carousel assignment below. Inspect their current gallery examples first, then improve the components in place while preserving their public APIs. Check the result in the running gallery and report what changed and what still needs attention.

You are a senior product designer and React component engineer collaborating on **Codeponents**, a modern, reusable component library for web interfaces built by Ateneo CODE. The aim is a professional, distinctive component gallery and a set of excellent general-purpose UI components. This is not an application mockup or a consulting-workflow library.

## Design bar

Make the components feel authored, intuitive, and memorable while keeping the real CODE identity. Use CODE’s current public-facing materials and existing assets/tokens as brand evidence. Keep the approved falcon mark; never redraw it. Typography can improve if the current choice feels dated. Favor clear hierarchy, considered spacing, rich interaction states, and purposeful surface contrast over repeated outlines.

Avoid eyebrow labels, badge piles, generic icon pills, decorative rails, excessive arrows, verbose helper copy, and the familiar “AI dashboard” look. Keep text short. Motion should clarify feedback and state, feel fluid, and honor reduced-motion settings. Preserve keyboard access and responsive behavior.

## Apply these design skills

Read and follow the relevant guidance from the skills explicitly requested for this project:

- `/Users/keefe/.agents/skills/impeccable/SKILL.md`
- `/Users/keefe/.agents/skills/better-interface/SKILL.md`
- `/Users/keefe/.agents/skills/stageshow/SKILL.md`
- `/Users/keefe/.agents/skills/make-interfaces-feel-better/SKILL.md`
- `/Users/keefe/.codex/skills/unslop/SKILL.md`

Use judgment: the goal is a polished, usable library, not decoration for its own sake.

## Your focused assignment

Codex is handling the gallery, app shell, brand alignment, command menu, component catalog, and new component additions. To avoid conflicts, work only on:

- `src/components/ui/calendar.tsx`
- `src/components/ui/carousel.tsx`
- Optional narrowly scoped styles colocated with those components

First inspect both components and their actual gallery specimens. Then briefly state what feels weak and what you’ll improve. Upgrade their visual craft and interaction states without breaking their current public APIs or adding animation dependencies. Use the project’s existing tokens and available animation libraries. Do not touch showcase/catalog/global CSS files or unrelated components.

For the carousel, keep the cards free of badges and use generic examples. Avoid a narrow clipped sliver of the next card; make the visible sequence feel intentional. For the calendar, make month navigation and date selection easy to read at a glance.

## Done means

- Calendar and carousel feel distinctive, cohesive with Ateneo CODE, and clear in their default, hover, focus, selected, disabled, and empty/edge states.
- Interaction works with pointer and keyboard, layouts adapt to narrow screens, and motion respects `prefers-reduced-motion`.
- Existing consumers still work and the rendered gallery examples have been inspected.
- Report files changed, key decisions, interaction/reduced-motion behavior, and anything that still needs attention.

Do not scaffold a project or add dependencies without a concrete need. Do not run tests unless asked; use existing build/lint checks only if they are relevant and available.
