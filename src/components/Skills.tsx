import { skillGroups } from '../data/skills.ts'
import './Skills.css'

function Skills() {
  return (
    <section id="habilidades" className="skills theme-wash" aria-labelledby="skills-title">
      <div className="container">
        <header className="skills-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">04</span> Stack técnico
          </p>
          <h2 id="skills-title" className="skills-title">
            Habilidades
          </h2>
          <p className="section-intro">Tecnologías con las que trabajo, agrupadas por la función que cumplen.</p>
        </header>

        <div className="skill-groups">
          {skillGroups.map((group) => (
            <section
              key={group.id}
              className="skill-group"
              aria-labelledby={`skills-${group.id}-title`}
              data-reveal=""
            >
              <p className="skill-group-count" aria-hidden="true">
                {String(group.skills.length).padStart(2, '0')}
              </p>
              <h3 id={`skills-${group.id}-title`} className="skill-group-title">
                {group.title}
              </h3>
              <p className="skill-group-description">{group.description}</p>
              <ul className="skill-list" role="list">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="skill">
                    <img
                      className="skill-icon"
                      src={skill.icon}
                      alt=""
                      width="24"
                      height="24"
                      loading="lazy"
                      decoding="async"
                    />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
