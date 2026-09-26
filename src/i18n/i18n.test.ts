import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { home as enHome } from './en/home.ts'
import { meta as enMeta } from './en/meta.ts'
import { services as enServices } from './en/services.ts'
import { site as enSite } from './en/site.ts'
import { home as esHome } from './es/home.ts'
import { meta as esMeta } from './es/meta.ts'
import { services as esServices } from './es/services.ts'
import { site as esSite } from './es/site.ts'

const dictionaries = [
  { name: 'site', es: esSite, en: enSite },
  { name: 'home', es: esHome, en: enHome },
  { name: 'services', es: esServices, en: enServices },
  { name: 'meta', es: esMeta, en: enMeta },
]

/** Todos los textos de un diccionario con su ruta. Las funciones se evalúan con valores de ejemplo. */
function strings(value: unknown, path = ''): { path: string; text: string }[] {
  if (typeof value === 'string') return [{ path, text: value }]
  if (typeof value === 'function') return [{ path, text: String(value('Sample', 'Source')) }]
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => strings(item, path ? `${path}.${key}` : key))
  }
  return []
}

/** Estructura de un diccionario: claves, longitud de las listas y tipo de cada valor, sin el texto. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
  }
  return value === null ? 'null' : typeof value
}

describe('traducciones', () => {
  // Los tipos exigen las mismas claves; esto además compara listas y valores nulos, que los tipos no ven.
  for (const { name, es, en } of dictionaries) {
    test(`«${name}» tiene la misma estructura en los dos idiomas`, () => {
      const { locale: esLocale, ...esRest } = es as Record<string, unknown>
      const { locale: enLocale, ...enRest } = en as Record<string, unknown>
      assert.equal(typeof esLocale, typeof enLocale)
      const exceptions = (value: unknown) => {
        const copy = structuredClone(shape(value)) as Record<string, unknown>
        // Solo el inglés traduce el título oficial en español de un certificado.
        const items = (copy.credentials as { items?: Record<string, { titleTranslation?: unknown }> })?.items
        if (items) for (const item of Object.values(items)) delete item.titleTranslation
        return copy
      }
      assert.deepEqual(exceptions(enRest), exceptions(esRest))
    })
  }

  test('ningún texto está vacío', () => {
    for (const { name, es, en } of dictionaries) {
      for (const { path, text } of [...strings(es), ...strings(en)]) {
        assert.ok(text.trim().length > 0, `${name}.${path} está vacío`)
      }
    }
  })

  /* El inglés solo cita español entre comillas “…” (títulos oficiales y textos de las capturas), seguido de
     su traducción. Fuera de las comillas no puede quedar español, salvo el nombre propio del titular. */
  test('la versión en inglés no mezcla texto en español fuera de las citas', () => {
    const spanish = /[áéíóúñü¿¡«»]|\b(el|la|los|las|del|para|con|una|que|por|y|de|en|sobre)\b/i
    for (const { name, en } of dictionaries) {
      for (const { path, text } of strings(en)) {
        if (path === 'locale' || path === 'formatLocale') continue
        const outsideQuotes = text.replace(/“[^”]*”/g, '').replace(/Ramírez|Rodríguez/g, '')
        assert.doesNotMatch(outsideQuotes, spanish, `${name}.${path}: ${text}`)
      }
    }
  })

  test('los mensajes de WhatsApp y los asuntos de correo siguen el idioma de la página', () => {
    const es = Object.values(esServices.services.items)
    const en = Object.values(enServices.services.items)
    for (const service of es) assert.match(service.whatsappMessage, /^Hola, Kadir\./)
    for (const service of en) assert.match(service.whatsappMessage, /^Hi Kadir,/)
    assert.deepEqual(
      en.map((service) => service.emailSubject),
      ['Website or landing page', 'Custom web system'],
    )
  })

  test('solo el sitio web tiene un rango de precio; el sistema a medida se cotiza después de conversar', () => {
    for (const { services } of [esServices, enServices]) {
      assert.equal(services.items.websites.price.value, 'US$350–500')
      assert.doesNotMatch(services.items['custom-systems'].price.value, /\d/)
    }
    assert.match(esServices.services.items['custom-systems'].summary, /Primero conversamos sobre los requisitos/)
    assert.match(enServices.services.items['custom-systems'].summary, /We talk through the requirements first/)
  })
})
