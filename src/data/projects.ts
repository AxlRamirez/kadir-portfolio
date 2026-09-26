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

export type ProjectPreview = {
  src: string
  /** Reducciones de la misma captura (640 y 960 px de ancho) para pantallas que no necesitan la original. */
  srcSet: string
  alt: string
}

const previewSrcSet = (w640: string, w960: string, w1280: string) => `${w640} 640w, ${w960} 960w, ${w1280} 1280w`

export type Project = {
  id: string
  name: string
  kind: string
  description: string
  context: string
  url: string
  /** Aviso breve que se muestra junto al enlace, por ejemplo si el sitio es una herramienta en uso. */
  note?: string
  // Sin vista previa se muestra un aviso de «pendiente» en lugar de la imagen.
  preview?: ProjectPreview
}

// Las vistas previas son capturas de 1280 × 800 de la página pública de cada sitio.
export const PREVIEW_WIDTH = 1280
export const PREVIEW_HEIGHT = 800

export const projects: Project[] = [
  {
    id: 'insightcenter',
    name: 'InsightCenter',
    kind: 'Plataforma de integración y analítica',
    description:
      'Sitio público de la plataforma que estoy desarrollando para integrar información de ERP, APIs, bases de datos y archivos, conservar su trazabilidad y prepararla para analítica.',
    context: 'Plataforma: React, NestJS, PostgreSQL y ETL en Python',
    url: 'https://insightcenter.kaddev.workers.dev',
    preview: {
      src: insightCenterPreview,
      srcSet: previewSrcSet(insightCenter640, insightCenter960, insightCenterPreview),
      alt: 'Portada del sitio de InsightCenter con el titular «Conecta la información de tu empresa y entiende mejor tu operación» junto a una vista de la aplicación.',
    },
  },
  {
    id: 'landing-ismael',
    name: 'Landing page para Ismael',
    kind: 'Landing page',
    description:
      'Página de presentación de Ismael Vasquez Quiros, que comparte herramientas y estrategias para explorar ingresos en línea. Explica el punto de partida, lo que ofrece y cómo empezar, y lleva el contacto a WhatsApp.',
    context: 'Publicada en Vercel',
    url: 'https://landingpage-ismael.vercel.app',
    preview: {
      src: landingIsmaelPreview,
      srcSet: previewSrcSet(landingIsmael640, landingIsmael960, landingIsmaelPreview),
      alt: 'Portada de la landing page de Ismael Vasquez Quiros con el titular «Construye una vida con más libertad, empezando desde donde estás» y su fotografía.',
    },
  },
  {
    id: 'control-diesel',
    name: 'Control de diésel',
    kind: 'Aplicación web',
    description:
      'Formulario para registrar dispensaciones de combustible con placa, cliente, lectura de odómetro, litros e imágenes de evidencia, y mostrar el resultado de consumo. Tiene un acceso aparte al panel administrativo.',
    context: 'Publicada en Firebase Hosting',
    url: 'https://control-de-diesel.web.app/',
    note: 'El enlace lleva a una herramienta operativa en uso. Puedes ver el formulario, pero no envíes registros de prueba.',
    preview: {
      src: controlDieselPreview,
      srcSet: previewSrcSet(controlDiesel640, controlDiesel960, controlDieselPreview),
      alt: 'Formulario «Registro de dispensación» de Control de Diesel con campos de placa, cliente, fecha, odómetro, litros e imágenes de evidencia.',
    },
  },
  {
    id: 'inventario-bodega',
    name: 'Inventario de bodega',
    kind: 'Aplicación web',
    description:
      'Sistema de inventario con acceso mediante PIN de cuatro dígitos y un modo invitado de solo lectura para consultar productos. La vista previa muestra únicamente la pantalla de acceso.',
    context: 'Publicada en Firebase Hosting',
    url: 'https://inventario-bodega-e5914.web.app/',
    preview: {
      src: inventarioBodegaPreview,
      srcSet: previewSrcSet(inventarioBodega640, inventarioBodega960, inventarioBodegaPreview),
      alt: 'Pantalla de acceso del inventario con el logotipo de La Costa Distribución, un campo para el PIN y el botón para entrar como invitado.',
    },
  },
]
