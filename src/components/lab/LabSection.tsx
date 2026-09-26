import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { SAMPLE_CSV, SAMPLE_FILE_NAME } from '../../lab/sampleData.ts'
import './LabSection.css'

const loadDataLab = () => import('./DataLab.tsx')
const DataLab = lazy(loadDataLab)

const PANEL_ID = 'laboratorio-herramienta'
const SECTION_HASH = '#laboratorio'
const PANEL_HASH = `#${PANEL_ID}`

/* Muestra del ejemplo ficticio para la sección cerrada. El ejemplo no tiene comillas ni decimales con coma, así
   que basta con separar por comas; el análisis real, con su parser completo, se carga al abrir el laboratorio. */
const sampleLines = SAMPLE_CSV.trim().split('\n')
const previewLines = sampleLines.slice(0, 3)
const previewShares = (() => {
  const revenueByProduct = new Map<string, number>()
  for (const line of sampleLines.slice(1)) {
    const [, product, quantity, price] = line.split(',')
    revenueByProduct.set(product, (revenueByProduct.get(product) ?? 0) + Number(quantity) * Number(price))
  }
  const total = [...revenueByProduct.values()].reduce((sum, revenue) => sum + revenue, 0)
  return [...revenueByProduct]
    .map(([product, revenue]) => ({ product, share: revenue / total }))
    .sort((a, b) => b.share - a.share)
})()

function LabPreview() {
  return (
    <figure className="lab-preview" aria-hidden="true">
      <div className="lab-preview-file">
        <p className="lab-preview-label">{SAMPLE_FILE_NAME}</p>
        <pre className="lab-preview-csv">{previewLines.join('\n')}</pre>
      </div>
      <div className="lab-preview-result">
        <p className="lab-preview-label">Participación en ingresos</p>
        <ul className="lab-preview-bars">
          {previewShares.map(({ product, share }) => (
            <li key={product} style={{ '--ratio': share } as CSSProperties}>
              <span className="lab-preview-product">{product}</span>
              <span className="lab-preview-track">
                <span className="lab-preview-fill" />
              </span>
              <span className="lab-preview-share">{Math.round(share * 100)} %</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}

/** Si el código del laboratorio no llega (por ejemplo, sin conexión), el resto de la página sigue funcionando. */
class LabLoadBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="lab-panel-message" role="alert">
          No se pudo cargar el laboratorio. Recarga la página para intentarlo de nuevo.
        </p>
      )
    }
    return this.props.children
  }
}

type PendingScroll = 'section' | 'panel' | null

function LabSection() {
  const [open, setOpen] = useState(false)
  // Una vez abierto, el analizador queda montado aunque se cierre: así conserva datos, filtros y resultados.
  const [mounted, setMounted] = useState(false)
  const [toolReady, setToolReady] = useState(false)
  // Cada apertura por enlace incrementa el contador para que el efecto de posicionamiento vuelva a ejecutarse.
  const [scrollRequest, setScrollRequest] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const pendingScroll = useRef<PendingScroll>(null)

  const openLab = useCallback((target: PendingScroll) => {
    pendingScroll.current = target
    setMounted(true)
    setOpen(true)
    setScrollRequest((count) => count + 1)
  }, [])

  const handleToolReady = useCallback(() => setToolReady(true), [])

  // Llegar con #laboratorio o #laboratorio-herramienta, o seguir un enlace a ellos, abre el laboratorio.
  useEffect(() => {
    const targetFor = (hash: string): PendingScroll =>
      hash === SECTION_HASH ? 'section' : hash === PANEL_HASH ? 'panel' : null

    // El primer render debe coincidir con el HTML prerenderizado, que está cerrado: el hash se lee tras hidratar.
    const initial = targetFor(window.location.hash)
    // oxlint-disable-next-line react/set-state-in-effect
    if (initial) openLab(initial)

    const onHashChange = () => {
      const target = targetFor(window.location.hash)
      if (target) openLab(target)
    }
    // Un enlace al mismo hash que ya está en la URL no dispara hashchange: por eso también se escuchan los clics.
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      const target = link ? targetFor(link.getAttribute('href') ?? '') : null
      if (target) openLab(target)
    }
    window.addEventListener('hashchange', onHashChange)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('click', onClick)
    }
  }, [openLab])

  // La sección no se mueve al abrirse (el contenido crece hacia abajo), así que se sitúa de inmediato; el
  // analizador espera a estar pintado para que el desplazamiento no quede corto.
  useEffect(() => {
    const target = pendingScroll.current
    if (!open || !target) return
    if (target === 'section') {
      pendingScroll.current = null
      sectionRef.current?.scrollIntoView({ block: 'start' })
    } else if (toolReady) {
      pendingScroll.current = null
      panelRef.current?.focus({ preventScroll: true })
      panelRef.current?.scrollIntoView({ block: 'start' })
    }
  }, [open, scrollRequest, toolReady])

  const toggle = () => {
    if (open) {
      setOpen(false)
    } else {
      openLab(null)
    }
  }

  return (
    <section ref={sectionRef} id="laboratorio" className="lab theme-dark" aria-labelledby="lab-title">
      <div className="container">
        <div className="lab-lead" data-reveal="">
          {/* Texto y botón comparten columna: al abrir se retira la muestra y el botón no cambia de sitio. */}
          <div className="lab-lead-text">
            <header className="lab-header">
              <p className="section-index" aria-hidden="true">
                <span className="section-index-number">02</span> Herramienta en el navegador
              </p>
              <h2 id="lab-title" className="section-title lab-title">
                Laboratorio <span className="lab-title-tail">de datos</span>
              </h2>
              <p className="section-intro lab-intro">
                Carga un CSV de ventas o usa el ejemplo ficticio y obtén totales, evolución por fecha y observaciones
                que explican su cálculo. Todo se procesa en tu navegador; no se envía a ningún servidor.
              </p>
              <ul className="lab-traits" role="list" aria-label="Características">
                <li>Todo o nada</li>
                <li>Reglas explícitas</li>
                <li>Sin servidor</li>
              </ul>
            </header>

            <div className="lab-teaser-action">
              <button
                type="button"
                className="lab-toggle-button"
                aria-expanded={open}
                aria-controls={PANEL_ID}
                onClick={toggle}
                onPointerEnter={loadDataLab}
                onFocus={loadDataLab}
              >
                {open ? 'Cerrar laboratorio' : 'Abrir laboratorio'}
                <span className="lab-toggle-icon" aria-hidden="true" />
              </button>
              <p className="lab-teaser-note">Incluye un ejemplo con errores y una muestra para descargar.</p>
              <noscript>
                <p className="lab-teaser-note">El laboratorio necesita JavaScript para funcionar.</p>
              </noscript>
            </div>
          </div>
          {!open && <LabPreview />}
        </div>

        <div
          ref={panelRef}
          id={PANEL_ID}
          className="lab-panel"
          role="region"
          aria-label="Analizador de ventas"
          tabIndex={-1}
          hidden={!open}
        >
          {mounted && (
            <LabLoadBoundary>
              <Suspense
                fallback={
                  <p className="lab-panel-message" role="status">
                    Cargando el laboratorio…
                  </p>
                }
              >
                <DataLab onReady={handleToolReady} />
              </Suspense>
            </LabLoadBoundary>
          )}
        </div>
      </div>
    </section>
  )
}

export default LabSection
