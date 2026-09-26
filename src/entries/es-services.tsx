import { mount } from '../client.tsx'
import { services } from '../i18n/es/services.ts'
import { site } from '../i18n/es/site.ts'
import ServicesPage from '../pages/ServicesPage.tsx'

mount(<ServicesPage site={site} text={services} />)
