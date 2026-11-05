# Codeponents

Codeponents is a reusable component library made for the Ateneo CODE organization (Ateneo Consultants for Organization Development and Empowerment). It gives CODE projects a shared set of interface components.

The gallery shows each component in fictional workspace examples. The components are general purpose and can be edited after installation.

## Included

- A searchable gallery with interactive previews
- Reusable React components with responsive and keyboard-friendly states
- CODE color tokens, Source Sans 3 for interface text, and Unna for headings
- A versioned shadcn registry that copies source files into your project
- Motion and Torph transitions, Skullet loading patterns, and an optional shader canvas

## Install a component

Codeponents works with React, Tailwind CSS 4, and the shadcn CLI. Add the registry to your project once, then install the components you need:

```sh
npx shadcn@latest registry add @codeponents=https://codeponents.pages.dev/r/v1/{name}.json
npx shadcn@latest add @codeponents/button
```

The registry installs each component's source and its listed dependencies. The files stay in your project, ready for you to edit.

Add the theme import to your global stylesheet:

```css
@import "@/components/ui/codeponents-theme.css";
```

Change `button` in the install command to the component name you want. The gallery's **Add components** flow builds the command for you. For local setup and registry details, see [Codeponents registry](./CODEPONENTS_REGISTRY.md).

## Run locally

```sh
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run lint` to check the code.

## Project files

- `src/components/ui/` contains the reusable React components.
- `src/components/ui/index.ts` exports the components from one place.
- `src/components/ui/codeponents-theme.css` defines the shared colors and fonts.
- `src/components/showcase/` contains the searchable gallery and examples.
- `src/hooks/` contains shared interaction hooks.
- `src/tokens.css` and `src/index.css` style the gallery.

The current CODE interface uses navy `#06192f`, blue `#0c315c`, canvas `#f5f5f6`, muted text `#3d5266`, and focus ring `#4986ac`. The official falcon asset is at `public/code-falcon-white.png`.

See [THIRD_PARTY.md](./THIRD_PARTY.md) for component dependencies and fallback behavior. [DESIGN.md](./DESIGN.md) documents the type, color, motion, and accessibility choices.

## MCP

Connect an assistant to `https://codeponents.pages.dev/mcp` to search components, get install commands, and load the Codeponents setup skill.
