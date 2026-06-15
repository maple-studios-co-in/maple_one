import type { ReactNode } from 'react'

/**
 * Reusable scroll-scrub showcase config.
 *
 * The <ScrollScrubShowcase> component is fully driven by this object, so a new
 * piece — or an entirely different website — is just a new config: swap the
 * video, copy, theme colours and a few motion numbers. No component edits.
 */

export interface ShowcaseStep {
  num: string
  title: string
  copy: string
}

export interface ScrubShowcaseTheme {
  /** CSS background for the section (solid colour or gradient). */
  background: string
  /** Primary ink colour for text. */
  ink: string
  /** Muted ink for labels/eyebrows; defaults to `ink` at reduced opacity. */
  inkMuted?: string
  /** Accent colour for the progress fill, rails and dividers. */
  accent: string
}

export interface ScrubShowcaseClip {
  /** Width of the floated video column (e.g. '58%'). Omit to use the responsive default. */
  width?: string
  /** CSS mask-image used to feather the clip into the page. */
  mask?: string
  /** object-position of the video within its column. */
  objectPosition?: string
  /** Subtle scale across the scroll, [from, to]. Defaults to [0.93, 1]. */
  zoom?: [number, number]
  /** Which side the clip floats on. Defaults to 'right'. */
  side?: 'left' | 'right'
}

/**
 * Media driven by the scroll. Either an all-intra video scrubbed by time, or a
 * wide image panned horizontally (object-position) — the "long view" treatment.
 */
export type ScrubShowcaseMedia =
  | { kind: 'video'; src: string; poster?: string }
  | { kind: 'image-pan'; src: string; alt?: string; panFrom?: number; panTo?: number }

export interface ScrubShowcaseConfig {
  /** Section id / anchor. */
  id: string
  eyebrow: string
  /** Headline — string or JSX (use <br/> for line breaks). */
  title: ReactNode
  scrollCue?: string
  /** Preferred: any media kind. */
  media?: ScrubShowcaseMedia
  /** Back-compat shorthand for a video clip (equivalent to media:{kind:'video',…}). */
  video?: { src: string; poster?: string }
  theme: ScrubShowcaseTheme
  /** Optional live "assembly meter" (start/end labels + unit for the % readout). */
  meter?: { startLabel: string; endLabel: string; unitLabel: string }
  /** Optional step legend that highlights as the clip progresses. */
  steps?: ShowcaseStep[]
  /** Progress thresholds (0–1) that switch the active step; length = steps.length − 1. */
  stepThresholds?: number[]
  /** Pinned scroll length per breakpoint. Defaults to desktop '+=440%', mobile '+=260%'. */
  pin?: { desktop?: string; mobile?: string }
  clip?: ScrubShowcaseClip
}
