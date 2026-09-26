import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { anchors, equivalentHash, locales, pagePaths, routes, sectionHref } from './routes.ts'

describe('sectionHref', () => {
  test('usa solo el hash cuando la sección está en la página actual', () => {
    assert.equal(sectionHref('es', 'home', 'projects'), '#proyectos')
    assert.equal(sectionHref('es', 'services', 'services'), '#servicios')
    assert.equal(sectionHref('en', 'home', 'projects'), '#projects')
    assert.equal(sectionHref('en', 'services', 'services'), '#services')
  })

  test('desde Servicios, las secciones de inicio apuntan a la portada del mismo idioma', () => {
    assert.deepEqual(
      (['projects', 'career', 'skills', 'education'] as const).map((section) => sectionHref('es', 'services', section)),
      ['/#proyectos', '/#trayectoria', '/#habilidades', '/#formacion'],
    )
    assert.deepEqual(
      (['projects', 'career', 'skills', 'education'] as const).map((section) => sectionHref('en', 'services', section)),
      ['/en/#projects', '/en/#career', '/en/#skills', '/en/#education'],
    )
  })

  test('desde inicio, las secciones de Servicios apuntan a la página de servicios del mismo idioma', () => {
    assert.equal(sectionHref('es', 'home', 'services'), '/servicios/#servicios')
    assert.equal(sectionHref('en', 'home', 'services'), '/en/services/#services')
  })

  test('los bloques comunes, como el contacto, se enlazan en la página actual', () => {
    assert.equal(sectionHref('es', 'services', 'contact'), '#contacto')
    assert.equal(sectionHref('en', 'home', 'contact'), '#contact')
  })
})

describe('equivalentHash', () => {
  test('traduce las secciones y los elementos que existen en la página equivalente', () => {
    assert.equal(equivalentHash('es', 'en', 'home', '#proyectos'), '#projects')
    assert.equal(equivalentHash('en', 'es', 'home', '#education'), '#formacion')
    assert.equal(equivalentHash('es', 'en', 'home', '#credencial-elements-of-ai'), '#credential-elements-of-ai')
    assert.equal(equivalentHash('es', 'en', 'services', '#servicio-sitios-web'), '#service-websites')
    assert.equal(equivalentHash('en', 'es', 'services', '#prompt-security'), '#prompt-seguridad')
    assert.equal(equivalentHash('es', 'en', 'services', '#contacto'), '#contact')
  })

  test('el mismo idioma conserva el hash', () => {
    assert.equal(equivalentHash('es', 'es', 'services', '#prompts'), '#prompts')
  })

  test('sin equivalente devuelve un hash vacío, que lleva al principio de la página', () => {
    assert.equal(equivalentHash('es', 'en', 'home', '#laboratorio'), '')
    assert.equal(equivalentHash('es', 'en', 'home', ''), '')
    // La sección existe, pero en la otra página.
    assert.equal(equivalentHash('es', 'en', 'services', '#proyectos'), '')
    assert.equal(equivalentHash('en', 'es', 'home', '#prompt-security'), '')
  })

  test('#top se conserva: los navegadores lo tratan como el principio del documento', () => {
    assert.equal(equivalentHash('en', 'es', 'home', '#top'), '#top')
  })
})

describe('rutas y anclas', () => {
  // El prerender escribe cada página en dist{path}index.html y los hosts estáticos sirven esa carpeta.
  test('cada ruta empieza y termina con barra, y no se repite', () => {
    const paths = routes.map((route) => route.path)
    for (const path of paths) assert.match(path, /^\/([a-z-]+\/)*$/)
    assert.equal(new Set(paths).size, paths.length)
    assert.equal(routes.length, 4)
  })

  test('las rutas en inglés cuelgan de /en/ y las españolas no llevan prefijo', () => {
    assert.deepEqual(pagePaths.es, { home: '/', services: '/servicios/' })
    assert.deepEqual(pagePaths.en, { home: '/en/', services: '/en/services/' })
  })

  test('las anclas de cada idioma son únicas y válidas como id', () => {
    for (const locale of locales) {
      const ids = anchors.map((anchor) => anchor[locale])
      for (const id of ids) assert.match(id, /^[a-z][a-z0-9-]*$/)
      assert.equal(new Set(ids).size, ids.length, `anclas repetidas en ${locale}`)
    }
  })
})
