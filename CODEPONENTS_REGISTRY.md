# Codeponents v1 registry

Codeponents ships source-owned React components through a versioned shadcn registry. Installed components remain editable in the consuming application.

## Local use

Start the gallery with `npm run dev`. The predev step builds the registry to `public/r/v1`.

In a React and Tailwind CSS 4 project with a shadcn `components.json` file, add the local registry:

```sh
npx shadcn@latest registry add @codeponents=http://localhost:5173/r/v1/{name}.json
npx shadcn@latest list @codeponents
npx shadcn@latest add @codeponents/button
```

## Public use

The v1 registry is hosted at `https://codeponents.pages.dev/r/v1`:

```sh
npx shadcn@latest registry add @codeponents=https://codeponents.pages.dev/r/v1/{name}.json
npx shadcn@latest list @codeponents
npx shadcn@latest add @codeponents/button
```

The Codeponents MCP endpoint is `https://codeponents.pages.dev/mcp`. It provides component lookup, install guidance, design guidance, and the Codeponents setup skill for compatible assistants.

After installing a component, import the theme once from the consuming app's global stylesheet:

```css
@import "tailwindcss";
@import "@/components/ui/codeponents-theme.css";
```

The shared registry item installs the theme, class utility, and reduced-motion hook. Component items describe their sibling components and npm dependencies. Tailwind CSS and React are prerequisites in the consuming project.

## Release path

The registry URL includes `v1`, so later releases can use a new versioned path without changing existing consumers. `npm run registry:build` regenerates `registry.json` from the gallery metadata and component sources, then writes the shadcn JSON files to `public/r/v1`.

The local endpoint is for development. The hosted v1 path stays stable while later releases can publish to a new versioned path.
