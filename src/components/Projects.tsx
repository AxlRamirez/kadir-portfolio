import { projects } from '../data/projects.ts'
import type { HomeText } from '../i18n/types.ts'
import { sectionAnchors } from '../routes.ts'
import ProjectEntry, { type ProjectVariant } from './ProjectEntry.tsx'
import { useSite } from './siteContext.ts'
import './Projects.css'

// El primero es el proyecto destacado, el segundo alterna la composición y el resto se presenta en pares.
function variantFor(index: number): ProjectVariant {
  if (index === 0) return 'feature'
  if (index === 1) return 'split'
  return 'compact'
}

function Projects({ text }: { text: HomeText['projects'] }) {
  const { text: site } = useSite()

  return (
    <section id={sectionAnchors.projects[site.locale]} className="projects theme-light" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">01</span> {text.index}
          </p>
          <h2 id="projects-title" className="section-title">
            {text.title}
          </h2>
          <p className="section-intro">{text.intro}</p>
        </header>

        <ol className="project-list" role="list">
          {projects.map((project, index) => (
            <ProjectEntry
              key={project.id}
              project={project}
              text={text}
              newTab={site.newTab}
              index={index}
              total={projects.length}
              variant={variantFor(index)}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Projects
