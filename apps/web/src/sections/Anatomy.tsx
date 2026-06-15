import { chairShowcase } from '../content/showcases'
import ScrollScrubShowcase from '../showcase/ScrollScrubShowcase'

/**
 * "Apart, then whole" — now just the chair's config rendered through the
 * reusable showcase component. Behaviour and look are unchanged; the section is
 * one line of content away from being any other piece (or any other site).
 */
export default function Anatomy() {
  return <ScrollScrubShowcase config={chairShowcase} />
}
