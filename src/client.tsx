import { StrictMode, type ReactNode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'

/** Monta una página en #root. Cada ruta tiene su propia entrada (src/entries), así que solo descarga su idioma y su contenido. */
export function mount(page: ReactNode) {
  const container = document.getElementById('root')!
  const app = <StrictMode>{page}</StrictMode>

  // La versión de producción llega prerenderizada (ver scripts/prerender.mjs); en desarrollo el contenedor está vacío.
  if (container.hasChildNodes()) hydrateRoot(container, app)
  else createRoot(container).render(app)
}
