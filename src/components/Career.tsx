import { careerSteps } from '../data/career.ts'
import './Career.css'

function Career() {
  return (
    <section id="trayectoria" className="career theme-light" aria-labelledby="career-title">
      <div className="container career-layout">
        <header className="career-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">03</span> De la formación a hoy
          </p>
          <h2 id="career-title" className="career-title">
            Trayectoria
          </h2>
          <p className="section-intro">
            Me formé en FWD Costa Rica y trabajé dos años como Software Developer en Moovin Logistics. También tengo
            experiencia en procesos administrativos y soporte TI. Las fechas de formación son las de los certificados.
          </p>
        </header>

        <ol className="career-list" role="list">
          {careerSteps.map((step) => (
            <li key={step.id} className="career-step" data-reveal="">
              <p className="career-when">{step.when}</p>
              <div className="career-body">
                <p className="career-stage kicker">{step.stage}</p>
                <h3 className="career-step-title">{step.title}</h3>
                <p className="career-place">{step.place}</p>
                <p className="career-description">{step.description}</p>
                {step.link && (
                  <a className="text-link career-link" href={step.link.href}>
                    {step.link.label}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Career
