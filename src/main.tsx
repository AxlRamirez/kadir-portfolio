import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// La versión de producción llega prerenderizada (ver scripts/prerender.mjs); en desarrollo el contenedor está vacío.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
