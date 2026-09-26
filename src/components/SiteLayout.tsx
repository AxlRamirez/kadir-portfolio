import { useEffect, type ReactNode } from 'react'
import type { SiteText } from '../i18n/types.ts'
import { setupReveal } from '../motion/reveal.ts'
import { sectionAnchors, type PageId } from '../routes.ts'
import Hero from './Hero.tsx'
import { SiteContext } from './siteContext.ts'
import SiteFooter from './SiteFooter.tsx'
import SiteHeader from './SiteHeader.tsx'

type SiteLayoutProps = { page: PageId; text: SiteText; children: ReactNode }

/** Estructura común de las páginas: cabecera, portada, el contenido propio de cada una y pie. */
function SiteLayout({ page, text, children }: SiteLayoutProps) {
  useEffect(() => setupReveal(), [])
  const contentId = sectionAnchors.content[text.locale]

  return (
    <SiteContext value={{ page, text }}>
      <a className="skip-link" href={`#${contentId}`}>
        {text.skipLink}
      </a>
      <SiteHeader />
      <main id={contentId}>
        <Hero />
        {children}
      </main>
      <SiteFooter />
    </SiteContext>
  )
}

export default SiteLayout
