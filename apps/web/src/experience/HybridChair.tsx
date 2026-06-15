import * as THREE from 'three'
import RealChair from './RealChair'
import StudioChair from './StudioChair'

interface HybridChairProps {
  getProgress: () => number
  mode: 'build' | 'parts'
  scale?: number
}

/** Height (local units) the real scan is matched to so it lines up with the
 *  authored chair at the crossfade. */
const REAL_HEIGHT = 1.42
/** Progress at which the authored parts begin dissolving into the real scan. */
const FADE_START = 0.86

/**
 * Hybrid chair: the authored, well-defined parts perform the build / assemble
 * animation across the scroll; in the last stretch they cross-fade into the
 * real photoreal scan, so the piece *rests* as the real chair but *moves* as
 * clean parts. Scrolling back up reverses the fade and disassembles.
 */
export default function HybridChair({ getProgress, mode, scale = 1 }: HybridChairProps) {
  const fade = () => THREE.MathUtils.smoothstep(getProgress(), FADE_START, 1)
  return (
    <group scale={scale}>
      <StudioChair mode={mode} getProgress={getProgress} getOpacity={() => 1 - fade()} />
      <RealChair getOpacity={fade} targetHeight={REAL_HEIGHT} />
    </group>
  )
}
