# Contributing

## Set up locally

Use Node.js 22.14 or newer and npm:

```sh
npm ci
npm run dev
```

## Before opening a pull request

Run the local quality gates before opening a pull request:

```sh
npm run check
```

`npm run check` runs formatting, lint, TypeScript checks, component tests, and a
production build. GitHub Actions also reviews dependency changes on pull
requests and runs CodeQL analysis. Use `npm test` for a single test run or
`npm run test:watch` while developing. Run `npm run format` to apply formatting.
Add or update tests when a change affects component behavior. Keep pull requests
focused, describe user-visible changes, and include screenshots for visual
changes.

## Merge requirements

Pull requests target `main`. Keep the branch up to date with `main` and wait for
the required `verify` check to pass. Merge with **Squash and merge** after
GitHub reports the pull request as mergeable and all review threads are
resolved.
