import { useSyncExternalStore } from 'react'
import { equivalentHash, languageNames, locales, pagePaths } from '../routes.ts'
import { useSite } from './siteContext.ts'

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

/** Hash actual. El HTML prerenderizado no lo conoce: sin JavaScript, el selector lleva al principio de la página. */
function useHash() {
  return useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  )
}

/** Cambio a la misma página en el otro idioma, conservando la sección si allí existe. */
function LanguageSwitch() {
  const { page, text } = useSite()
  const hash = useHash()

  return (
    <nav className="language-switch" aria-label={text.languageSwitch.label}>
      <ul className="language-switch-list" role="list">
        {locales.map((locale) => (
          <li key={locale}>
            <a
              href={`${pagePaths[locale][page]}${equivalentHash(text.locale, locale, page, hash)}`}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === text.locale ? 'true' : undefined}
            >
              <span aria-hidden="true">{locale.toUpperCase()}</span>
              <span className="visually-hidden">{languageNames[locale]}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default LanguageSwitch
