import { useEffect } from 'react'
import Career from './components/Career.tsx'
import Credentials from './components/Credentials.tsx'
import Hero from './components/Hero.tsx'
import LabSection from './components/lab/LabSection.tsx'
import Projects from './components/Projects.tsx'
import SiteFooter from './components/SiteFooter.tsx'
import SiteHeader from './components/SiteHeader.tsx'
import Skills from './components/Skills.tsx'
import { setupReveal } from './motion/reveal.ts'

function App() {
  useEffect(() => setupReveal(), [])

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Projects />
        <LabSection />
        <Career />
        <Skills />
        <Credentials />
      </main>
      <SiteFooter />
    </>
  )
}

export default App
