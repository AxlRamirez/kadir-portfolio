export type CareerStep = {
  id: string
  /** Etiqueta de tiempo tal como se muestra. Solo lleva fechas documentadas; las de formación coinciden con sus certificados. */
  when: string
  stage: string
  title: string
  place: string
  description: string
  link?: { href: string; label: string }
}

export const careerSteps: CareerStep[] = [
  {
    id: 'fwd',
    when: 'may – dic 2023',
    stage: 'Formación',
    title: 'Programa de desarrollo full stack',
    place: 'FWD Costa Rica',
    description:
      'Programa «Desarrolladores de Software Full-Stack Bilingües», de 1080 horas, con MySQL, Rails, React y JavaScript.',
    link: { href: '#formacion', label: 'Ver el certificado' },
  },
  {
    id: 'moovin',
    when: 'jul 2023 – jul 2025',
    stage: 'Experiencia laboral',
    title: 'Software Developer',
    place: 'Moovin Logistics · jornada completa, en remoto',
    description:
      'Desarrollo de interfaz web para el sistema logístico de la empresa usando React, JavaScript, HTML y CSS.',
  },
  {
    id: 'insightcenter',
    when: 'Hoy',
    stage: 'En desarrollo',
    title: 'InsightCenter',
    place: 'Plataforma de integración y analítica',
    description:
      'Desarrollo una plataforma para integrar información de ERP, APIs, bases de datos y archivos, con React, NestJS, PostgreSQL y procesos ETL en Python.',
    link: { href: '#proyectos', label: 'Ver el proyecto' },
  },
]
