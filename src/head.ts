import { meta as enMeta } from './i18n/en/meta.ts'
import { meta as esMeta } from './i18n/es/meta.ts'
import { locales, pagePaths, type Locale, type Route } from './routes.ts'

export type HeadTag = { tag: 'title' | 'meta' | 'link'; attrs?: Record<string, string>; text?: string }

const meta = { es: esMeta, en: enMeta }

/** Idioma de las rutas sin prefijo: es el que se ofrece a quien no coincide con ninguno (x-default). */
export const DEFAULT_LOCALE: Locale = 'es'

/**
 * Título, descripción y enlaces a la misma página en cada idioma. Sin `siteUrl` los enlaces son relativos a
 * la raíz y no hay URL canónica: el dominio definitivo no está en la configuración y no se inventa uno.
 */
export function headTags(route: Route, siteUrl?: string): HeadTag[] {
  const url = (path: string) => (siteUrl ? new URL(path, siteUrl).href : path)
  const { title, description } = meta[route.locale][route.page]
  const alternates: HeadTag[] = [
    ...locales.map((locale) => ({ locale, path: pagePaths[locale][route.page] })),
    { locale: 'x-default', path: pagePaths[DEFAULT_LOCALE][route.page] },
  ].map(({ locale, path }) => ({ tag: 'link', attrs: { rel: 'alternate', hreflang: locale, href: url(path) } }))

  return [
    { tag: 'title', text: title },
    { tag: 'meta', attrs: { name: 'description', content: description } },
    ...(siteUrl ? [{ tag: 'link' as const, attrs: { rel: 'canonical', href: url(route.path) } }] : []),
    ...alternates,
  ]
}
