import { PREVIEW_HEIGHT, PREVIEW_WIDTH, type Project } from '../data/projects.ts'
import type { HomeText } from '../i18n/types.ts'

export type ProjectVariant = 'feature' | 'split' | 'compact'

// Ancho aproximado que ocupa la captura en cada composición (ver Projects.css).
const previewSizes: Record<ProjectVariant, string> = {
  feature: '(min-width: 64rem) 66vw, 100vw',
  split: '(min-width: 64rem) 55vw, 100vw',
  compact: '(min-width: 48rem) 46vw, 100vw',
}

type ProjectEntryProps = {
  project: Project
  text: HomeText['projects']
  newTab: string
  index: number
  total: number
  variant: ProjectVariant
}

function ProjectEntry({ project, text, newTab, index, total, variant }: ProjectEntryProps) {
  const number = String(index + 1).padStart(2, '0')
  const noteId = `${project.id}-note`
  const host = new URL(project.url).host
  const { name, kind, description, context, note, previewAlt } = text.items[project.id]

  return (
    <li className={`project project-${variant}`} data-reveal="">
      <div className="project-body">
        <p className="project-meta">
          <span className="project-number">
            {number}
            <span className="project-total"> / {String(total).padStart(2, '0')}</span>
          </span>
          <span>{kind}</span>
        </p>
        <h3 className="project-name">{name}</h3>
        {variant !== 'feature' && <p className="project-host">{host}</p>}
        <p className="project-description">{description}</p>
        <p className="project-context">{context}</p>
        {note && (
          <p id={noteId} className="project-note">
            <span className="project-note-label">{text.noteLabel}</span> {note}
          </p>
        )}
        <a
          className={variant === 'feature' ? 'button project-link' : 'text-link project-link'}
          href={project.url}
          target="_blank"
          rel="noreferrer"
          aria-describedby={note ? noteId : undefined}
        >
          {text.visit}
          <span className="visually-hidden">{` ${name} ${newTab}`}</span>
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
            alt={previewAlt}
            width={PREVIEW_WIDTH}
            height={PREVIEW_HEIGHT}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <p className="project-preview-pending">{text.previewPending}</p>
        )}
      </div>
    </li>
  )
}

export default ProjectEntry
