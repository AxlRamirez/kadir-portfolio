import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { EMAIL, emailHref, externalContacts, whatsappHref } from './contact.ts'

describe('whatsappHref', () => {
  test('sin mensaje conserva los enlaces de contacto de la portada', () => {
    const whatsapp = externalContacts.find((contact) => contact.label === 'WhatsApp')
    assert.equal(whatsapp?.href, 'https://wa.me/50662375946')
    assert.equal(whatsapp?.desktopHref, 'https://web.whatsapp.com/send?phone=50662375946')
  })

  test('codifica el mensaje inicial en los dos enlaces', () => {
    const { href, desktopHref } = whatsappHref('Hola, Kadir. ¿Sitio web?')
    const encoded = encodeURIComponent('Hola, Kadir. ¿Sitio web?')
    assert.equal(href, `https://wa.me/50662375946?text=${encoded}`)
    assert.equal(desktopHref, `https://web.whatsapp.com/send?phone=50662375946&text=${encoded}`)
  })
})

describe('emailHref', () => {
  test('añade el asunto codificado solo si se indica', () => {
    assert.equal(emailHref(), `mailto:${EMAIL}`)
    assert.equal(emailHref('Sistema web a medida'), `mailto:${EMAIL}?subject=Sistema%20web%20a%20medida`)
  })
})
