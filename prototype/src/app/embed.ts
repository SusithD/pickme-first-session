import { SCENE_NAMES } from './scenes'
import type { SceneName } from './scenes'

export interface EmbedRequest {
  embed: boolean
  scene: SceneName
}

function isSceneName(value: string | null): value is SceneName {
  return value !== null && (SCENE_NAMES as readonly string[]).includes(value)
}

function readParams(): URLSearchParams[] {
  const hashQuery = window.location.hash.split('?')[1] ?? ''
  return [new URLSearchParams(window.location.search), new URLSearchParams(hashQuery)]
}

export function readEmbedRequest(): EmbedRequest {
  const sources = readParams()
  const embed = sources.some((params) => params.get('embed') === '1')
  const requested = sources.map((params) => params.get('scene')).find((value) => value !== null)
  return { embed, scene: isSceneName(requested ?? null) ? (requested as SceneName) : 'intro' }
}
