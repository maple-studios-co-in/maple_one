import { useEffect } from 'react'
import Preloader from './components/Preloader'
import Hero from './components/Hero'
import SiteChrome from './components/SiteChrome'
import Canvas3D from './experience/Canvas3D'
import Anatomy from './sections/Anatomy'
import Collection from './sections/Collection'
import Ethos from './sections/Ethos'
import Craft from './sections/Craft'
import Materials from './sections/Materials'
import Process from './sections/Process'
import Sofa from './sections/Sofa'
import Table from './sections/Table'
import Visit from './sections/Visit'
import { initSmoothScroll, ScrollTrigger } from './lib/scroll'

function App() {
  useEffect(() => {
    initSmoothScroll()
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <>
      <Preloader />
      <Canvas3D />
      <SiteChrome />
      <main id="top" className="relative z-10 min-h-screen">
        <Hero />
        <Ethos />
        <Craft />
        <Anatomy />
        <Materials />
        <Collection />
        <Sofa />
        <Table />
        <Process />
        <Visit />
      </main>
    </>
  )
}

export default App
