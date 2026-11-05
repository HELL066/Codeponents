import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import ts from "typescript"

const root = process.cwd()
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
const skillPath = join(root, "skills/codeponents/SKILL.md")
const skillOutputPath = join(root, "functions/codeponents-skill.ts")
const componentDirectory = join(root, "src/components/ui")
const libraryDataPath = join(root, "src/components/showcase/library-data.ts")
const libraryData = readFileSync(libraryDataPath, "utf8")
const sourceFile = ts.createSourceFile(
  libraryDataPath,
  libraryData,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
)

const definitionsDeclaration = sourceFile.statements
  .filter(ts.isVariableStatement)
  .flatMap((statement) => statement.declarationList.declarations)
  .find((declaration) => {
    return ts.isIdentifier(declaration.name) && declaration.name.text === "definitions"
  })

let definitionsExpression = definitionsDeclaration?.initializer
while (
  definitionsExpression &&
  (ts.isAsExpression(definitionsExpression) ||
    ts.isSatisfiesExpression(definitionsExpression) ||
    ts.isParenthesizedExpression(definitionsExpression))
) {
  definitionsExpression = definitionsExpression.expression
}

if (!definitionsExpression || !ts.isArrayLiteralExpression(definitionsExpression)) {
  throw new Error("Could not read the component definitions from library-data.ts")
}

const readString = (node) => {
  return node && ts.isStringLiteralLike(node) ? node.text : undefined
}

const definitions = definitionsExpression.elements
  .filter(ts.isArrayLiteralExpression)
  .map((tuple) => ({
    name: readString(tuple.elements[0]),
    title: readString(tuple.elements[1]),
    description: readString(tuple.elements[2]),
  }))
  .filter((entry) => entry.name && entry.title && entry.description)

const componentFiles = readdirSync(componentDirectory)
  .filter((file) => file.endsWith(".tsx") && file !== "index.tsx")
  .sort()
const sourceNames = new Set(componentFiles.map((file) => file.slice(0, -4)))
const components = definitions.filter((entry) => sourceNames.has(entry.name))
const definitionNames = new Set(components.map((entry) => entry.name))
const foundationNames = new Set(["colors", "type", "layout"])
const missingDefinitions = componentFiles
  .map((file) => file.slice(0, -4))
  .filter((name) => !definitionNames.has(name))
const missingSources = definitions
  .map((entry) => entry.name)
  .filter((name) => !foundationNames.has(name) && !sourceNames.has(name))

if (missingDefinitions.length || missingSources.length) {
  const details = [
    missingDefinitions.length ? `Missing gallery definitions: ${missingDefinitions.join(", ")}` : "",
    missingSources.length ? `Missing component sources: ${missingSources.join(", ")}` : "",
  ].filter(Boolean)
  throw new Error(details.join("\n"))
}

const dependencyVersions = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
}

function packageNameFor(specifier) {
  if (specifier.startsWith("@/")) return undefined
  const matches = Object.keys(dependencyVersions)
    .filter((name) => specifier === name || specifier.startsWith(`${name}/`))
    .sort((first, second) => second.length - first.length)
  return matches[0]
}

function packageAddress(name) {
  const version = dependencyVersions[name]
  return version ? `${name}@${version}` : name
}

function importSpecifiers(source) {
  return [...source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)]
    .map((match) => match[1])
}

function uiDependencies(specifiers, componentName) {
  return [...new Set(
    specifiers
      .map((specifier) => specifier.match(/^@\/components\/ui\/([a-z0-9-]+)$/)?.[1])
      .filter((name) => name && name !== componentName && sourceNames.has(name)),
  )].sort()
}

function packageDependencies(specifiers) {
  return [...new Set(
    specifiers
      .map(packageNameFor)
      .filter((name) => name && name !== "react" && name !== "react-dom"),
  )]
    .sort()
    .map(packageAddress)
}

const baseItem = {
  name: "codeponents-base",
  type: "registry:base",
  title: "Codeponents foundations",
  description: "CODE theme tokens, shared class utility, and reduced-motion support.",
  dependencies: [
    packageAddress("cn"),
    packageAddress("@fontsource-variable/source-sans-3"),
    packageAddress("@fontsource/unna"),
  ],
  files: [
    {
      path: "src/components/ui/codeponents-theme.css",
      type: "registry:style",
      target: "@ui/codeponents-theme.css",
    },
    {
      path: "src/lib/utils.ts",
      type: "registry:lib",
      target: "@lib/utils.ts",
    },
    {
      path: "src/hooks/use-prefers-reduced-motion.ts",
      type: "registry:hook",
      target: "@hooks/use-prefers-reduced-motion.ts",
    },
  ],
}

const componentItems = components.map((entry) => {
  const sourcePath = join(componentDirectory, `${entry.name}.tsx`)
  const source = readFileSync(sourcePath, "utf8")
  const specifiers = importSpecifiers(source)
  const siblingFiles = [...new Set(
    specifiers
      .filter((specifier) => specifier.startsWith("./") && specifier.endsWith(".css"))
      .map((specifier) => resolve(dirname(sourcePath), specifier))
      .filter(existsSync),
  )]

  return {
    name: entry.name,
    type: "registry:ui",
    title: entry.title,
    description: entry.description.replace(/\.$/, ""),
    registryDependencies: [
      "./codeponents-base.json",
      ...uiDependencies(specifiers, entry.name).map((name) => `./${name}.json`),
    ],
    dependencies: packageDependencies(specifiers),
    files: [
      {
        path: `src/components/ui/${entry.name}.tsx`,
        type: "registry:ui",
        target: `@ui/${entry.name}.tsx`,
      },
      ...siblingFiles.map((file) => ({
        path: file.slice(root.length + 1),
        type: "registry:style",
        target: `@ui/${file.split("/").at(-1)}`,
      })),
    ],
  }
})

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "codeponents",
  homepage: "https://ateneocode.org",
  items: [baseItem, ...componentItems],
}

writeFileSync(join(root, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`)
const skillSource = readFileSync(skillPath, "utf8")
writeFileSync(
  skillOutputPath,
  `// Generated from skills/codeponents/SKILL.md by npm run prepare:registry.\nexport default ${JSON.stringify(skillSource)}\n`
)
console.log(
  `Prepared Codeponents v1 registry with ${componentItems.length} UI items and embedded the MCP skill.`
)
