import { useRef, useState } from 'react'
import { credentialGroups, type Credential } from '../data/credentials.ts'
import type { HomeText } from '../i18n/types.ts'
import { credentialAnchor, credentialGroupAnchors, sectionAnchors } from '../routes.ts'
import CredentialViewer, { CredentialTitle } from './CredentialViewer.tsx'
import { formatDate, useSite } from './siteContext.ts'
import './Credentials.css'

type CredentialsText = HomeText['credentials']

function DateText({ iso }: { iso: string }) {
  const { formatLocale } = useSite().text
  return <time dateTime={iso}>{formatDate(iso, formatLocale, 'short')}</time>
}

type CredentialEntryProps = {
  credential: Credential
  text: CredentialsText
  onOpen: (credential: Credential, trigger: HTMLButtonElement) => void
}

function CredentialEntry({ credential, text, onOpen }: CredentialEntryProps) {
  const { locale, newTab } = useSite().text
  const { document, verification } = credential
  const item = text.items[credential.id]

  return (
    <li id={credentialAnchor(locale, credential.id)} className="credential" data-reveal="">
      <p className="credential-kind">{item.kind}</p>
      <h4 className="credential-title">
        <CredentialTitle credential={credential} locale={locale} />
        {item.titleTranslation && <span className="credential-translation">{item.titleTranslation}</span>}
      </h4>
      <p className="credential-issuer">{item.issuer}</p>

      {document ? (
        <button
          type="button"
          className="credential-document"
          onClick={(event) => onOpen(credential, event.currentTarget)}
        >
          <img src={document.src} alt="" width={document.width} height={document.height} loading="lazy" decoding="async" />
          <span className="credential-document-action">
            {text.enlarge}
            <span className="visually-hidden">
              {text.enlargeContext}
              <CredentialTitle credential={credential} locale={locale} />
            </span>
          </span>
        </button>
      ) : (
        <p className="credential-document credential-document-missing" aria-hidden="true">
          <span className="credential-document-missing-label">{text.missingDocument}</span>
          {credential.acronym && <span className="credential-document-missing-mark">{credential.acronym}</span>}
        </p>
      )}

      {item.summary && <p className="credential-summary">{item.summary}</p>}

      <dl className="credential-facts">
        {credential.period && (
          <div>
            <dt>{text.facts.period}</dt>
            <dd>
              <DateText iso={credential.period.start} /> – <DateText iso={credential.period.end} />
            </dd>
          </div>
        )}
        {credential.hours !== undefined && (
          <div>
            <dt>{text.facts.duration}</dt>
            <dd>{text.facts.hours(credential.hours)}</dd>
          </div>
        )}
        {credential.issued && (
          <div>
            <dt>{item.issuedLabel}</dt>
            <dd>
              <DateText iso={credential.issued} />
            </dd>
          </div>
        )}
        {credential.expires && (
          <div>
            <dt>{text.facts.expires}</dt>
            <dd>
              <DateText iso={credential.expires} />
            </dd>
          </div>
        )}
      </dl>

      {verification && item.verificationLabel && (
        <a className="credential-verification" href={verification.href} target="_blank" rel="noreferrer">
          {text.verification(item.verificationLabel, verification.source)}
          <span className="visually-hidden"> {newTab}</span>
          <span className="credential-verification-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      )}
    </li>
  )
}

function Credentials({ text }: { text: CredentialsText }) {
  const { locale } = useSite().text
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
    <section id={sectionAnchors.education[locale]} className="credentials theme-light" aria-labelledby="credentials-title">
      <div className="container">
        <header className="section-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">04</span> {text.index}
          </p>
          <h2 id="credentials-title" className="section-title credentials-title">
            {text.title} <span className="credentials-title-tail">{text.titleTail}</span>
          </h2>
          <p className="section-intro">{text.intro}</p>
        </header>

        <div className="credential-groups">
          {credentialGroups.map((group) => (
            <section
              key={group.id}
              id={credentialGroupAnchors[group.id][locale]}
              className="credential-group"
              aria-labelledby={`credentials-${group.id}-title`}
            >
              <div className="credential-group-head">
                <h3 id={`credentials-${group.id}-title`} className="credential-group-title">
                  {text.groups[group.id].title}
                </h3>
                <p className="credential-group-description">{text.groups[group.id].description}</p>
              </div>
              <ol className="credential-list" role="list">
                {group.credentials.map((credential) => (
                  <CredentialEntry key={credential.id} credential={credential} text={text} onOpen={open} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>

      <CredentialViewer credential={openCredential} text={text} onClose={close} />
    </section>
  )
}

export default Credentials
