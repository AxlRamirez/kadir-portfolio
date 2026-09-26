import { useEffect, useState } from 'react'
import './SiteHeader.css'

const links = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'laboratorio', label: 'Laboratorio' },
  { id: 'trayectoria', label: 'Trayectoria' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'formacion', label: 'Formación' },
  { id: 'contacto', label: 'Contacto' },
]

// El contacto vive en la portada y en el pie: no se marca como sección activa.
const trackedIds = links.map((link) => link.id).filter((id) => id !== 'contacto')

function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const sections = trackedIds.map((id) => document.getElementById(id)).filter((section) => section !== null)
    // La banda de detección es la franja central de la pantalla: una sección está activa mientras la cruza.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
          else setActive((current) => (current === entry.target.id ? null : current))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return active
}

function SiteHeader() {
  const active = useActiveSection()

  return (
    <header className="site-header theme-dark">
      <div className="container site-header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            KR
          </span>
          <span className="brand-name">Portafolio actualizado el 25 de septiembre de 2026</span>
        </a>
        <nav aria-label="Principal">
          <ul className="site-nav" role="list">
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} aria-current={active === link.id ? 'true' : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  )
}

export default SiteHeader
