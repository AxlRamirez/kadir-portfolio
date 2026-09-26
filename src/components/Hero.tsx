import { useEffect, useState, type CSSProperties } from 'react'
import { EMAIL, externalContacts } from '../data/contact.ts'
import { PREVIEW_HEIGHT, PREVIEW_WIDTH, projects } from '../data/projects.ts'
import './Hero.css'

type CopyState = 'idle' | 'copied' | 'failed'

const copyButtonText: Record<CopyState, string> = {
  idle: 'Copiar',
  copied: 'Copiado',
  failed: 'No se pudo',
}

const copyStatusMessage: Record<CopyState, string> = {
  idle: '',
  copied: 'Correo copiado al portapapeles',
  failed: 'No se pudo copiar el correo',
}

// Copiar es útil cuando el equipo no tiene un cliente de correo configurado y mailto: no abre nada.
function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = window.setTimeout(() => setState('idle'), 2500)
    return () => window.clearTimeout(timer)
  }, [state])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <>
      <button type="button" className="copy-button" data-state={state} onClick={copyEmail}>
        {copyButtonText[state]}
      </button>
      <span className="visually-hidden" role="status">
        {copyStatusMessage[state]}
      </span>
    </>
  )
}

// La composición del mazo (Hero.css) está pensada para cuatro cartas.
const deckProjects = projects.filter((project) => project.preview).slice(0, 4)
const projectCount = String(projects.length).padStart(2, '0')

/* Las capturas reales de los proyectos, apiladas en cascada hacia abajo, como un avance de la sección.
   Es un atajo para el ratón: el teclado y los lectores de pantalla usan el botón «Ver proyectos», que
   lleva al mismo sitio, así que el mazo queda fuera del orden de tabulación y del árbol accesible. */
function WorkDeck() {
  return (
    <a className="work-deck" href="#proyectos" tabIndex={-1} aria-hidden="true">
      <span className="work-deck-cards">
        {deckProjects.map((project, index) => (
          <span key={project.id} className="work-card" style={{ '--i': index } as CSSProperties}>
            <span className="work-card-bar">
              <span className="work-card-dots" />
              <span className="work-card-host">{new URL(project.url).host}</span>
            </span>
            <img
              src={project.preview?.src}
              srcSet={project.preview?.srcSet}
              sizes="(min-width: 64rem) 22rem, 70vw"
              alt=""
              width={PREVIEW_WIDTH}
              height={PREVIEW_HEIGHT}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </span>
        ))}
      </span>
      <span className="work-deck-caption">
        <span className="work-deck-count">{projectCount}</span> proyectos publicados
        <span className="arrow">↓</span>
      </span>
    </a>
  )
}

function Hero() {
  return (
    <section className="hero theme-dark" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <p className="hero-eyebrow kicker">Desarrollador full stack</p>

        <h1 id="hero-title" className="hero-title">
          <span className="hero-title-line">Kadir</span>{' '}
          <span className="hero-title-line">Ramírez</span>
        </h1>

        <p className="hero-lead">
          Diseño y desarrollo aplicaciones web <span className="hero-lead-key">de principio a fin</span>.
        </p>

        <p className="hero-sub">Me gusta convertir ideas y necesidades distintas en productos que la gente pueda usar.</p>

        <div className="hero-actions">
          <a className="button hero-cta" href="#proyectos">
            Ver proyectos
            <span className="arrow" aria-hidden="true">
              ↓
            </span>
          </a>
          <a className="text-link" href="#trayectoria">
            Trayectoria
          </a>
        </div>

        <div className="hero-work">
          <WorkDeck />
        </div>

        <dl className="hero-facts">
          <div className="hero-fact">
            <dt>Ahora</dt>
            <dd>
              Desarrollo <strong>InsightCenter</strong>, una plataforma de integración y analítica.
            </dd>
          </div>
          <div className="hero-fact">
            <dt>Antes</dt>
            <dd>
              Cerca de dos años en <strong>Moovin</strong>, de la pasantía a la contratación directa.
            </dd>
          </div>
        </dl>

        <div id="contacto" className="hero-contact">
          <h2 className="hero-contact-title kicker">Contacto</h2>
          <ul className="contact-list" role="list">
            {externalContacts.map((contact) => (
              <li key={contact.label}>
                <a className="contact-link" href={contact.href} target="_blank" rel="noreferrer">
                  <span className="contact-label">{contact.label}</span>
                  <span className="contact-value">{contact.value}</span>
                  <span className="contact-arrow arrow" aria-hidden="true">
                    ↗
                  </span>
                  <span className="visually-hidden">(se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
            <li>
              <a className="contact-link" href={`mailto:${EMAIL}`}>
                <span className="contact-label">Correo</span>
                <span className="contact-value">{EMAIL}</span>
              </a>
              <CopyEmailButton email={EMAIL} />
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Hero
