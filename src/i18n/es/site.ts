import type { SiteText } from '../types.ts'

export const site: SiteText = {
  locale: 'es',
  formatLocale: 'es-CR',
  skipLink: 'Saltar al contenido',
  newTab: '(se abre en una pestaña nueva)',
  header: {
    homeLabel: 'Kadir Ramírez, ir al inicio',
    updatedPrefix: 'Portafolio actualizado el',
    navLabel: 'Principal',
    nav: {
      projects: 'Proyectos',
      career: 'Trayectoria',
      skills: 'Habilidades',
      education: 'Formación',
      services: 'Servicios',
      contact: 'Contacto',
    },
  },
  languageSwitch: { label: 'Idioma' },
  pageSwitch: {
    label: 'Páginas del portafolio',
    pages: { home: 'Conocerme', services: 'Mis servicios' },
  },
  hero: {
    eyebrow: 'Desarrollador full stack',
    pages: {
      home: {
        lead: { before: 'Diseño y desarrollo aplicaciones web ', key: 'de principio a fin', after: '.' },
        sub: 'Me gusta convertir ideas y necesidades distintas en productos que la gente pueda usar.',
        primary: 'Ver proyectos',
        secondary: 'Trayectoria',
      },
      services: {
        lead: { before: 'Creo sitios web y sistemas ', key: 'a la medida de tu proyecto', after: '.' },
        sub: 'Antes de empezar acordamos qué incluye el trabajo, qué queda fuera y cuánto cuesta.',
        primary: 'Ver servicios',
        secondary: 'Prompts gratuitos',
      },
    },
    facts: {
      now: {
        label: 'Ahora',
        text: { before: 'Desarrollo ', strong: 'InsightCenter', after: ', una plataforma de integración y analítica.' },
      },
      before: {
        label: 'Antes',
        text: { before: 'Software Developer en ', strong: 'Moovin Logistics', after: ', de 2023 a 2025.' },
      },
    },
    deckCaption: 'proyectos publicados',
    contactTitle: 'Contacto',
    emailLabel: 'Correo',
    copyEmail: {
      idle: 'Copiar',
      copied: 'Copiado',
      failed: 'No se pudo',
      copiedStatus: 'Correo copiado al portapapeles',
      failedStatus: 'No se pudo copiar el correo',
    },
  },
  footer: {
    credit: 'Portafolio construido con React, TypeScript y Vite por Kaddev',
    backToTop: 'Volver arriba',
  },
}
