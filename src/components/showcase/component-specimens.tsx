import {
  renderGeneralSpecimen,
  getGeneralSnippet,
} from "./general-specimens"
import {
  AdvancedSpecimen,
  advancedEntryIds,
  getAdvancedSnippet,
} from "./advanced-specimens"
import { FoundationSpecimen, getFoundationSnippet } from "./foundation-specimens"
import {
  PatternSpecimen,
  getPatternSnippet,
  patternEntryIds,
} from "./pattern-specimens"

export function ComponentSpecimen({
  entryId,
  onNavigate,
}: {
  entryId: string
  onNavigate: (id: string) => void
}) {
  const general = renderGeneralSpecimen(entryId, onNavigate)
  if (general) return general
  if (["colors", "type", "layout"].includes(entryId)) {
    return <FoundationSpecimen entryId={entryId} />
  }
  if (patternEntryIds.has(entryId)) {
    return <PatternSpecimen entryId={entryId} />
  }
  if (advancedEntryIds.has(entryId)) {
    return <AdvancedSpecimen entryId={entryId} onNavigate={onNavigate} />
  }

  return <p>Preview unavailable.</p>
}

export function getComponentSnippet(entryId: string) {
  return (
    getGeneralSnippet(entryId) ||
    getPatternSnippet(entryId) ||
    getAdvancedSnippet(entryId) ||
    getFoundationSnippet(entryId)
  )
}
