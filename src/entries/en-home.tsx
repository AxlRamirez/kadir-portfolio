import { mount } from '../client.tsx'
import { home } from '../i18n/en/home.ts'
import { site } from '../i18n/en/site.ts'
import HomePage from '../pages/HomePage.tsx'

mount(<HomePage site={site} text={home} />)
