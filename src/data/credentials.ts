import bizquickDocument from '../assets/credentials/bizquick.webp'
import elementsOfAiDocument from '../assets/credentials/elements-of-ai.webp'
import fwdBackEndDocument from '../assets/credentials/fwd-back-end.webp'
import fwdFullStackDocument from '../assets/credentials/fwd-full-stack.webp'
import fwdRedesDocument from '../assets/credentials/fwd-redes.webp'
import sfpcDocument from '../assets/credentials/sfpc.webp'

export type CredentialDocument = {
  src: string
  width: number
  height: number
  /** Transcripción de lo esencial del documento, para quien no puede ver la imagen. */
  alt: string
  /** Aclaración sobre la copia publicada, visible junto a la imagen ampliada. */
  note?: string
}

export type Credential = {
  id: string
  title: string
  /** Sufijo con la sigla oficial, que se muestra aparte del título. */
  acronym?: string
  kind: string
  issuer: string
  summary?: string
  /** Fechas ISO `AAAA-MM-DD`. */
  period?: { start: string; end: string }
  hours?: number
  issued?: { label: string; date: string }
  expires?: string
  document?: CredentialDocument
  /** Página externa donde se puede comprobar la credencial. */
  verification?: { href: string; label: string; source: string }
}

export type CredentialGroup = {
  id: string
  title: string
  description: string
  credentials: Credential[]
}

const FULL_NAME = 'Axl Kadir Ramírez Rodríguez'

