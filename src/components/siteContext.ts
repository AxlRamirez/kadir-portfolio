import { createContext, useContext } from 'react'
import type { SiteText } from '../i18n/types.ts'
import type { PageId } from '../routes.ts'

/** Página actual y textos comunes de su idioma. Lo provee SiteLayout; cada sección recibe sus textos por props. */
export type Site = { page: PageId; text: SiteText }

export const SiteContext = createContext<Site | null>(null)

export function useSite(): Site {
  const site = useContext(SiteContext)
  if (!site) throw new Error('useSite debe usarse dentro de SiteLayout')
  return site
}

const dateFormats = new Map<string, Intl.DateTimeFormat>()

/** Fecha ISO `AAAA-MM-DD` en el formato del idioma. Se construye en UTC para que la zona horaria no la mueva un día. */
export function formatDate(iso: string, locale: string, month: 'short' | 'long'): string {
  const key = `${locale}-${month}`
  let format = dateFormats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, { day: 'numeric', month, year: 'numeric', timeZone: 'UTC' })
    dateFormats.set(key, format)
  }
  const [year, monthNumber, day] = iso.split('-').map(Number)
  return format.format(new Date(Date.UTC(year, monthNumber - 1, day)))
}
