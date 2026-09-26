import FreePrompts from '../components/FreePrompts.tsx'
import Services from '../components/Services.tsx'
import SiteLayout from '../components/SiteLayout.tsx'
import type { ServicesText, SiteText } from '../i18n/types.ts'

/** «Mis servicios», en /servicios/ y /en/services/. */
function ServicesPage({ site, text }: { site: SiteText; text: ServicesText }) {
  return (
    <SiteLayout page="services" text={site}>
      <Services text={text.services} />
      <FreePrompts text={text.prompts} />
    </SiteLayout>
  )
}

export default ServicesPage
