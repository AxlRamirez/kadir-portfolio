import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { decodeUtf8File } from './encoding.ts'
import { readSalesFile } from './pipeline.ts'

const HEADER = 'fecha,producto,cantidad,precio_unitario\n'
const utf8 = (text: string) => new TextEncoder().encode(text)
const concat = (...parts: (Uint8Array | number[])[]) => new Uint8Array(parts.flatMap((part) => [...part]))

describe('política de codificación UTF-8', () => {
  it('acepta UTF-8 con tildes, con y sin BOM', () => {
    const csv = `${HEADER}2026-03-02,Café,1,10\n`
    for (const bytes of [utf8(csv), concat([0xef, 0xbb, 0xbf], utf8(csv))]) {
      const result = readSalesFile(bytes)
      assert.ok(result.ok)
      assert.equal(result.records[0].product, 'Café')
    }
  })

  it('rechaza un archivo en Windows-1252 en lugar de analizar «Caf�», e indica la línea', () => {
    // 0xE9 es «é» en Windows-1252/Latin-1, pero un byte inválido en UTF-8.
    const bytes = concat(utf8(`${HEADER}2026-03-02,Té,1,10\n2026-03-03,Caf`), [0xe9], utf8(',1,10\n'))
    const result = readSalesFile(bytes)
    assert.equal(result.ok, false)
    const [issue] = result.ok ? [] : result.issues
    assert.equal(issue.line, 3)
    assert.match(issue.value ?? '', /Caf\uFFFD/)
    assert.match(issue.message, /UTF-8/)
  })

  it('cuenta las demás líneas dañadas sin repetir el error por cada una', () => {
    const bytes = concat(utf8(HEADER), utf8('2026-03-02,Caf'), [0xe9], utf8(',1,10\n2026-03-03,Pi'), [0xf1], utf8('a,1,10\n'))
    const result = decodeUtf8File(bytes)
    assert.equal(result.ok, false)
    assert.equal(!result.ok ? result.line : 0, 2)
    assert.match(!result.ok ? result.message : '', /1 línea más/)
  })

  it('rechaza texto que ya contenía el carácter de reemplazo', () => {
    const result = decodeUtf8File(utf8(`${HEADER}2026-03-02,Caf\uFFFD,1,10\n`))
    assert.equal(result.ok, false)
  })

  it('reconoce UTF-16 por su marca y pide guardarlo como CSV UTF-8, sin intentar decodificarlo', () => {
    const result = decodeUtf8File(new Uint8Array([0xff, 0xfe, 0x66, 0x00]))
    assert.equal(result.ok, false)
    assert.deepEqual(!result.ok ? [result.line, /UTF-16/.test(result.message)] : [], [null, true])
  })

  it('ubica la línea física aunque el texto dañado esté dentro de un campo de varias líneas', () => {
    const bytes = concat(utf8(`${HEADER}2026-03-02,"Galletas\nde av`), [0xe9], utf8('na",1,10\n'))
    const result = readSalesFile(bytes)
    assert.equal(result.ok ? 0 : result.issues[0].line, 3)
  })
})
