import { useSite } from './siteContext.ts'
import './SiteFooter.css'

function SiteFooter() {
  const { text } = useSite()

  return (
    <footer className="site-footer theme-petrol">
      <div className="site-footer-content">
        <p className="site-footer-meta">
          <span>{text.footer.credit}</span>
          {/* «Arriba» y no «al inicio»: en Servicios, «inicio» es la otra página, adonde lleva la marca. */}
          <a className="text-link" href="#top">
            {text.footer.backToTop}
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
