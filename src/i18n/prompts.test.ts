import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { promptIds } from '../ids.ts'
import type { Locale } from '../routes.ts'
import { prompts as enPrompts } from './en/prompts.ts'
import { prompts as esPrompts } from './es/prompts.ts'

// Lo que todos deben pedir, según el encargo: contexto, restricciones, evidencia, hallazgos frente a
// hipótesis, prioridades y verificaciones concretas. Y lo específico de seguridad y de arquitectura.
const expectations: Record<Locale, { all: RegExp[]; security: RegExp[]; architecture: RegExp[]; order: [string, string] }> = {
  es: {
    all: [
      /## Contexto \(complétalo antes de enviar\)/,
      /Restricciones: \[/,
      /archivo y línea/,
      /hallazgos comprobados/i,
      /hipótesis/i,
      /Prioridades: crítica/,
      /verificar|volver a probarlo/,
      /Qué no pudiste (revisar|probar|auditar)/,
    ],
    security: [
      /no es una certificación de seguridad/,
      /Autorización en el servidor/,
      /Ocultar un botón o una ruta en el frontend no es control de acceso/,
      /no hay backend o no está completo/,
      /Qué no pudiste auditar y por qué/,
    ],
    architecture: [/Antes de recomendar infraestructura nueva/, /qué medir y cómo/],
    order: ['## Primero, las mediciones', '## Qué revisar'],
  },
  en: {
    all: [
      /## Context \(fill this in before sending\)/,
      /Constraints: \[/,
      /file and line/,
      /verified findings/i,
      /hypothes[ie]s/i,
      /Priorities: critical/,
      /verify|test it again/,
      /What you couldn't (review|test|audit)/,
    ],
    security: [
      /is not a security certification/,
      /Server-side authorization/,
      /Hiding a button or a route in the front end is not access control/,
      /no back end in the material or it's incomplete/,
      /What you couldn't audit and why/,
    ],
    architecture: [/Before recommending new infrastructure/, /what to measure and how/],
    order: ['## Measurements first', '## What to review'],
  },
}

const byLocale = { es: esPrompts, en: enPrompts }

for (const locale of ['es', 'en'] as const) {
  const prompts = byLocale[locale]
  const expected = expectations[locale]

  describe(`prompts gratuitos (${locale})`, () => {
    test('están los cuatro, completos', () => {
      assert.deepEqual(Object.keys(prompts).sort(), [...promptIds].sort())
      for (const id of promptIds) assert.ok(prompts[id].text.length > 2000, `${id} parece incompleto`)
    })

    for (const id of promptIds) {
      test(`«${prompts[id].title}» pide contexto, evidencia, prioridades y verificación`, () => {
        for (const pattern of expected.all) assert.match(prompts[id].text, pattern)
        assert.doesNotMatch(prompts[id].text, /\$\{/, 'quedó una interpolación sin resolver')
      })
    }

    test('el de seguridad no se presenta como certificación y exige autorización en el servidor', () => {
      for (const pattern of expected.security) assert.match(prompts.security.text, pattern)
    })

    test('el de arquitectura pide mediciones antes de recomendar infraestructura', () => {
      const text = prompts['architecture-performance'].text
      for (const pattern of expected.architecture) assert.match(text, pattern)
      const [measurements, review] = expected.order
      assert.ok(text.includes(measurements))
      assert.ok(text.indexOf(measurements) < text.indexOf(review), 'las mediciones deben pedirse antes de la revisión')
    })
  })
}

test('las dos versiones de cada prompt tienen la misma estructura de secciones y puntos', () => {
  const outline = (text: string) => text.split('\n').filter((line) => /^(## |\d+\. |- )/.test(line)).map((line) => line.match(/^(## |\d+\. |- )/)?.[0])
  for (const id of promptIds) {
    assert.deepEqual(outline(enPrompts[id].text), outline(esPrompts[id].text), id)
  }
})
