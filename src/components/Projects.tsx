import { projects } from '../data/projects.ts'
import ProjectEntry, { type ProjectVariant } from './ProjectEntry.tsx'
import './Projects.css'

// El primero es el proyecto destacado, el segundo alterna la composición y el resto se presenta en pares.
function variantFor(index: number): ProjectVariant {
  if (index === 0) return 'feature'
  if (index === 1) return 'split'
  return 'compact'
}

function Projects() {
  return (
    <section id="proyectos" className="projects theme-light" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">01</span> Trabajo publicado
          </p>
          <h2 id="projects-title" className="section-title">
            Proyectos
          </h2>
          <p className="section-intro">
            Una selección de sitios y aplicaciones publicados. Cada uno enlaza a su versión en línea. Después de los
            proyectos hay un <a href="#laboratorio">laboratorio de datos</a> que puedes probar aquí mismo.
          </p>
        </header>

        <ol className="project-list" role="list">
          {projects.map((project, index) => (
            <ProjectEntry
              key={project.id}
              project={project}
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
