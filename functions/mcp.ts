import { McpServer } from "@modelcontextprotocol/server"
import {
  memorySkillFiles,
  SkillsExtension,
} from "@modelcontextprotocol/server/ext/skills"
import { createMcpHandler } from "agents/mcp/server"
import { z } from "zod"
import codeponentsSkill from "./codeponents-skill"
import registry from "../registry.json"

const registryBase = "https://codeponents.pages.dev/r/v1"

type RegistryItem = {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
}

const registryItems = (registry as { items: RegistryItem[] }).items
const components = registryItems.filter((item) => item.type === "registry:ui")

const installationGuide = codeponentsSkill
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
  .trim()

const skills = SkillsExtension.load(
  memorySkillFiles({ "codeponents/SKILL.md": codeponentsSkill })
)

const designGuidance = {
  product: {
    name: "Codeponents",
    purpose:
      "A reusable React component library made for the Ateneo CODE organization. Build general app interfaces from shared components that teams can edit in their own projects.",
  },
  brand: {
    logo: {
      asset: "public/code-falcon-white.png",
      usage:
        "Use the provided Ateneo CODE asset on a dark surface. Do not redraw, approximate, or recolor the logo.",
    },
    typography: {
      interface: "Source Sans 3 Variable",
      display: "Unna",
    },
    light: {
      canvas: "#f5f5f6",
      surface: "#ffffff",
      ink: "#121315",
      muted: "#3d5266",
      quiet: "#d7dfe9",
      line: "#aaafb5",
      input: "#717d89",
      accent: "#0c315c",
      focus: "#4986ac",
      hero: "#06192f",
      danger: "#a33f4b",
      positive: "#216d55",
      warning: "#8c5e23",
    },
    dark: {
      canvas: "#0b1119",
      surface: "#131d28",
      surfaceRaised: "#1a2734",
      ink: "#f1f4f7",
      muted: "#a6b3c0",
      quiet: "#202d3a",
      line: "#384858",
      input: "#53687b",
      accent: "#85b6d0",
      focus: "#9ac9e0",
      hero: "#071b30",
      danger: "#e58f99",
      positive: "#8ac9a8",
      warning: "#e3ba78",
    },
    tokenRule:
      "These values are defined in the current CODE theme. Consume the --code-* CSS variables instead of duplicating color literals in components.",
  },
  componentPractice: [
    "Search the existing Codeponents registry before adding a component, then compose the closest existing primitives.",
    "Use list_components to find candidates and get_component to inspect installation metadata.",
    "Keep APIs small and reusable across app screens; avoid one-off domain components unless the product requirement calls for them.",
  ],
  interaction: {
    accessibility: [
      "Use semantic elements and accessible names for controls.",
      "Support keyboard operation and a clear visible focus state.",
      "Keep contrast readable and never communicate state through color alone.",
      "Announce meaningful asynchronous status changes to assistive technology.",
    ],
    motion: [
      "Use Torph for short text or number changes such as Save to Saved; reserve the widest label so feedback never shifts layout, then return to the original label after a brief confirmation.",
      "Use the existing Motion package for purposeful transitions, not decoration that competes with the task.",
      "Honor prefers-reduced-motion by removing or simplifying nonessential movement.",
    ],
    loading:
      "Use content-shaped loading placeholders only while real content is loading. Match their geometry to the final content and honor reduced motion; local gallery examples with ready demo data should render directly.",
    copy: "Keep interface copy short, task-first, and specific. Avoid eyebrow labels, repeated helper statements, decorative arrow chains, and badges that add no information.",
  },
  privacy: [
    "This MCP server exposes public component metadata and design guidance only; it has no application data tools.",
    "Never request credentials or expose private account data.",
    "When a screen needs data, use clearly synthetic examples unless the user supplies approved content.",
  ],
  availableComponents: components.map((item) => item.name),
} as const

const designGuidanceText = JSON.stringify(designGuidance, null, 2)

function componentDetails(item: RegistryItem) {
  const registryUrl = `${registryBase}/${item.name}.json`

  return {
    name: item.name,
    title: item.title ?? item.name,
    description: item.description ?? "",
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    registryUrl,
    installCommand: `npx shadcn@latest add ${registryUrl}`,
  }
}

