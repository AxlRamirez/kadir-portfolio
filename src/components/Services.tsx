import { emailHref, whatsappHref } from '../data/contact.ts'
import { serviceIds, type ServiceId } from '../ids.ts'
import type { ServicesText, ServiceText } from '../i18n/types.ts'
import { sectionAnchors, serviceAnchors } from '../routes.ts'
import { useSite } from './siteContext.ts'
import { useContactHref } from './useFinePointer.ts'
import './Services.css'

type SectionText = ServicesText['services']

function ServiceContact({ service, text }: { service: ServiceText; text: SectionText }) {
  const { newTab } = useSite().text
  const whatsapp = useContactHref(whatsappHref(service.whatsappMessage))
  const topic = text.topicContext(service.contactTopic)

  return (
    <div className="service-contact">
      <a className="button" href={whatsapp} target="_blank" rel="noreferrer">
        {text.whatsapp}
        <span className="visually-hidden">{`${topic} ${newTab}`}</span>
        <span className="arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <a className="text-link" href={emailHref(service.emailSubject)}>
        {text.email}
        <span className="visually-hidden">{topic}</span>
      </a>
    </div>
  )
}

/* El alcance va en un <details>: sin JavaScript se abre igual, y el navegador anuncia si está abierto o
   cerrado. La etiqueta visible cambia con CSS; el título del servicio, oculto, da contexto al lector de
   pantalla. Dentro del <summary> no hay nada interactivo: el contacto queda fuera, siempre visible. */
function ServiceDetails({ service, text }: { service: ServiceText; text: SectionText }) {
  return (
    <details className="service-details disclosure">
      <summary>
        <span className="disclosure-label-closed">{text.detailsOpen}</span>
        <span className="disclosure-label-open">{text.detailsClose}</span>
        <span className="visually-hidden">: {service.title}</span>
      </summary>

      <div className="service-detail">
        {service.lists.map((list) => (
          <div key={list.title} className="service-scope" data-tone={list.tone}>
            <h4 className="service-detail-title">{list.title}</h4>
            <ul role="list">
              {list.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        {service.steps && (
          <div className="service-scope">
            <h4 className="service-detail-title">{service.steps.title}</h4>
            <ol className="service-steps" role="list">
              {service.steps.items.map((step, stepIndex) => (
                <li key={step.title}>
                  <span className="service-step-number" aria-hidden="true">
                    {String(stepIndex + 1).padStart(2, '0')}
                  </span>
                  <p className="service-step-title">{step.title}</p>
                  <p className="service-step-description">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </details>
  )
}

function ServiceEntry({ id, text, index }: { id: ServiceId; text: SectionText; index: number }) {
  const { locale } = useSite().text
  const service = text.items[id]
  const anchor = serviceAnchors[id][locale]

  return (
    <li id={anchor} className="service" data-reveal="">
      <div className="service-lead">
        <p className="service-number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 id={`${anchor}-title`} className="service-title">
          {service.title}
        </h3>
        <p className="service-summary">{service.summary}</p>
      </div>

      <div className="service-body">
        <dl className="service-price">
          <dt>{service.price.label}</dt>
          <dd className="service-price-value">{service.price.value}</dd>
          <dd className="service-price-note">{service.price.note}</dd>
        </dl>
        <ServiceContact service={service} text={text} />
        <ServiceDetails service={service} text={text} />
      </div>
    </li>
  )
}

function Services({ text }: { text: SectionText }) {
  const { locale } = useSite().text

  return (
    <section id={sectionAnchors.services[locale]} className="services theme-light" aria-labelledby="services-title">
      <div className="container">
        <header className="section-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">01</span> {text.index}
          </p>
          <h2 id="services-title" className="section-title">
            {text.title}
          </h2>
          <p className="section-intro">{text.intro}</p>
        </header>

        <ol className="service-list" role="list">
          {serviceIds.map((id, index) => (
            <ServiceEntry key={id} id={id} text={text} index={index} />
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Services
