# Codeponents

Codeponents is a reusable React component library for Ateneo CODE (Ateneo Consultants for Organization Development and Empowerment). Browse the gallery, preview component behavior, and install source files into your own app. The installed files stay editable in your project.

[Open the component gallery](https://codeponents.pages.dev) · [Read the registry guide](./CODEPONENTS_REGISTRY.md) · [Connect the MCP server](https://codeponents.pages.dev/mcp)

## Components

The library covers common interface needs, including actions, forms, navigation, dialogs, calendars, date and time controls, data displays, charts, feedback, and layout. Gallery examples use fictional workspace content. Component APIs are general purpose.

The project targets WCAG 2.2 AA. Its interaction standards cover keyboard support, visible focus, responsive layouts, and reduced-motion handling where relevant. See [DESIGN.md](./DESIGN.md) for the interface standards and theme tokens.

## Install a component

Use a React and TypeScript app with Tailwind CSS 4 and the shadcn CLI. If the app does not have a `components.json` file yet, initialize shadcn in the app directory with `npx shadcn@latest init`.

Add the Codeponents registry once, then install the components you need:

```sh
npx shadcn@latest registry add @codeponents=https://codeponents.pages.dev/r/v1/{name}.json
npx shadcn@latest add @codeponents/button
```

Run `npx shadcn@latest list @codeponents` to see the available registry items. Replace `button` with the component name you want. The gallery's **Add components** flow builds the install command. Open the Usage tab to see a code example.

The CLI copies component source into your app and installs the npm dependencies declared by each registry item. Components can include the shared Codeponents foundation, which provides the theme stylesheet, class utility, and reduced-motion hook.

Load Tailwind CSS in your global stylesheet before the Codeponents theme. If Tailwind is not already imported there, add `@import "tailwindcss";` before this line:

```css
@import "@/components/ui/codeponents-theme.css";
```

The import alias depends on your `components.json` setup. See [CODEPONENTS_REGISTRY.md](./CODEPONENTS_REGISTRY.md) for local registry use and versioning details.

## MCP server

An MCP-compatible assistant can connect to the remote HTTP server at `https://codeponents.pages.dev/mcp`. It supports component search with `list_components`, component details with `get_component`, setup instructions with `get_installation_guide`, and design guidance with `get_design_guidance`. The Codeponents setup skill is also available through the server. It provides public component metadata and setup guidance; it has no application data tools.

## Run the gallery locally

Use Node.js 22.14 or newer and npm. Install dependencies and start the development server:

```sh
npm ci
npm run dev
```

The `predev` script builds the shadcn registry in `public/r/v1` before Vite starts. The registry output is generated and is not committed.

## Project commands

| Command | Purpose |
| --- | --- |
| `npm run check` | Run formatting checks, ESLint, TypeScript checks, Vitest, and a production build. |
| `npm test` | Run the component tests once. |
| `npm run test:watch` | Run Vitest in watch mode while developing. |
| `npm run format` | Format TypeScript and TSX files. |
| `npm run format:check` | Check TypeScript and TSX formatting. |
| `npm run registry:build` | Generate the shadcn registry files in `public/r/v1`. |
| `npm run build` | Build the registry and production site. |
| `npm run preview` | Preview the most recent production build locally. |

GitHub Actions runs lint, type checking, component tests, build, and dependency review on pull requests. The required check is named `verify`. Pushes to `main` deploy the built site to Cloudflare Pages after verification. CodeQL and Dependabot are enabled for repository security and dependency updates. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the pull request process.

## Repository layout

- `src/components/ui/` contains the reusable React components and shared theme.
- `src/components/showcase/` contains the searchable gallery, previews, and usage examples.
- `src/hooks/` contains shared interaction hooks.
- `registry.json` and `scripts/prepare-registry.mjs` define and prepare registry metadata.
- `functions/` contains the Cloudflare Pages MCP endpoint.
- `skills/codeponents/SKILL.md` contains the assistant setup and component-use guide.

Additional project references:

- [Registry setup and release path](./CODEPONENTS_REGISTRY.md)
- [Design system and accessibility standards](./DESIGN.md)
- [Third-party dependencies and fallbacks](./THIRD_PARTY.md)
- [Product scope](./PRODUCT.md)
- [Contributing guide](./CONTRIBUTING.md)

## License

This repository does not currently include a license file. Contact the Ateneo CODE maintainers for reuse and redistribution terms.
