import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { analyzeSales, type SalesAnalysis } from './analysis.ts'
import { evaluateRules, largestDropRule, peakDateRule, topProductRule } from './insights.ts'
import { readSalesCsv } from './pipeline.ts'
import { SAMPLE_CSV } from './sampleData.ts'

const HEADER = 'fecha,producto,cantidad,precio_unitario'

function analysisFrom(csv: string): SalesAnalysis {
  const result = readSalesCsv(csv)
  assert.ok(result.ok, 'el CSV de la prueba debería ser válido')
  return analyzeSales(result.records)
}

describe('observaciones por reglas', () => {
  it('genera las tres observaciones del ejemplo con las líneas que las respaldan', () => {
    const outcomes = evaluateRules(analysisFrom(SAMPLE_CSV))
    assert.deepEqual(
      outcomes.map((outcome) => [outcome.id, outcome.insight?.lines]),
      [
        ['top-product', [2, 5, 8, 10, 13]],
        ['largest-drop', [5, 6, 7, 8, 9]],
        ['peak-date', [13, 14, 15]],
      ],
    )
    assert.match(outcomes[1].insight?.statement ?? '', /65,6/)
  })

  it('no elige producto principal cuando hay empate o un solo producto', () => {
    const tie = topProductRule(analysisFrom(`${HEADER}\n2026-03-02,A,1,10\n2026-03-02,B,2,5`))
    assert.equal(tie.insight, null)
    assert.match(tie.reason ?? '', /empatan/)

    const single = topProductRule(analysisFrom(`${HEADER}\n2026-03-02,A,1,10`))
    assert.equal(single.insight, null)
  })

  it('no compara fechas cuando solo hay una', () => {
    const analysis = analysisFrom(`${HEADER}\n2026-03-02,A,1,10\n2026-03-02,B,1,5`)
    assert.equal(largestDropRule(analysis).insight, null)
    assert.equal(peakDateRule(analysis).insight, null)
  })

  it('ignora caídas por debajo del umbral y explica por qué', () => {
    const outcome = largestDropRule(analysisFrom(`${HEADER}\n2026-03-02,A,10,10\n2026-03-03,A,9,10`))
    assert.equal(outcome.insight, null)
    assert.match(outcome.reason ?? '', /10,0/)
  })

  it('reporta una caída exactamente en el umbral y avisa si hay días sin registros entre las fechas', () => {
    const outcome = largestDropRule(analysisFrom(`${HEADER}\n2026-03-02,A,10,10\n2026-03-05,A,8,10`))
    assert.ok(outcome.insight)
    assert.match(outcome.insight.calculation, /2 días sin registros/)
  })

  it('no reporta caída cuando los ingresos solo suben', () => {
    const outcome = largestDropRule(analysisFrom(`${HEADER}\n2026-03-02,A,1,10\n2026-03-03,A,2,10`))
    assert.match(outcome.reason ?? '', /no bajaron/)
  })
})
