import type { PageId } from '../../routes.ts'
import type { PageMeta } from '../types.ts'

export const meta: Record<PageId, PageMeta> = {
  home: {
    title: 'Kadir Ramírez — Full-stack developer',
    description:
      'Portfolio of Kadir Ramírez, full-stack developer: web applications from start to finish, from landing pages to operational tools and platforms.',
  },
  services: {
    title: 'Services — Kadir Ramírez',
    description:
      'Services by Kadir Ramírez, full-stack developer: websites and landing pages with an estimated price range, and custom web systems quoted on their requirements. Includes free prompts for reviewing a project.',
  },
}
