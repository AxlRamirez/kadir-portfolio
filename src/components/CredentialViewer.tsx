import { useEffect, useRef } from 'react'
import type { Credential } from '../data/credentials.ts'

type CredentialViewerProps = {
  credential: Credential | null
  onClose: () => void
}

/**
 * Ampliación de un documento en un `<dialog>` modal nativo: `showModal()` deja inerte el resto de la página,
 * mantiene el foco dentro y cierra con Escape sin código adicional.
 */
function CredentialViewer({ credential, onClose }: CredentialViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const image = credential?.document

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
      {credential && image && (
        <div className="credential-viewer-inner">
          <header className="credential-viewer-header">
            <div>
              <p className="credential-viewer-kind">
                {credential.kind} · {credential.issuer}
              </p>
              <h3 id="credential-viewer-title" className="credential-viewer-title">
                {credential.title}
                {credential.acronym && <span className="credential-acronym"> {credential.acronym}</span>}
              </h3>
            </div>
            <button ref={closeRef} type="button" className="credential-viewer-close" onClick={close}>
              Cerrar
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <figure className="credential-viewer-figure">
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} />
            <figcaption className="credential-viewer-caption">
              {image.note && <span>{image.note}</span>}
              <a href={image.src} target="_blank" rel="noreferrer">
                Abrir la imagen en tamaño original
                <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
              </a>
            </figcaption>
          </figure>
        </div>
      )}
    </dialog>
  )
}

export default CredentialViewer
