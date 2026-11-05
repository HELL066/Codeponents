---
name: codeponents
description: Install, discover, and use Codeponents React components through the shadcn registry or MCP. Use when setting up a project, choosing components, or composing a screen with the library.
---

# Codeponents

Codeponents is a reusable React component library made for the Ateneo CODE organization. Components are copied into the consuming app, so teams can adapt them to their needs.

## Install components

Use a React, TypeScript, Tailwind CSS 4, and shadcn project. If shadcn is not configured yet, run `npx shadcn@latest init` and follow its setup for the existing app.

Add the registry once:

```sh
npx shadcn@latest registry add @codeponents=https://codeponents.pages.dev/r/v1/{name}.json
```

Find available components and add the ones the project needs:

```sh
npx shadcn@latest list @codeponents
npx shadcn@latest add @codeponents/button
```

Replace `button` with the registry component name. The CLI copies editable source files and installs declared dependencies. Import the shared theme once in the app's global stylesheet:

```css
@import "tailwindcss";
@import "@/components/ui/codeponents-theme.css";
```

Check the project's `components.json` aliases if the theme path differs. Keep the shared utility and hooks installed by the registry in place unless their imports are updated too.

## Connect the MCP

Add this remote HTTP server to an MCP-compatible assistant:

```json
{
  "mcpServers": {
    "codeponents": {
      "type": "http",
      "url": "https://codeponents.pages.dev/mcp"
    }
  }
}
```

The server exposes the Codeponents skill, component search, component metadata and install commands, installation guidance, and design guidance. Use `list_components` to find matches, then `get_component` to inspect a component before recommending it. Call `get_design_guidance` when you need the current tokens and interaction standards. If an assistant supports MCP Skills, load this skill from its skills list.

## Compose with the library

- Search the registry before proposing a new component. Reuse and compose the closest available pieces.
- Keep component APIs small and useful across different app screens.
- Use the shared CSS variables instead of copying brand colors into component styles.
- Keep layouts responsive and controls usable by keyboard and assistive technology.
- Use Torph for short label or number feedback without changing the control's size. Respect reduced-motion preferences.
- Use content-shaped loading placeholders only when real content is waiting to load. Component gallery examples with local demo data should render directly.
- Keep interface copy short and specific. Avoid unnecessary badges, eyebrow labels, and repeated helper text.

## Current foundations

- Interface type: Source Sans 3 Variable, weights 400–700
- Heading type: Unna 700, with 400 and italic faces available
- Type roles: `text-code-display`, `text-code-page`, `text-code-section`, `text-code-group`, `text-code-body`, `text-code-ui`, and `text-code-meta`
- Theme stylesheet: `@/components/ui/codeponents-theme.css`
- Public registry: `https://codeponents.pages.dev/r/v1`
- MCP endpoint: `https://codeponents.pages.dev/mcp`
