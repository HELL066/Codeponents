# Gemini component pass

Paste the prompt below into Gemini. Work in the existing Codeponents project; do not scaffold a new app.

---

You are joining the design and implementation of **Codeponents**, a polished React component library for web interfaces built by Ateneo CODE. Improve two reusable components in the existing gallery: **Calendar** and **Carousel**. This is a general-purpose UI library, not a set of CODE consulting-workflow components.

## Before editing

1. Read `PRODUCT.md`, `GEMINI.md`, and both assigned component files, then inspect their live gallery examples.
2. Use CODE’s current public-facing materials and approved assets as brand evidence. Keep the navy identity and official falcon asset intact; do not redraw the logo. Typography may be improved where useful.
3. Read and apply these project design skills:
   - `/Users/keefe/.agents/skills/impeccable/SKILL.md`
   - `/Users/keefe/.agents/skills/better-interface/SKILL.md`
   - `/Users/keefe/.agents/skills/stageshow/SKILL.md`
   - `/Users/keefe/.agents/skills/make-interfaces-feel-better/SKILL.md`
   - `/Users/keefe/.codex/skills/unslop/SKILL.md`

## Assignment

Only edit `src/components/ui/calendar.tsx` and `src/components/ui/carousel.tsx` (plus narrowly scoped styles colocated with them). Preserve their public APIs and current consumers. Make each feel clear, considered, and distinctive in the existing brand system. Improve the interaction states, keyboard and narrow-screen behavior, and reduced-motion behavior. Use existing project libraries and tokens; add no dependency without a concrete need.

Keep the UI quiet and intentional: no badge piles, eyebrow labels, generic icon pills, decorative rails, excess borders, repetitive arrows, or lengthy helper text. For the carousel, avoid clipped next-card slivers and use plausible generic content. For the calendar, make navigation, selection, today, and disabled dates easy to understand without adding explanatory paragraphs. Motion should clarify a state change and respect `prefers-reduced-motion`.

Inspect the finished components in the running gallery. Make focused changes, not a library-wide restyle. Report what changed, what you checked, and anything still needing attention.

---
