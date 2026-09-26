/* Identificadores del contenido, comunes a los dos idiomas. Ordenan cada lista y enlazan los textos de
   src/i18n/{es,en} con los datos de src/data: si un idioma no tiene el texto de un identificador, no compila. */

export const projectIds = ['insightcenter', 'landing-ismael', 'control-diesel', 'inventario-bodega'] as const
export type ProjectId = (typeof projectIds)[number]

export const careerIds = ['fwd', 'moovin', 'insightcenter'] as const
export type CareerId = (typeof careerIds)[number]

export const skillGroupIds = ['frontend', 'backend', 'data', 'tools'] as const
export type SkillGroupId = (typeof skillGroupIds)[number]

export const credentialGroupIds = ['technical', 'certifications'] as const
export type CredentialGroupId = (typeof credentialGroupIds)[number]

export const credentialIds = ['fwd-full-stack', 'fwd-back-end', 'fwd-redes', 'elements-of-ai', 'sfpc', 'dspc'] as const
export type CredentialId = (typeof credentialIds)[number]

export const serviceIds = ['websites', 'custom-systems'] as const
export type ServiceId = (typeof serviceIds)[number]

export const promptIds = ['code-audit', 'qa-accessibility', 'security', 'architecture-performance'] as const
export type PromptId = (typeof promptIds)[number]
