import Career from '../components/Career.tsx'
import Credentials from '../components/Credentials.tsx'
import Projects from '../components/Projects.tsx'
import SiteLayout from '../components/SiteLayout.tsx'
import Skills from '../components/Skills.tsx'
import type { HomeText, SiteText } from '../i18n/types.ts'

/** «Conocerme», en / y /en/. */
function HomePage({ site, text }: { site: SiteText; text: HomeText }) {
  return (
    <SiteLayout page="home" text={site}>
      <Projects text={text.projects} />
      <Career text={text.career} />
      <Skills text={text.skills} />
      <Credentials text={text.credentials} />
    </SiteLayout>
  )
}

export default HomePage
