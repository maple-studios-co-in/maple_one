import type { ComponentType } from 'react'
import type { BlockProps } from './types'
import Hero from '../components/Hero'
import Ethos from '../sections/Ethos'
import Craft from '../sections/Craft'
import Anatomy from '../sections/Anatomy'
import Materials from '../sections/Materials'
import Collection from '../sections/Collection'
import Sofa from '../sections/Sofa'
import Table from '../sections/Table'
import Process from '../sections/Process'
import Visit from '../sections/Visit'

export type { BlockProps }

/**
 * Maps a CMS block `type` to the section component that renders it. Sections
 * that expose editable copy read it from `data` (heading/body); the rest ignore
 * the prop. Unknown types render nothing.
 */
export const BLOCK_REGISTRY: Record<string, ComponentType<BlockProps>> = {
  hero: Hero,
  ethos: Ethos,
  craft: Craft,
  anatomy: Anatomy,
  materials: Materials,
  collection: Collection,
  sofa: Sofa,
  table: Table,
  process: Process,
  visit: Visit,
}