async function createServer() {
  const server = new McpServer({
    name: "Codeponents",
    version: "1.0.0",
  })
  const skillCatalog = await skills
  skillCatalog.attach(server)

  server.registerTool(
    "get_design_guidance",
    {
      description:
        "Read Codeponents theme tokens and standards for component reuse, accessibility, motion, loading, and privacy.",
      inputSchema: z.object({}),
    },
    async () => ({
      content: [{ type: "text", text: designGuidanceText }],
    })
  )

  server.registerTool(
    "get_installation_guide",
    {
      description:
        "Get setup instructions for installing Codeponents components or connecting the Codeponents MCP.",
      inputSchema: z.object({}),
    },
    async () => ({
      content: [{ type: "text", text: installationGuide }],
    })
  )

  server.registerTool(
    "list_components",
    {
      description:
        "List Codeponents UI components. Optionally filter by name, title, or description.",
      inputSchema: {
        query: z.string().trim().optional().describe("Optional search text"),
      },
    },
    async ({ query }) => {
      const normalizedQuery = query?.toLocaleLowerCase()
      const matches = components
        .filter((item) => {
          if (!normalizedQuery) return true
          return [item.name, item.title, item.description]
            .filter(Boolean)
            .some((value) =>
              value!.toLocaleLowerCase().includes(normalizedQuery)
            )
        })
        .map(componentDetails)

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              count: matches.length,
              components: matches,
            }),
          },
        ],
      }
    }
  )

  server.registerTool(
    "get_component",
    {
      description:
        "Get a Codeponents component's description, dependencies, registry URL, and install command.",
      inputSchema: {
        name: z.string().trim().min(1).describe("Registry component name"),
      },
    },
    async ({ name }) => {
      const item = components.find(
        (candidate) =>
          candidate.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      )

      if (!item) {
        return {
          content: [
            { type: "text", text: `No Codeponents component named "${name}".` },
          ],
          isError: true,
        }
      }

      return {
        content: [
          { type: "text", text: JSON.stringify(componentDetails(item)) },
        ],
      }
    }
  )

  server.registerPrompt(
    "design_app_screen",
    {
      title: "Design a screen with Codeponents",
      description:
        "Plan a polished, accessible app screen using Codeponents components and theme tokens.",
      argsSchema: z.object({
        screen: z
          .string()
          .trim()
          .optional()
          .describe(
            "Screen to design, such as calendar, profile, or workspace"
          ),
        goal: z
          .string()
          .trim()
          .optional()
          .describe("The user's task or outcome for this screen"),
      }),
    },
    ({ screen, goal }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Design a professional, modern app screen using Codeponents.",
              screen
                ? `Screen: ${screen}`
                : "Choose the screen from the user's request.",
              goal
                ? `User goal: ${goal}`
                : "Clarify the primary user task from the supplied context.",
              "First call get_design_guidance and search list_components. Inspect relevant components with get_component before proposing new UI.",
              "Use Codeponents theme tokens. Use the official Ateneo CODE logo asset only when the screen is branded for CODE; do not recreate it. Keep the interface concise, well spaced, and visually distinctive without badge clutter or excessive borders.",
              "Use semantic HTML, keyboard support, visible focus, readable contrast, accessible status updates, and reduced-motion behavior.",
              "Use Torph for brief text or number feedback without layout shifts, Motion for purposeful transitions, and Skullet for content-shaped loading states.",
              "Do not infer or expose private account data; use synthetic examples when real content has not been supplied.",
              "Return the screen structure, component reuse plan, key interaction states, responsive behavior, and any genuinely missing reusable component.",
            ].join("\n\n"),
          },
        },
      ],
    })
  )

  return server
}

const handler = createMcpHandler(createServer, {
  route: "/mcp",
  allowedHostnames: ["codeponents.pages.dev", "localhost", "127.0.0.1"],
  allowedOriginHostnames: ["codeponents.pages.dev", "localhost", "127.0.0.1"],
})

type PagesContext = {
  request: Request
  env: unknown
  waitUntil: (promise: Promise<unknown>) => void
  passThroughOnException: () => void
}

export function onRequest(context: PagesContext) {
  return handler(
    context.request,
    context.env,
    context as Parameters<typeof handler>[2]
  )
}
