import bootstrapIcon from '../assets/icons/bootstrap.svg'
import cssIcon from '../assets/icons/css.svg'
import databaseSymbol from '../assets/icons/database-generic.svg'
import dockerIcon from '../assets/icons/docker.svg'
import firebaseIcon from '../assets/icons/firebase.svg'
import gitIcon from '../assets/icons/git.svg'
import html5Icon from '../assets/icons/html5.svg'
import javascriptIcon from '../assets/icons/javascript.svg'
import jqueryIcon from '../assets/icons/jquery.svg'
import nestjsIcon from '../assets/icons/nestjs.svg'
import nodejsIcon from '../assets/icons/nodedotjs.svg'
import postgresqlIcon from '../assets/icons/postgresql.svg'
import pythonIcon from '../assets/icons/python.svg'
import reactIcon from '../assets/icons/react.svg'
import typescriptIcon from '../assets/icons/typescript.svg'
import { skillGroupIds, type SkillGroupId } from '../ids.ts'

export type Skill = {
  name: string
  icon: string
}

/** Tecnologías de cada grupo; el nombre y la descripción del grupo están en src/i18n/{es,en}/home.ts. */
const skillsByGroup: Record<SkillGroupId, Skill[]> = {
  frontend: [
    { name: 'JavaScript', icon: javascriptIcon },
    { name: 'TypeScript', icon: typescriptIcon },
    { name: 'HTML', icon: html5Icon },
    { name: 'CSS', icon: cssIcon },
    { name: 'React', icon: reactIcon },
    { name: 'jQuery', icon: jqueryIcon },
    { name: 'Bootstrap', icon: bootstrapIcon },
  ],
  backend: [
    { name: 'Node.js', icon: nodejsIcon },
    { name: 'NestJS', icon: nestjsIcon },
    { name: 'Firebase', icon: firebaseIcon },
  ],
  data: [
    // SQL es un lenguaje estándar sin logotipo oficial: se usa un símbolo genérico de base de datos.
    { name: 'SQL', icon: databaseSymbol },
    { name: 'PostgreSQL', icon: postgresqlIcon },
    { name: 'Python', icon: pythonIcon },
  ],
  tools: [
    { name: 'Git', icon: gitIcon },
    { name: 'Docker', icon: dockerIcon },
  ],
}

export const skillGroups = skillGroupIds.map((id) => ({ id, skills: skillsByGroup[id] }))
