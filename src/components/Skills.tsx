import { skillGroups } from '../data/skills.ts'
import type { HomeText } from '../i18n/types.ts'
import { credentialAnchor, sectionAnchors } from '../routes.ts'
import { useSite } from './siteContext.ts'
import './Skills.css'

function Skills({ text }: { text: HomeText['skills'] }) {
  const { locale } = useSite().text

  return (
    <section id={sectionAnchors.skills[locale]} className="skills theme-wash" aria-labelledby="skills-title">
      <div className="container">
        <header className="skills-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">03</span> {text.index}
          </p>
          <h2 id="skills-title" className="skills-title">
            {text.title}
          </h2>
          <p className="section-intro">{text.intro}</p>
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
                {text.groups[group.id].title}
              </h3>
              <p className="skill-group-description">{text.groups[group.id].description}</p>
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

        <aside className="skills-note" aria-labelledby="skills-ai-title" data-reveal="">
          <h3 id="skills-ai-title" className="skills-note-title">
            {text.ai.title}
          </h3>
          <p className="skills-note-text">
            {text.ai.text.before}
            <strong>{text.ai.text.strong}</strong>
            {text.ai.text.after}
          </p>
          <a className="text-link skills-note-link" href={`#${credentialAnchor(locale, 'elements-of-ai')}`}>
            {text.ai.link}
            <span className="arrow" aria-hidden="true">
              ↓
            </span>
          </a>
        </aside>
      </div>
    </section>
  )
}

export default Skills
