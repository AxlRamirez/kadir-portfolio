import { useEffect, useState, type CSSProperties } from 'react'
import { EMAIL, emailHref, externalContacts } from '../data/contact.ts'
import { PREVIEW_HEIGHT, PREVIEW_WIDTH, projects } from '../data/projects.ts'
import type { Emphasis, SiteText } from '../i18n/types.ts'
import { pageIds, pagePaths, sectionAnchors, sectionHref, type PageId, type SectionKey } from '../routes.ts'
import { useSite } from './siteContext.ts'
import { useFinePointer } from './useFinePointer.ts'
import './Hero.css'

type CopyState = 'idle' | 'copied' | 'failed'

// Copiar es útil cuando el equipo no tiene un cliente de correo configurado y mailto: no abre nada.
function CopyEmailButton({ email, labels }: { email: string; labels: SiteText['hero']['copyEmail'] }) {
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

  const status = { idle: '', copied: labels.copiedStatus, failed: labels.failedStatus }[state]

  return (
    <>
      <button type="button" className="copy-button" data-state={state} onClick={copyEmail}>
        {labels[state]}
      </button>
      <span className="visually-hidden" role="status">
        {status}
      </span>
    </>
  )
}

// Cada página cambia el texto y las acciones; el nombre, el mazo, los datos breves y el contacto son comunes.
const heroActions: Record<PageId, { primary: SectionKey; secondary: SectionKey }> = {
  home: { primary: 'projects', secondary: 'career' },
  services: { primary: 'services', secondary: 'prompts' },
}

function Emphasized({ value }: { value: Emphasis }) {
  return (
    <>
      {value.before}
      <strong>{value.strong}</strong>
      {value.after}
    </>
  )
}

/** Cambio entre las dos páginas del sitio; la actual se marca con aria-current. */
function PageSwitch() {
  const { page, text } = useSite()

  return (
    <nav className="hero-pages" aria-label={text.pageSwitch.label}>
      <ul className="hero-pages-list" role="list">
        {pageIds.map((id) => (
          <li key={id}>
            <a href={pagePaths[text.locale][id]} aria-current={id === page ? 'page' : undefined}>
              {text.pageSwitch.pages[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// La composición del mazo (Hero.css) está pensada para cuatro cartas.
const deckProjects = projects.filter((project) => project.preview).slice(0, 4)
const projectCount = String(projects.length).padStart(2, '0')

/* Las capturas reales de los proyectos, apiladas en cascada hacia abajo, como un avance de la sección.
   Es un atajo para el ratón: el teclado y los lectores de pantalla usan el botón «Ver proyectos» o el menú,
   que llevan al mismo sitio, así que el mazo queda fuera del orden de tabulación y del árbol accesible.
   Solo la carta de arriba se ve entera en la primera pantalla; las demás están tapadas en parte y cargan
   después de maquetar para no competir en el móvil con la fuente y el JavaScript. */
function WorkDeck() {
  const { page, text } = useSite()

  return (
    <a className="work-deck" href={sectionHref(text.locale, page, 'projects')} tabIndex={-1} aria-hidden="true">
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
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'auto' : 'low'}
            />
          </span>
        ))}
      </span>
      <span className="work-deck-caption">
        <span className="work-deck-count">{projectCount}</span> {text.hero.deckCaption}
        <span className="arrow">{page === 'home' ? '↓' : '→'}</span>
      </span>
    </a>
  )
}

function Hero() {
  const { page, text } = useSite()
  const { locale, hero } = text
  const finePointer = useFinePointer()
  const copy = hero.pages[page]
  const actions = heroActions[page]

  return (
    <section className="hero theme-dark" aria-labelledby="hero-title" data-page={page}>
      <div className="container hero-grid">
        <PageSwitch />

        <p className="hero-eyebrow kicker">{hero.eyebrow}</p>

        <h1 id="hero-title" className="hero-title">
          <span className="hero-title-line">Kadir</span>{' '}
          <span className="hero-title-line">Ramírez</span>
        </h1>

        <p className="hero-lead">
          {copy.lead.before}
          <span className="hero-lead-key">{copy.lead.key}</span>
          {copy.lead.after}
        </p>

        <p className="hero-sub">{copy.sub}</p>

        <div className="hero-actions">
          <a className="button hero-cta" href={sectionHref(locale, page, actions.primary)}>
            {copy.primary}
            <span className="arrow" aria-hidden="true">
              ↓
            </span>
          </a>
          <a className="text-link" href={sectionHref(locale, page, actions.secondary)}>
            {copy.secondary}
          </a>
        </div>

        <div className="hero-work">
          <WorkDeck />
        </div>

        <dl className="hero-facts">
          {(['now', 'before'] as const).map((key) => (
            <div key={key} className="hero-fact">
              <dt>{hero.facts[key].label}</dt>
              <dd>
                <Emphasized value={hero.facts[key].text} />
              </dd>
            </div>
          ))}
        </dl>

        <div id={sectionAnchors.contact[locale]} className="hero-contact">
          <h2 className="hero-contact-title kicker">{hero.contactTitle}</h2>
          <ul className="contact-list" role="list">
            {externalContacts.map((contact) => (
              <li key={contact.label}>
                <a
                  className="contact-link"
                  href={(finePointer && contact.desktopHref) || contact.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-label">{contact.label}</span>
                  <span className="contact-value">{contact.value}</span>
                  <span className="contact-arrow arrow" aria-hidden="true">
                    ↗
                  </span>
                  <span className="visually-hidden">{text.newTab}</span>
                </a>
              </li>
            ))}
            <li>
              <a className="contact-link" href={emailHref()}>
                <span className="contact-label">{hero.emailLabel}</span>
                <span className="contact-value">{EMAIL}</span>
              </a>
              <CopyEmailButton email={EMAIL} labels={hero.copyEmail} />
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Hero
