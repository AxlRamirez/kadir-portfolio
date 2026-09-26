import type { PageId } from '../../routes.ts'
import type { PageMeta } from '../types.ts'

export const meta: Record<PageId, PageMeta> = {
  home: {
    title: 'Kadir Ramírez — Desarrollador full stack',
    description:
      'Portafolio de Kadir Ramírez, desarrollador full stack: aplicaciones web de principio a fin, desde landing pages hasta herramientas operativas y plataformas.',
  },
  services: {
    title: 'Mis servicios — Kadir Ramírez',
    description:
      'Servicios de Kadir Ramírez, desarrollador full stack: sitios web y landing pages con un rango orientativo de precio, y sistemas web a medida cotizados según sus requisitos. Incluye prompts gratuitos para revisar un proyecto.',
  },
}
