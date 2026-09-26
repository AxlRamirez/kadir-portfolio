import controlDieselPreview from '../assets/projects/control-diesel.webp'
import controlDiesel640 from '../assets/projects/control-diesel-640.webp'
import controlDiesel960 from '../assets/projects/control-diesel-960.webp'
import insightCenterPreview from '../assets/projects/insightcenter.webp'
import insightCenter640 from '../assets/projects/insightcenter-640.webp'
import insightCenter960 from '../assets/projects/insightcenter-960.webp'
import inventarioBodegaPreview from '../assets/projects/inventario-bodega.webp'
import inventarioBodega640 from '../assets/projects/inventario-bodega-640.webp'
import inventarioBodega960 from '../assets/projects/inventario-bodega-960.webp'
import landingIsmaelPreview from '../assets/projects/landing-ismael.webp'
import landingIsmael640 from '../assets/projects/landing-ismael-640.webp'
import landingIsmael960 from '../assets/projects/landing-ismael-960.webp'
import { projectIds, type ProjectId } from '../ids.ts'

export type ProjectPreview = {
  src: string
  /** Reducciones de la misma captura (640 y 960 px de ancho) para pantallas que no necesitan la original. */
  srcSet: string
}

const previewSrcSet = (w640: string, w960: string, w1280: string) => `${w640} 640w, ${w960} 960w, ${w1280} 1280w`

/** Lo que no cambia con el idioma; nombre, descripción y texto alternativo están en src/i18n/{es,en}/home.ts. */
export type Project = {
  id: ProjectId
  url: string
  // Sin vista previa se muestra un aviso de «pendiente» en lugar de la imagen.
  preview?: ProjectPreview
}

// Las vistas previas son capturas de 1280 × 800 de la página pública de cada sitio.
export const PREVIEW_WIDTH = 1280
export const PREVIEW_HEIGHT = 800

const projectData: Record<ProjectId, Omit<Project, 'id'>> = {
  insightcenter: {
    url: 'https://insightcenter.kaddev.workers.dev',
    preview: {
      src: insightCenterPreview,
      srcSet: previewSrcSet(insightCenter640, insightCenter960, insightCenterPreview),
    },
  },
  'landing-ismael': {
    url: 'https://landingpage-ismael.vercel.app',
    preview: {
      src: landingIsmaelPreview,
      srcSet: previewSrcSet(landingIsmael640, landingIsmael960, landingIsmaelPreview),
    },
  },
  'control-diesel': {
    url: 'https://control-de-diesel.web.app/',
    preview: {
      src: controlDieselPreview,
      srcSet: previewSrcSet(controlDiesel640, controlDiesel960, controlDieselPreview),
    },
  },
  'inventario-bodega': {
    url: 'https://inventario-bodega-e5914.web.app/',
    preview: {
      src: inventarioBodegaPreview,
      srcSet: previewSrcSet(inventarioBodega640, inventarioBodega960, inventarioBodegaPreview),
    },
  },
}

export const projects: Project[] = projectIds.map((id) => ({ id, ...projectData[id] }))
