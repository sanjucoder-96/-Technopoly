import type { Game, GameEvent } from './types'

let eidCounter = 0
export const nextEventId = (): string => `e-${Date.now().toString(36)}-${(eidCounter++).toString(36)}`

// timerElapsedMs is duplicated here (small) to avoid a circular import
// between engine.ts and questionEngine.ts (both need to log).
function elapsed(g: Game): number {
  const t = g.timer
  return t.elapsedMs + (t.running && t.startedAtMs != null ? Date.now() - t.startedAtMs : 0)
}

export function logEvent(g: Game, e: Omit<GameEvent, 'id' | 'ts' | 'gameTimeMs'>): GameEvent {
  const ev: GameEvent = {
    id: nextEventId(),
    ts: Date.now(),
    gameTimeMs: elapsed(g),
    ...e
  }
  g.events.push(ev)
  return ev
}
