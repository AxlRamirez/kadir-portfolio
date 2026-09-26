import { careerSteps } from '../data/career.ts'
import type { HomeText } from '../i18n/types.ts'
import { sectionAnchors, sectionHref } from '../routes.ts'
import { useSite } from './siteContext.ts'
import './Career.css'

function Career({ text }: { text: HomeText['career'] }) {
  const { page, text: site } = useSite()

  return (
    <section id={sectionAnchors.career[site.locale]} className="career theme-light" aria-labelledby="career-title">
      <div className="container career-layout">
        <header className="career-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">02</span> {text.index}
          </p>
          <h2 id="career-title" className="career-title">
            {text.title}
          </h2>
          <p className="section-intro">{text.intro}</p>
        </header>

        <ol className="career-list" role="list">
          {careerSteps.map(({ id, link }) => {
            const step = text.items[id]
            return (
              <li key={id} className="career-step" data-reveal="">
                <p className="career-when">{step.when}</p>
                <div className="career-body">
                  <p className="career-stage kicker">{step.stage}</p>
                  <h3 className="career-step-title">{step.title}</h3>
                  <p className="career-place">{step.place}</p>
                  <p className="career-description">{step.description}</p>
                  {link && (
                    <a className="text-link career-link" href={sectionHref(site.locale, page, link)}>
                      {text.linkLabels[link]}
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export default Career
