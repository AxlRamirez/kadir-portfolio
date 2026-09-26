import { careerIds, type CareerId } from '../ids.ts'

/** Sección a la que enlaza cada paso, si tiene más información en la página. Los textos están en src/i18n. */
const careerLinks: Partial<Record<CareerId, 'education' | 'projects'>> = {
  fwd: 'education',
  insightcenter: 'projects',
}

export const careerSteps = careerIds.map((id) => ({ id, link: careerLinks[id] ?? null }))
