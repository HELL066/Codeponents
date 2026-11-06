# Contributing

## Set up locally

Use Node.js 22.14 or newer and npm:

```sh
npm ci
npm run dev
```

## Before opening a pull request

Run the same quality gates used by GitHub Actions:

```sh
npm run check
```

`npm run check` runs lint, TypeScript checks, component tests, and a production
build. Use `npm test` for a single test run or `npm run test:watch` while
developing. Add or update tests when a change affects component behavior. Keep
pull requests focused, describe user-visible changes, and include screenshots
for visual changes.

## Merge requirements

Pull requests target `main`. Merge only when GitHub reports the branch as
mergeable and all required checks pass. Use the merge queue to validate each
change against the latest `main` before it lands.
