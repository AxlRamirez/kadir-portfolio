import { StrictMode, type ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import { home as enHome } from './i18n/en/home.ts'
import { services as enServices } from './i18n/en/services.ts'
import { site as enSite } from './i18n/en/site.ts'
import { home as esHome } from './i18n/es/home.ts'
import { services as esServices } from './i18n/es/services.ts'
import { site as esSite } from './i18n/es/site.ts'
import HomePage from './pages/HomePage.tsx'
import ServicesPage from './pages/ServicesPage.tsx'
import type { Locale, PageId, Route } from './routes.ts'

export { routes } from './routes.ts'

const site = { es: esSite, en: enSite }

// Lo mismo que monta cada entrada de src/entries en el navegador.
const pages: Record<PageId, (locale: Locale) => ReactElement> = {
  home: (locale) => <HomePage site={site[locale]} text={{ es: esHome, en: enHome }[locale]} />,
  services: (locale) => <ServicesPage site={site[locale]} text={{ es: esServices, en: enServices }[locale]} />,
}

export function render({ locale, page }: Route): string {
  return renderToString(<StrictMode>{pages[page](locale)}</StrictMode>)
}
