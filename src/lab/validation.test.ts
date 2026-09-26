import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { readSalesCsv } from './pipeline.ts'
import { INVALID_SAMPLE_CSV, SAMPLE_CSV } from './sampleData.ts'
import type { ValidationIssue, ValidationResult } from './types.ts'
import { parseIsoDate, parsePositiveDecimal } from './validation.ts'

const HEADER = 'fecha,producto,cantidad,precio_unitario'

function issuesOf(result: ValidationResult): ValidationIssue[] {
  assert.equal(result.ok, false, 'se esperaba que la validación fallara')
  return result.ok ? [] : result.issues
}

describe('validación del archivo', () => {
  it('acepta el ejemplo incluido en la página', () => {
    const result = readSalesCsv(SAMPLE_CSV)
    assert.ok(result.ok)
    assert.equal(result.records.length, 14)
  })

  it('reporta cada error del ejemplo inválido con su línea y columna', () => {
    const issues = issuesOf(readSalesCsv(INVALID_SAMPLE_CSV))
    const located = issues.map((issue) => `${issue.line}:${issue.column ?? '-'}`)
    assert.deepEqual(located, [
      '3:fecha',
      '4:fecha',
      '5:producto',
      '6:cantidad',
      '7:precio_unitario',
      '8:cantidad',
      '8:precio_unitario',
      '10:precio_unitario',
      '11:-',
    ])
  })

  it('no devuelve registros parciales cuando algún registro es inválido', () => {
    const result = readSalesCsv(`${HEADER}\n2026-03-02,Café,1,10\n2026-03-02,Té,0,5`)
    assert.equal(result.ok, false)
    assert.equal('records' in result, false)
  })

  it('acepta encabezados en otro orden, con mayúsculas, tildes o espacios, e informa las columnas extra', () => {
    const result = readSalesCsv('Producto, Precio Unitario ,CANTIDAD,Fecha,Cliente\nCafé,12.50,2,2026-03-02,Ana')
    assert.ok(result.ok)
    assert.deepEqual(result.ignoredColumns, ['Cliente'])
    assert.equal(result.records[0].revenueCents, 2500)
  })

  it('explica qué columna falta', () => {
    const issues = issuesOf(readSalesCsv('fecha,producto,cantidad\n2026-03-02,Café,2'))
    assert.match(issues[0].message, /«precio_unitario»/)
  })

  it('rechaza un archivo vacío o con solo encabezado', () => {
    assert.match(issuesOf(readSalesCsv(''))[0].message, /vacío/)
    assert.match(issuesOf(readSalesCsv(`${HEADER}\n\n`))[0].message, /no tiene registros/)
  })

  it('omite líneas vacías y las numera según el archivo', () => {
    const result = readSalesCsv(`${HEADER}\n\n2026-03-02,Café,1,10\n , , , \n`)
    assert.ok(result.ok)
    assert.deepEqual(result.skippedEmptyLines, [2, 4])
    assert.equal(result.records[0].line, 3)
  })

  it('tolera un separador sobrante al final de la línea', () => {
    const result = readSalesCsv(`${HEADER},\n2026-03-02,Café,1,10,`)
    assert.ok(result.ok)
  })

  it('agrupa productos que solo difieren en mayúsculas o espacios y conserva el primer nombre', () => {
    const result = readSalesCsv(`${HEADER}\n2026-03-02,Café  molido,1,10\n2026-03-03,café molido ,1,10`)
    assert.ok(result.ok)
    assert.deepEqual(
      result.records.map((record) => [record.product, record.productKey]),
      [
        ['Café molido', 'café molido'],
        ['Café molido', 'café molido'],
      ],
    )
  })
})

describe('ubicación de errores con campos de varias líneas', () => {
  const MULTILINE_CSV = [
    HEADER,
    '2026-03-02,"Café',
    'molido",1,10',
    '2026-03-03,Té,-1,5',
    '2026-03-04,"Galletas',
    'de',
    'avena",abc,2',
    '',
  ].join('\n')

  it('señala la línea física donde está cada registro, no su posición entre registros', () => {
    const issues = issuesOf(readSalesCsv(MULTILINE_CSV))
    assert.deepEqual(
      issues.map((issue) => [issue.line, issue.endLine, issue.column]),
      [
        [4, 4, 'cantidad'],
        [5, 7, 'cantidad'],
      ],
    )
  })

  it('guarda en cada venta válida las líneas que ocupa y une el nombre partido en una sola línea', () => {
    const result = readSalesCsv(`${HEADER}\n2026-03-02,"Café\nmolido",1,10\n2026-03-03,Té,2,5`)
    assert.ok(result.ok)
    assert.deepEqual(
      result.records.map((record) => [record.line, record.endLine, record.product]),
      [
        [2, 3, 'Café molido'],
        [4, 4, 'Té'],
      ],
    )
  })

  it('numera las líneas vacías posteriores según el archivo', () => {
    const result = readSalesCsv(`${HEADER}\n2026-03-02,"Café\nmolido",1,10\n\n2026-03-03,Té,2,5`)
    assert.ok(result.ok)
    assert.deepEqual(result.skippedEmptyLines, [4])
  })

  it('informa en qué línea se abre una comilla que no se cierra', () => {
    const issues = issuesOf(readSalesCsv(`${HEADER}\n2026-03-02,"Café\nmolido",1,10\n2026-03-03,"Té,2,5`))
    assert.deepEqual([issues[0].line, issues[0].column], [4, null])
    assert.match(issues[0].message, /línea 4/)
  })
})

describe('parseIsoDate', () => {
  it('rechaza fechas que no existen, incluido el 29 de febrero fuera de año bisiesto', () => {
    assert.equal(parseIsoDate('2026-02-29').ok, false)
    assert.equal(parseIsoDate('2026-13-01').ok, false)
    assert.equal(parseIsoDate('2028-02-29').ok, true)
  })

  it('sugiere el formato correcto para fechas día/mes/año', () => {
    const result = parseIsoDate('05/03/2026')
    assert.ok(!result.ok && result.message.includes('AAAA-MM-DD'))
  })
})

describe('parsePositiveDecimal', () => {
  it('acepta punto o coma decimal y devuelve un entero escalado exacto', () => {
    assert.deepEqual(parsePositiveDecimal('12.5', 2, 'precio'), { ok: true, value: 1250 })
    assert.deepEqual(parsePositiveDecimal('0,29', 2, 'precio'), { ok: true, value: 29 })
    assert.deepEqual(parsePositiveDecimal(' 7 ', 3, 'cantidad'), { ok: true, value: 7000 })
  })

  it('rechaza cero, negativos, separadores de miles, símbolos de moneda y exceso de decimales', () => {
    const cases: [string, RegExp][] = [
      ['0', /mayor que 0/],
      ['-0', /mayor que 0/],
      ['-3', /negativ/],
      ['1,250.00', /miles/],
      ['1.250,00', /miles/],
      ['₡12.50', /moneda/],
      ['12.505', /2 decimales/],
      ['doce', /No es un número/],
      ['', /vacío/],
    ]
    for (const [input, expected] of cases) {
      const result = parsePositiveDecimal(input, 2, 'precio')
      assert.ok(!result.ok, `«${input}» debería rechazarse`)
      assert.match(result.message, expected, `mensaje para «${input}»`)
    }
  })
})
