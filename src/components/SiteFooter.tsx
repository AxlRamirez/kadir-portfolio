import './SiteFooter.css'

function SiteFooter() {
  return (
    <footer className="site-footer theme-petrol">
      <div className="site-footer-content">
        <p className="site-footer-meta">
          <span>Portafolio construido con React, TypeScript y Vite por Kaddev</span>
          <a className="text-link" href="#top">
            Volver al inicio
            <span className="arrow" aria-hidden="true">
              ↑
            </span>
          </a>
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
