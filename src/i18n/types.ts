import type {
  CareerId,
  CredentialGroupId,
  CredentialId,
  ProjectId,
  PromptId,
  ServiceId,
  SkillGroupId,
} from '../ids.ts'
import type { Locale, PageId } from '../routes.ts'

/* Tipos de los textos de cada idioma. Los campos que un idioma podría no necesitar se declaran como
   `string | null` y no como opcionales: así, olvidar uno en una traducción también es un error de tipos. */

/** Frase con una parte destacada, sin marcado dentro de los datos. */
export type Emphasis = { before: string; strong: string; after: string }

export type PageMeta = { title: string; description: string }

export type SectionHeading = {
  /** Nombre que acompaña al número de la sección, por ejemplo «Trabajo publicado». */
  index: string
  title: string
  intro: string
}

type HeroPageText = {
  /** La frase principal; `key` es la parte subrayada. */
  lead: { before: string; key: string; after: string }
  sub: string
  primary: string
  secondary: string
}

export type NavSection = 'projects' | 'career' | 'skills' | 'education' | 'services' | 'contact'

/** Textos comunes a las dos páginas de un idioma: cabecera, portada, contacto y pie. */
export type SiteText = {
  locale: Locale
  /** Configuración regional para fechas y números, por ejemplo `es-CR`. */
  formatLocale: string
  skipLink: string
  /** Aviso para lectores de pantalla en los enlaces que abren otra pestaña. */
  newTab: string
  header: {
    homeLabel: string
    updatedPrefix: string
    navLabel: string
    nav: Record<NavSection, string>
  }
  languageSwitch: { label: string }
  pageSwitch: { label: string; pages: Record<PageId, string> }
  hero: {
    eyebrow: string
    pages: Record<PageId, HeroPageText>
    facts: Record<'now' | 'before', { label: string; text: Emphasis }>
    deckCaption: string
    contactTitle: string
    emailLabel: string
    copyEmail: { idle: string; copied: string; failed: string; copiedStatus: string; failedStatus: string }
  }
  footer: { credit: string; backToTop: string }
}

export type ProjectText = {
  name: string
  kind: string
  description: string
  context: string
  /** Aviso breve junto al enlace, por ejemplo si el sitio es una herramienta en uso. */
  note: string | null
  previewAlt: string
}

export type CareerStepText = {
  /** Etiqueta de tiempo tal como se muestra. Solo lleva fechas documentadas; las de formación coinciden con sus certificados. */
  when: string
  stage: string
  title: string
  place: string
  description: string
}

export type CredentialText = {
  kind: string
  issuer: string
  summary: string | null
  issuedLabel: string
  /** Traducción de un título oficial que se conserva en otro idioma. */
  titleTranslation: string | null
  /** Transcripción de lo esencial del documento, para quien no puede ver la imagen. */
  documentAlt: string
  /** Aclaración sobre la copia publicada, visible junto a la imagen ampliada. */
  documentNote: string | null
  verificationLabel: string | null
}

/** Textos de la página de inicio. */
export type HomeText = {
  projects: SectionHeading & {
    visit: string
    noteLabel: string
    previewPending: string
    items: Record<ProjectId, ProjectText>
  }
  career: SectionHeading & {
    linkLabels: { education: string; projects: string }
    items: Record<CareerId, CareerStepText>
  }
  skills: SectionHeading & {
    groups: Record<SkillGroupId, { title: string; description: string }>
    ai: { title: string; text: Emphasis; link: string }
  }
  credentials: SectionHeading & {
    titleTail: string
    enlarge: string
    enlargeContext: string
    missingDocument: string
    facts: { period: string; duration: string; hours: (hours: number) => string; expires: string }
    verification: (label: string, source: string) => string
    viewer: { close: string; openOriginal: string }
    groups: Record<CredentialGroupId, { title: string; description: string }>
    items: Record<CredentialId, CredentialText>
  }
}

export type ServiceList = {
  title: string
  /** Solo cambia la marca de cada elemento: incluido, a acordar o fuera del servicio. */
  tone: 'includes' | 'terms' | 'excludes'
  items: string[]
}

export type ServiceText = {
  title: string
  summary: string
  price: { label: string; value: string; note: string }
  /** Alcance: lo que puede incluir, lo que se acuerda en la propuesta y lo que queda fuera. */
  lists: ServiceList[]
  /** Pasos previos a la cotización, para los servicios que no tienen un precio de partida. */
  steps: { title: string; items: { title: string; description: string }[] } | null
  /** Nombre corto para los enlaces de contacto («Escribir por WhatsApp sobre …»). */
  contactTopic: string
  whatsappMessage: string
  emailSubject: string
}

export type FreePrompt = {
  title: string
  summary: string
  /** Lo principal que revisa, en frases cortas, para decidir sin abrir el texto completo. */
  covers: string[]
  /** Texto completo que se copia; los corchetes marcan lo que hay que completar antes de enviarlo. */
  text: string
}

/** Textos de la página de servicios. */
export type ServicesText = {
  services: SectionHeading & {
    whatsapp: string
    email: string
    topicContext: (topic: string) => string
    detailsOpen: string
    detailsClose: string
    items: Record<ServiceId, ServiceText>
  }
  prompts: SectionHeading & {
    coversLabel: string
    copy: string
    copied: string
    copiedStatus: string
    manualStatus: string
    showText: string
    items: Record<PromptId, FreePrompt>
  }
}
