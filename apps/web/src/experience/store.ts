import { create } from 'zustand'

export type SceneName = 'assembly' | 'anatomy' | 'turntable' | 'sofa' | 'table' | 'chair-hero' | null

interface ExperienceState {
  /** Which 3D scene should currently render behind the DOM */
  activeScene: SceneName
  /** 0 → raw timber blocks, 1 → finished assembled chair (Craft build sequence) */
  assemblyProgress: number
  /** 0 → parts exploded, 1 → parts assembled (Anatomy section) */
  anatomyProgress: number
  /** 0..1 across the collection section (drives turntable rotation/crossfade) */
  turntableProgress: number
  /** 0..1 spin progress for a single-product 360 turntable (sofa/table) */
  spinProgress: number
  setActiveScene: (scene: SceneName) => void
  setAssemblyProgress: (v: number) => void
  setAnatomyProgress: (v: number) => void
  setTurntableProgress: (v: number) => void
  setSpinProgress: (v: number) => void
}

/**
 * Scroll progress is written here by GSAP ScrollTriggers and read inside
 * R3F useFrame loops via useExperience.getState() — no React re-renders
 * on the hot path.
 */
export const useExperience = create<ExperienceState>((set) => ({
  activeScene: null,
  assemblyProgress: 0,
  anatomyProgress: 0,
  turntableProgress: 0,
  spinProgress: 0,
  setActiveScene: (activeScene) => set({ activeScene }),
  setAssemblyProgress: (assemblyProgress) => set({ assemblyProgress }),
  setAnatomyProgress: (anatomyProgress) => set({ anatomyProgress }),
  setTurntableProgress: (turntableProgress) => set({ turntableProgress }),
  setSpinProgress: (spinProgress) => set({ spinProgress }),
}))
