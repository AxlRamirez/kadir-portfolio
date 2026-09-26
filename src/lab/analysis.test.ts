import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { analyzeSales, quantityByDate, summarizeByDate } from './analysis.ts'
import { readSalesCsv } from './pipeline.ts'
import { SAMPLE_CSV } from './sampleData.ts'
import type { SaleRecord } from './types.ts'

const HEADER = 'fecha,producto,cantidad,precio_unitario'

function recordsFrom(csv: string): SaleRecord[] {
  const result = readSalesCsv(csv)
  assert.ok(result.ok, 'el CSV de la prueba debería ser válido')
  return result.records
}

describe('cálculos de ventas', () => {
  it('calcula los ingresos del ejemplo al céntimo', () => {
    const analysis = analyzeSales(recordsFrom(SAMPLE_CSV))
    assert.equal(analysis.totalRevenueCents, 70140)
    assert.equal(analysis.recordCount, 14)
    assert.equal(analysis.firstDate, '2026-03-02')
    assert.equal(analysis.lastDate, '2026-03-06')
  })

  it('suma cantidades solo dentro de cada producto y ordena por ingresos', () => {
    const { products } = analyzeSales(recordsFrom(SAMPLE_CSV))
    assert.deepEqual(
      products.map((product) => [product.product, product.quantity, product.revenueCents]),
      [
        ['Café molido 500 g', 33, 41250],
        ['Galletas de avena', 52, 16640],
        ['Té verde (caja)', 14, 12250],
      ],
    )
    const shares = products.reduce((sum, product) => sum + product.revenueShare, 0)
    assert.ok(Math.abs(shares - 1) < 1e-9)
  })

  it('evita errores de coma flotante en importes y cantidades decimales', () => {
    // En coma flotante, 0.1 + 0.2 no es 0.3 y 0.29 × 1250 da 362.4999…
    const analysis = analyzeSales(
      recordsFrom(`${HEADER}\n2026-03-02,A,0.1,1\n2026-03-02,A,0.2,1\n2026-03-03,B,0.29,12.50`),
    )
    assert.equal(analysis.products.find((product) => product.product === 'A')?.quantity, 0.3)
    assert.equal(analysis.products.find((product) => product.product === 'B')?.revenueCents, 363)
  })

  it('ordena las fechas cronológicamente aunque el archivo esté desordenado y no inventa fechas faltantes', () => {
    const dates = summarizeByDate(recordsFrom(`${HEADER}\n2026-03-05,A,1,10\n2026-03-01,A,2,10\n2026-03-05,B,1,5`))
    assert.deepEqual(
      dates.map((date) => [date.date, date.revenueCents, date.lines]),
      [
        ['2026-03-01', 2000, [3]],
        ['2026-03-05', 1500, [2, 4]],
      ],
    )
  })

  it('filtra la evolución por producto', () => {
    const dates = summarizeByDate(recordsFrom(SAMPLE_CSV), 'té verde (caja)')
    assert.deepEqual(
      dates.map((date) => date.date),
      ['2026-03-02', '2026-03-03', '2026-03-05', '2026-03-06'],
    )
  })

  it('suma la cantidad por fecha de un solo producto', () => {
    const quantities = quantityByDate(
      recordsFrom(`${HEADER}\n2026-03-02,Arroz kg,1.5,2\n2026-03-02,Arroz kg,0.25,2\n2026-03-02,Té,40,1`),
      'arroz kg',
    )
    assert.deepEqual(quantities, [{ date: '2026-03-02', quantity: 1.75, lines: [2, 3] }])
  })

  it('exige al menos un registro', () => {
    assert.throws(() => analyzeSales([]))
  })
})
