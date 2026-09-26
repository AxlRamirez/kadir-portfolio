import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { headTags } from './head.ts'
import { routes, type Route } from './routes.ts'

const route = (locale: Route['locale'], page: Route['page']) => {
  const found = routes.find((candidate) => candidate.locale === locale && candidate.page === page)
  assert.ok(found)
  return found
}

const alternates = (tags: ReturnType<typeof headTags>) =>
  Object.fromEntries(
    tags.filter((tag) => tag.attrs?.rel === 'alternate').map((tag) => [tag.attrs?.hreflang, tag.attrs?.href]),
  )

describe('headTags', () => {
  test('cada ruta tiene un título y una descripción propios', () => {
    const titles = routes.map((candidate) => headTags(candidate).find((tag) => tag.tag === 'title')?.text)
    const descriptions = routes.map(
      (candidate) => headTags(candidate).find((tag) => tag.attrs?.name === 'description')?.attrs?.content,
    )
    for (const value of [...titles, ...descriptions]) assert.ok(value && value.length > 10)
    assert.equal(new Set(titles).size, routes.length)
    assert.equal(new Set(descriptions).size, routes.length)
  })

  test('enlaza la misma página en cada idioma, con el español como opción por defecto', () => {
    const expected = { es: '/servicios/', en: '/en/services/', 'x-default': '/servicios/' }
    assert.deepEqual(alternates(headTags(route('es', 'services'))), expected)
    assert.deepEqual(alternates(headTags(route('en', 'services'))), expected)
    assert.deepEqual(alternates(headTags(route('en', 'home'))), { es: '/', en: '/en/', 'x-default': '/' })
  })

  test('sin dominio configurado no hay URL canónica', () => {
    for (const candidate of routes) {
      assert.equal(
        headTags(candidate).some((tag) => tag.attrs?.rel === 'canonical'),
        false,
      )
    }
  })

  test('con dominio, la canónica y los enlaces entre idiomas son absolutos', () => {
    const tags = headTags(route('en', 'services'), 'https://ejemplo.test')
    assert.equal(tags.find((tag) => tag.attrs?.rel === 'canonical')?.attrs?.href, 'https://ejemplo.test/en/services/')
    assert.equal(alternates(tags).es, 'https://ejemplo.test/servicios/')
  })
})
