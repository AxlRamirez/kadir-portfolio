import { PREVIEW_HEIGHT, PREVIEW_WIDTH, type Project } from '../data/projects.ts'

export type ProjectVariant = 'feature' | 'split' | 'compact'

// Ancho aproximado que ocupa la captura en cada composición (ver Projects.css).
const previewSizes: Record<ProjectVariant, string> = {
  feature: '(min-width: 64rem) 66vw, 100vw',
  split: '(min-width: 64rem) 55vw, 100vw',
  compact: '(min-width: 48rem) 46vw, 100vw',
}

type ProjectEntryProps = {
  project: Project
  index: number
  total: number
  variant: ProjectVariant
}

function ProjectEntry({ project, index, total, variant }: ProjectEntryProps) {
  const number = String(index + 1).padStart(2, '0')
  const noteId = `${project.id}-note`
  const host = new URL(project.url).host

  return (
    <li className={`project project-${variant}`} data-reveal="">
      <div className="project-body">
        <p className="project-meta">
          <span className="project-number">
            {number}
            <span className="project-total"> / {String(total).padStart(2, '0')}</span>
          </span>
          <span>{project.kind}</span>
        </p>
        <h3 className="project-name">{project.name}</h3>
        {variant !== 'feature' && <p className="project-host">{host}</p>}
        <p className="project-description">{project.description}</p>
        <p className="project-context">{project.context}</p>
        {project.note && (
          <p id={noteId} className="project-note">
            <span className="project-note-label">Nota:</span> {project.note}
          </p>
        )}
        <a
          className={variant === 'feature' ? 'button project-link' : 'text-link project-link'}
          href={project.url}
          target="_blank"
          rel="noreferrer"
          aria-describedby={project.note ? noteId : undefined}
        >
          Visitar sitio
          <span className="visually-hidden">
            {' '}
            {project.name} (se abre en una pestaña nueva)
          </span>
          <span className="arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>

      <div className="project-preview">
        {variant === 'feature' && (
          <p className="project-frame-bar" aria-hidden="true">
            <span className="project-frame-dots" />
            <span className="project-frame-host">{host}</span>
          </p>
        )}
        {project.preview ? (
          <img
            src={project.preview.src}
            srcSet={project.preview.srcSet}
            sizes={previewSizes[variant]}
            alt={project.preview.alt}
            width={PREVIEW_WIDTH}
            height={PREVIEW_HEIGHT}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <p className="project-preview-pending">Vista previa pendiente</p>
        )}
      </div>
    </li>
  )
}

export default ProjectEntry
