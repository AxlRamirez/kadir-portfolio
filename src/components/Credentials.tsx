import { useRef, useState } from 'react'
import { credentialGroups, type Credential } from '../data/credentials.ts'
import CredentialViewer from './CredentialViewer.tsx'
import './Credentials.css'

// Las fechas se construyen en UTC para que la zona horaria del visitante no las mueva un día.
const dateFormatter = new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

function DateText({ iso }: { iso: string }) {
  const [year, month, day] = iso.split('-').map(Number)
  return <time dateTime={iso}>{dateFormatter.format(new Date(Date.UTC(year, month - 1, day)))}</time>
}

type CredentialEntryProps = {
  credential: Credential
  onOpen: (credential: Credential, trigger: HTMLButtonElement) => void
}

function CredentialEntry({ credential, onOpen }: CredentialEntryProps) {
  const { document, verification } = credential

  return (
    <li className="credential" data-reveal="">
      <p className="credential-kind">{credential.kind}</p>
      <h4 className="credential-title">
        {credential.title}
        {credential.acronym && <span className="credential-acronym"> {credential.acronym}</span>}
      </h4>
      <p className="credential-issuer">{credential.issuer}</p>

      {document ? (
        <button
          type="button"
          className="credential-document"
          onClick={(event) => onOpen(credential, event.currentTarget)}
        >
          <img src={document.src} alt="" width={document.width} height={document.height} loading="lazy" decoding="async" />
          <span className="credential-document-action">
            Ampliar<span className="visually-hidden"> el documento: {credential.title}</span>
          </span>
        </button>
      ) : (
        <p className="credential-document credential-document-missing" aria-hidden="true">
          <span className="credential-document-missing-label">Sin copia del documento</span>
          {credential.acronym && <span className="credential-document-missing-mark">{credential.acronym}</span>}
        </p>
      )}

      {credential.summary && <p className="credential-summary">{credential.summary}</p>}

      <dl className="credential-facts">
        {credential.period && (
          <div>
            <dt>Periodo</dt>
            <dd>
              <DateText iso={credential.period.start} /> – <DateText iso={credential.period.end} />
            </dd>
          </div>
        )}
        {credential.hours !== undefined && (
          <div>
            <dt>Duración</dt>
            <dd>{credential.hours} horas</dd>
          </div>
        )}
        {credential.issued && (
          <div>
            <dt>{credential.issued.label}</dt>
            <dd>
              <DateText iso={credential.issued.date} />
            </dd>
          </div>
        )}
        {credential.expires && (
          <div>
            <dt>Vence</dt>
            <dd>
              <DateText iso={credential.expires} />
            </dd>
          </div>
        )}
      </dl>

      {verification && (
        <a className="credential-verification" href={verification.href} target="_blank" rel="noreferrer">
          {verification.label} en {verification.source}
          <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
          <span className="credential-verification-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      )}
    </li>
  )
}

function Credentials() {
  const [openCredential, setOpenCredential] = useState<Credential | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const open = (credential: Credential, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setOpenCredential(credential)
  }

  // Devolver el foco al botón que abrió el documento: no todos los navegadores lo hacen al cerrar el diálogo.
  const close = () => {
    setOpenCredential(null)
    triggerRef.current?.focus()
  }

  return (
    <section id="formacion" className="credentials theme-light" aria-labelledby="credentials-title">
      <div className="container">
        <header className="section-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">05</span> Documentos
          </p>
          <h2 id="credentials-title" className="section-title credentials-title">
            Certificaciones <span className="credentials-title-tail">y formación</span>
          </h2>
          <p className="section-intro">
            Formación técnica, certificaciones y una constancia de experiencia profesional. Puedes ampliar cada
            documento para leerlo completo.
          </p>
        </header>

        <div className="credential-groups">
          {credentialGroups.map((group) => (
            <section
              key={group.id}
              id={`formacion-${group.id}`}
              className="credential-group"
              aria-labelledby={`credentials-${group.id}-title`}
            >
              <div className="credential-group-head">
                <h3 id={`credentials-${group.id}-title`} className="credential-group-title">
                  {group.title}
                </h3>
                <p className="credential-group-description">{group.description}</p>
              </div>
              <ol className="credential-list" role="list">
                {group.credentials.map((credential) => (
                  <CredentialEntry key={credential.id} credential={credential} onOpen={open} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>

      <CredentialViewer credential={openCredential} onClose={close} />
    </section>
  )
}

export default Credentials
