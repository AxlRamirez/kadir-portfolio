import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { readFileBytes } from './fileReading.ts'

describe('readFileBytes', () => {
  it('devuelve los bytes cuando la lectura funciona', async () => {
    const content = new TextEncoder().encode('fecha,producto\n')
    const result = await readFileBytes({ name: 'ventas.csv', arrayBuffer: async () => content.buffer })
    assert.ok(result.ok)
    assert.deepEqual([...result.bytes], [...content])
  })

  it('convierte el rechazo de arrayBuffer() en un mensaje comprensible con el nombre del archivo', async () => {
    for (const error of [
      new DOMException('El archivo cambió', 'NotReadableError'),
      new DOMException('No existe', 'NotFoundError'),
      new Error('fallo inesperado'),
    ]) {
      const result = await readFileBytes({ name: 'ventas.csv', arrayBuffer: () => Promise.reject(error) })
      assert.equal(result.ok, false)
      assert.match(result.ok ? '' : result.message, /No se pudo leer «ventas\.csv».*Vuelve a elegirlo\./)
    }
  })
})
