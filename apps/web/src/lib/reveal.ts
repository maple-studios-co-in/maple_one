// Shared "the preloader has lifted" signal, kept out of the Preloader component
// file so React Fast Refresh stays happy (component files must only export
// components). The Preloader fires it; sections like Hero gate their intro on it.

export const REVEAL_EVENT = 'maple:reveal'

let revealed = false

/** True once the preloader has lifted and dispatched REVEAL_EVENT. */
export function hasRevealed() {
  return revealed
}

/** Called by the preloader when it finishes; idempotent. */
export function fireReveal() {
  if (revealed) return
  revealed = true
  window.dispatchEvent(new Event(REVEAL_EVENT))
}
