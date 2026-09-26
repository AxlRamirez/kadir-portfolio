import dspcBadge from '../assets/credentials/dspc.webp'
import elementsOfAiDocument from '../assets/credentials/elements-of-ai.webp'
import fwdBackEndDocument from '../assets/credentials/fwd-back-end.webp'
import fwdFullStackDocument from '../assets/credentials/fwd-full-stack.webp'
import fwdRedesDocument from '../assets/credentials/fwd-redes.webp'
import sfpcDocument from '../assets/credentials/sfpc.webp'
import { credentialGroupIds, type CredentialGroupId, type CredentialId } from '../ids.ts'
import type { Locale } from '../routes.ts'

export type CredentialDocument = {
  src: string
  width: number
  height: number
}

/** Lo que no cambia con el idioma. Tipo, emisor, resumen y transcripción del documento están en src/i18n. */
export type Credential = {
  id: CredentialId
  /** Título oficial, tal como figura en el documento, y el idioma en que está escrito. */
  title: string
  titleLang: Locale
  /** Sufijo con la sigla oficial, que se muestra aparte del título. */
  acronym?: string
  /** Fechas ISO `AAAA-MM-DD`. */
  period?: { start: string; end: string }
  hours?: number
  issued?: string
  expires?: string
  document?: CredentialDocument
  /** Página externa donde se puede comprobar la credencial. */
  verification?: { href: string; source: string }
}

const credentialsByGroup: Record<CredentialGroupId, Credential[]> = {
  technical: [
    {
      id: 'fwd-full-stack',
      title: 'Full Stack Developer',
      titleLang: 'en',
      period: { start: '2023-05-22', end: '2023-12-15' },
      hours: 1080,
      issued: '2024-02-02',
      document: { src: fwdFullStackDocument, width: 956, height: 717 },
    },
    {
      id: 'fwd-back-end',
      title: 'Back End Developer',
      titleLang: 'en',
      period: { start: '2023-08-24', end: '2023-12-15' },
      hours: 560,
      issued: '2024-02-02',
      document: { src: fwdBackEndDocument, width: 910, height: 776 },
    },
    {
      id: 'fwd-redes',
      title: 'TI Redes y Soporte Técnico',
      titleLang: 'es',
      period: { start: '2024-01-15', end: '2025-03-15' },
      hours: 560,
      issued: '2025-04-02',
      document: { src: fwdRedesDocument, width: 644, height: 549 },
    },
  ],
  certifications: [
    {
      id: 'elements-of-ai',
      title: 'Elements of AI',
      titleLang: 'en',
      issued: '2026-09-08',
      document: { src: elementsOfAiDocument, width: 689, height: 485 },
      verification: { href: 'https://certificates.mooc.fi/validate/t79mb6bpww8', source: 'MOOC.fi' },
    },
    {
      id: 'sfpc',
      title: 'Scrum Foundation Professional Certification',
      titleLang: 'en',
      acronym: 'SFPC™',
      issued: '2024-09-30',
      expires: '2027-09-30',
      document: { src: sfpcDocument, width: 610, height: 432 },
    },
    {
      id: 'dspc',
      title: 'Design Sprint Professional Certification',
      titleLang: 'en',
      acronym: 'DSPC™',
      issued: '2024-09-30',
      expires: '2027-09-30',
      document: { src: dspcBadge, width: 515, height: 474 },
      verification: {
        href: 'https://www.credly.com/badges/d78621bc-fe52-4971-9f0c-d804d8cc79c0/linked_in_profile',
        source: 'Credly',
      },
    },
  ],
}

export const credentialGroups = credentialGroupIds.map((id) => ({ id, credentials: credentialsByGroup[id] }))
