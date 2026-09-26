import {
  credentialIds,
  type CredentialGroupId,
  type CredentialId,
  type PromptId,
  type ServiceId,
} from './ids.ts'

export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export type Localized<T> = Record<Locale, T>

export const pageIds = ['home', 'services'] as const
export type PageId = (typeof pageIds)[number]

/** Nombre de cada idioma escrito en ese mismo idioma, como se ofrece en el selector. */
export const languageNames: Localized<string> = { es: 'Español', en: 'English' }

/** Cada página es un documento HTML propio (ver vite.config.ts): se navega entre ellas con enlaces normales. */
export const pagePaths: Localized<Record<PageId, string>> = {
  es: { home: '/', services: '/servicios/' },
  en: { home: '/en/', services: '/en/services/' },
}

export type Route = { locale: Locale; page: PageId; path: string }

export const routes: Route[] = locales.flatMap((locale) =>
  pageIds.map((page) => ({ locale, page, path: pagePaths[locale][page] })),
)

/** Nombre de la entrada de build de cada ruta, por ejemplo `en-services`. */
export const routeKey = ({ locale, page }: Route) => `${locale}-${page}`

/* Las anclas se traducen con la página. Cada una indica en qué página está (null si está en todas) para que
   el selector de idioma solo conserve un hash que exista en la página equivalente. */
type Anchor = Localized<string> & { page: PageId | null }

export const sectionAnchors = {
  content: { page: null, es: 'contenido', en: 'content' },
  contact: { page: null, es: 'contacto', en: 'contact' },
  projects: { page: 'home', es: 'proyectos', en: 'projects' },
  career: { page: 'home', es: 'trayectoria', en: 'career' },
  skills: { page: 'home', es: 'habilidades', en: 'skills' },
  education: { page: 'home', es: 'formacion', en: 'education' },
  services: { page: 'services', es: 'servicios', en: 'services' },
  prompts: { page: 'services', es: 'prompts', en: 'prompts' },
} as const satisfies Record<string, Anchor>

export type SectionKey = keyof typeof sectionAnchors

export const serviceAnchors: Record<ServiceId, Localized<string>> = {
  websites: { es: 'servicio-sitios-web', en: 'service-websites' },
  'custom-systems': { es: 'servicio-sistemas-a-medida', en: 'service-custom-systems' },
}

export const promptAnchors: Record<PromptId, Localized<string>> = {
  'code-audit': { es: 'prompt-auditoria-codigo', en: 'prompt-code-audit' },
  'qa-accessibility': { es: 'prompt-qa-accesibilidad', en: 'prompt-qa-accessibility' },
  security: { es: 'prompt-seguridad', en: 'prompt-security' },
  'architecture-performance': { es: 'prompt-arquitectura-rendimiento', en: 'prompt-architecture-performance' },
}

export const credentialGroupAnchors: Record<CredentialGroupId, Localized<string>> = {
  technical: { es: 'formacion-formacion-tecnica', en: 'education-technical-training' },
  certifications: { es: 'formacion-certificaciones', en: 'education-certifications' },
}

const credentialPrefix: Localized<string> = { es: 'credencial-', en: 'credential-' }

export function credentialAnchor(locale: Locale, id: CredentialId): string {
  return `${credentialPrefix[locale]}${id}`
}

export const anchors: Anchor[] = [
  ...Object.values(sectionAnchors),
  ...Object.values(serviceAnchors).map((anchor) => ({ ...anchor, page: 'services' as const })),
  ...Object.values(promptAnchors).map((anchor) => ({ ...anchor, page: 'services' as const })),
  ...Object.values(credentialGroupAnchors).map((anchor) => ({ ...anchor, page: 'home' as const })),
  ...credentialIds.map((id) => ({
    page: 'home' as const,
    es: credentialAnchor('es', id),
    en: credentialAnchor('en', id),
  })),
]

/**
 * Enlace a una sección. Si está en la página actual basta el hash; si está en la otra, se añade su ruta.
 * Las secciones presentes en todas las páginas, como el contacto de la portada, se enlazan en la actual.
 */
export function sectionHref(locale: Locale, current: PageId, section: SectionKey): string {
  const anchor = sectionAnchors[section]
  const hash = `#${anchor[locale]}`
  return anchor.page === null || anchor.page === current ? hash : `${pagePaths[locale][anchor.page]}${hash}`
}

/**
 * El hash que corresponde a `hash` en la misma página en otro idioma, o '' si allí no existe: sin hash, el
 * enlace lleva al principio de la página. `#top` no es un id: los navegadores lo tratan como el inicio.
 */
export function equivalentHash(from: Locale, to: Locale, page: PageId, hash: string): string {
  if (hash === '#top') return hash
  const anchor = anchors.find(
    (candidate) => (candidate.page === null || candidate.page === page) && `#${candidate[from]}` === hash,
  )
  return anchor ? `#${anchor[to]}` : ''
}
