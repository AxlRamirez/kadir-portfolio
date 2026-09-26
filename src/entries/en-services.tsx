import { mount } from '../client.tsx'
import { services } from '../i18n/en/services.ts'
import { site } from '../i18n/en/site.ts'
import ServicesPage from '../pages/ServicesPage.tsx'

mount(<ServicesPage site={site} text={services} />)
