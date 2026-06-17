import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Preloader from './components/Preloader'
import SiteChrome from './components/SiteChrome'
import Canvas3D from './experience/Canvas3D'
import Page from './pages/Page'
import { useSiteConfig } from './site/useSiteConfig'
import { initSmoothScroll, ScrollTrigger } from './lib/scroll'

function App() {
  const { config, loading } = useSiteConfig()

  useEffect(() => {
    initSmoothScroll()
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  return (
    <BrowserRouter>
      <Preloader />
      <Canvas3D />
      <SiteChrome />
      {/* Render once the config has resolved (fast, timeout-bounded) so sections
          mount a single time with their final content — the preloader covers it. */}
      {!loading && (
        <Routes>
          <Route path="/" element={<Page config={config} />} />
          <Route path="/:slug" element={<Page config={config} />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
