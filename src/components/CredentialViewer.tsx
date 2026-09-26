import { useEffect, useRef } from 'react'
import type { Credential } from '../data/credentials.ts'
import type { HomeText } from '../i18n/types.ts'
import type { Locale } from '../routes.ts'
import { useSite } from './siteContext.ts'

/** Título oficial con su sigla. Si está en otro idioma que la página, se marca para que se pronuncie bien. */
export function CredentialTitle({ credential, locale }: { credential: Credential; locale: Locale }) {
  return (
    <>
      <span lang={credential.titleLang === locale ? undefined : credential.titleLang}>{credential.title}</span>
      {credential.acronym && <span className="credential-acronym"> {credential.acronym}</span>}
    </>
  )
}

type CredentialViewerProps = {
  credential: Credential | null
  text: HomeText['credentials']
  onClose: () => void
}

/**
 * Ampliación de un documento en un `<dialog>` modal nativo: `showModal()` deja inerte el resto de la página,
 * mantiene el foco dentro y cierra con Escape sin código adicional.
 */
function CredentialViewer({ credential, text, onClose }: CredentialViewerProps) {
  const { locale, newTab } = useSite().text
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const image = credential?.document
  const item = credential ? text.items[credential.id] : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (image && !dialog.open) {
      dialog.showModal()
      closeRef.current?.focus()
    } else if (!image && dialog.open) {
      dialog.close()
    }
  }, [image])

  const close = () => dialogRef.current?.close()

  return (
    <dialog
      ref={dialogRef}
      className="credential-viewer"
      aria-labelledby="credential-viewer-title"
      onClose={onClose}
      // El contenido ocupa todo el diálogo, así que un clic sobre el propio elemento solo puede venir del fondo.
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      {credential && image && item && (
        <div className="credential-viewer-inner">
          <header className="credential-viewer-header">
            <div>
              <p className="credential-viewer-kind">
                {item.kind} · {item.issuer}
              </p>
              <h3 id="credential-viewer-title" className="credential-viewer-title">
                <CredentialTitle credential={credential} locale={locale} />
              </h3>
            </div>
            <button ref={closeRef} type="button" className="credential-viewer-close" onClick={close}>
              {text.viewer.close}
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <figure className="credential-viewer-figure">
            <img src={image.src} alt={item.documentAlt} width={image.width} height={image.height} />
            <figcaption className="credential-viewer-caption">
              {item.documentNote && <span>{item.documentNote}</span>}
              <a href={image.src} target="_blank" rel="noreferrer">
                {text.viewer.openOriginal}
                <span className="visually-hidden"> {newTab}</span>
              </a>
            </figcaption>
          </figure>
        </div>
      )}
    </dialog>
  )
}

export default CredentialViewer