export const credentialGroups: CredentialGroup[] = [
  {
    id: 'formacion-tecnica',
    title: 'Formación técnica',
    description: 'Programas de FWD Costa Rica, con las horas y el periodo que indica cada certificado.',
    credentials: [
      {
        id: 'fwd-full-stack',
        title: 'Full Stack Developer',
        kind: 'Certificado de participación',
        issuer: 'FWD Costa Rica',
        summary:
          'Programa «Desarrolladores de Software Full-Stack Bilingües». En el certificado figuran MySQL, Rails, React y JavaScript.',
        period: { start: '2023-05-22', end: '2023-12-15' },
        hours: 1080,
        issued: { label: 'Emitido', date: '2024-02-02' },
        document: {
          src: fwdFullStackDocument,
          width: 956,
          height: 717,
          alt: `Certificado de participación de FWD Costa Rica a nombre de ${FULL_NAME} por completar el programa «Desarrolladores de Software Full-Stack Bilingües», con el título Full Stack Developer. Impartido del 22 de mayo al 15 de diciembre de 2023, con una duración de 1080 horas. Chacarita, Puntarenas, 2 de febrero de 2024. Incluye los logotipos de MySQL, Rails, React y JavaScript y las firmas de tres directores.`,
          note: 'Fotografía del certificado impreso.',
        },
      },
      {
        id: 'fwd-back-end',
        title: 'Back End Developer',
        kind: 'Certificado de participación',
        issuer: 'FWD Costa Rica',
        summary: 'Segunda parte del mismo programa full stack. En el certificado figuran MySQL, Rails y React.',
        period: { start: '2023-08-24', end: '2023-12-15' },
        hours: 560,
        issued: { label: 'Emitido', date: '2024-02-02' },
        document: {
          src: fwdBackEndDocument,
          width: 910,
          height: 776,
          alt: `Certificado de participación de FWD Costa Rica a nombre de ${FULL_NAME} por completar la segunda parte del programa «Desarrolladores de Software Full-Stack Bilingües», con el título Back End Developer. Impartido del 24 de agosto al 15 de diciembre de 2023, con una duración de 560 horas. Chacarita, Puntarenas, 2 de febrero de 2024. Incluye los logotipos de MySQL, Rails y React y las firmas de tres directores.`,
        },
      },
      {
        id: 'fwd-redes',
        title: 'TI Redes y Soporte Técnico',
        kind: 'Certificado de participación',
        issuer: 'FWD Costa Rica',
        period: { start: '2024-01-15', end: '2025-03-15' },
        hours: 560,
        issued: { label: 'Emitido', date: '2025-04-02' },
        document: {
          src: fwdRedesDocument,
          width: 644,
          height: 549,
          alt: `Certificado de participación de FWD Costa Rica a nombre de ${FULL_NAME} por completar el programa «TI Redes y Soporte Técnico». Impartido del 15 de enero de 2024 al 15 de marzo de 2025, con una duración de 560 horas. Chacarita, Puntarenas, 2 de abril de 2025. Incluye íconos de una computadora, una red y unos audífonos, y las firmas de tres directores.`,
        },
      },
    ],
  },
  {
    id: 'certificaciones',
    title: 'Certificaciones',
    description: 'Certificaciones profesionales y un curso en línea, con su enlace de verificación cuando existe.',
    credentials: [
      {
        id: 'elements-of-ai',
        title: 'Elements of AI',
        kind: 'Curso en línea',
        issuer: 'MinnaLearn y Universidad de Helsinki',
        summary: 'Certificado de aprovechamiento del curso «Elementos de IA», de unas 50 horas de estudio.',
        issued: { label: 'Fecha', date: '2026-09-08' },
        document: {
          src: elementsOfAiDocument,
          width: 689,
          height: 485,
          alt: `Certificado de aprovechamiento de Elements of AI, de MinnaLearn y la Universidad de Helsinki, que certifica que ${FULL_NAME} completó con éxito el curso en línea «Elementos de IA», de unas 50 horas de estudio. Fechado el 8 de septiembre de 2026, con las firmas de Teemu Roos, profesor de la Universidad de Helsinki, y Ville Valtonen, director ejecutivo de MinnaLearn.`,
        },
        verification: {
          href: 'https://certificates.mooc.fi/validate/t79mb6bpww8',
          label: 'Validar el certificado',
          source: 'MOOC.fi',
        },
      },
      {
        id: 'sfpc',
        title: 'Scrum Foundation Professional Certification',
        acronym: 'SFPC™',
        kind: 'Certificación profesional',
        issuer: 'CertiProf',
        issued: { label: 'Certificada', date: '2024-09-30' },
        expires: '2027-09-30',
        document: {
          src: sfpcDocument,
          width: 610,
          height: 432,
          alt: `Certificado de CertiProf que acredita que ${FULL_NAME} cumplió los requisitos de la Scrum Foundation Professional Certification (SFPC™). Fecha de certificación: 30 de septiembre de 2024. Vence el 30 de septiembre de 2027. Incluye la firma del director ejecutivo y el sello de la certificación.`,
          note: 'En esta copia se ocultó el número de certificado.',
        },
      },
      {
        id: 'dspc',
        title: 'Design Sprint Professional Certification',
        acronym: 'DSPC™',
        kind: 'Certificación profesional',
        issuer: 'CertiProf',
        summary: 'Credencial digital publicada en Credly. No hay copia del certificado en esta página.',
        issued: { label: 'Emitida', date: '2024-09-30' },
        expires: '2027-09-30',
        verification: {
          href: 'https://www.credly.com/badges/d78621bc-fe52-4971-9f0c-d804d8cc79c0/linked_in_profile',
          label: 'Ver la credencial',
          source: 'Credly',
        },
      },
    ],
  },
  {
    id: 'experiencia',
    title: 'Experiencia profesional',
    description: 'Constancia de la pasantía con la que empecé en Moovin. No es una certificación académica.',
    credentials: [
      {
        id: 'bizquick-moovin',
        title: 'Proyectos de front-end y UX/UI',
        kind: 'Constancia de experiencia profesional',
        issuer: 'Bizquick',
        summary:
          'Constancia de la pasantía con la que empecé en Moovin CR, gestionada por la plataforma Bizquick. Al terminarla, Moovin me contrató directamente.',
        period: { start: '2024-04-22', end: '2024-07-19' },
        document: {
          src: bizquickDocument,
          width: 881,
          height: 674,
          alt: `Certificado de experiencia profesional de Bizquick que indica que ${FULL_NAME} completó la oportunidad «Proyectos de Front-end y UX/UI» con la empresa Moovin CR a través de la plataforma Bizquick, del 22 de abril al 19 de julio de 2024. Firma Maureen Serrano, directora ejecutiva de Bizquick S.A.`,
        },
      },
    ],
  },
]
