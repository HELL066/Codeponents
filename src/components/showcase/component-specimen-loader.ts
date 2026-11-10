let componentSpecimens:
  Promise<typeof import("./component-specimens")> | undefined

export function loadComponentSpecimens() {
  return (componentSpecimens ??= import("./component-specimens"))
}
