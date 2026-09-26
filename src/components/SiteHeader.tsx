import { useEffect, useState } from 'react'
import type { NavSection } from '../i18n/types.ts'
import { pagePaths, sectionAnchors, sectionHref, type Locale, type PageId } from '../routes.ts'
import LanguageSwitch from './LanguageSwitch.tsx'
import { formatDate, useSite } from './siteContext.ts'
import './SiteHeader.css'

const UPDATED = '2026-09-26'

const navSections: NavSection[] = ['projects', 'career', 'skills', 'education', 'services', 'contact']

// Solo se marcan las secciones de la página actual. El contacto es un bloque dentro de la portada, no una
// sección propia: no se marca como sección activa.
function trackedIdsFor(locale: Locale, page: PageId) {
  return navSections.filter((section) => sectionAnchors[section].page === page).map((section) => sectionAnchors[section][locale])
}

function useActiveSection(locale: Locale, page: PageId): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const sections = trackedIdsFor(locale, page)
      .map((id) => document.getElementById(id))
      .filter((section) => section !== null)
    // La banda de detección es la franja central de la pantalla: una sección está activa mientras la cruza.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
          else setActive((current) => (current === entry.target.id ? null : current))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [locale, page])

  return active
}

function SiteHeader() {
  const { page, text } = useSite()
  const { locale } = text
  const active = useActiveSection(locale, page)

  return (
    <header className="site-header theme-dark">
      <div className="container site-header-inner">
        {/* La fecha acompaña a la marca pero no forma parte del enlace: el nombre del enlace dice adónde lleva.
            En inicio sube al principio sin recargar; en Servicios lleva a la página de inicio del mismo idioma. */}
        <div className="brand">
          <a className="brand-link" href={page === 'home' ? '#top' : pagePaths[locale].home}>
            <span className="brand-mark" aria-hidden="true">
              KR
            </span>
            <span className="visually-hidden">{text.header.homeLabel}</span>
          </a>
          <p className="brand-note">
            {text.header.updatedPrefix} <time dateTime={UPDATED}>{formatDate(UPDATED, text.formatLocale, 'long')}</time>
          </p>
        </div>
        <nav className="site-nav-region" aria-label={text.header.navLabel}>
          <ul className="site-nav" role="list">
            {navSections.map((section) => (
              <li key={section}>
                <a
                  href={sectionHref(locale, page, section)}
                  aria-current={active === sectionAnchors[section][locale] ? 'true' : undefined}
                >
                  {text.header.nav[section]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitch />
      </div>
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  )
}

export default SiteHeader
