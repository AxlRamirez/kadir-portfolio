export type CareerStep = {
  id: string
  /** Etiqueta de tiempo tal como se muestra. Solo lleva fechas que figuran en un documento de la sección de formación. */
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
    id: 'pasantia',
    when: 'abr – jul 2024',
    stage: 'Pasantía',
    title: 'Proyectos de front-end y UX/UI',
    place: 'Moovin, a través de Bizquick',
    description:
      'Empecé en Moovin con una pasantía gestionada por la plataforma Bizquick, trabajando en proyectos de front-end y UX/UI.',
    link: { href: '#formacion-experiencia', label: 'Ver la constancia' },
  },
  {
    id: 'moovin',
    when: 'Después de la pasantía · cerca de dos años',
    stage: 'Contratación directa',
    title: 'Desarrollador',
    place: 'Moovin',
    description:
      'Al terminar la pasantía, Moovin me contrató directamente. Desarrollé módulos operativos y participé en varios proyectos del equipo técnico.',
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
