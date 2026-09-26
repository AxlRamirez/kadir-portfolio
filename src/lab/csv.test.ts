import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseCsv, type CsvParseResult } from './csv.ts'

function cellsOf(result: CsvParseResult): string[][] {
  assert.ok(result.ok, 'se esperaba un CSV válido')
  return result.records.map((record) => record.cells)
}

describe('parseCsv', () => {
  it('separa registros con CRLF y no crea un registro por el salto final', () => {
    const result = parseCsv('a,b\r\n1,2\r\n')
    assert.ok(result.ok)
    assert.equal(result.delimiter, ',')
    assert.deepEqual(cellsOf(result), [['a', 'b'], ['1', '2']])
  })

  it('respeta comas, saltos de línea y comillas escapadas dentro de un campo entre comillas', () => {
    const result = parseCsv('producto,nota\n"Té, verde","dijo ""hola""\nadiós"\n')
    assert.deepEqual(cellsOf(result)[1], ['Té, verde', 'dijo "hola"\nadiós'])
  })

  it('detecta punto y coma como separador por el encabezado', () => {
    const result = parseCsv('fecha;producto;cantidad;precio_unitario\n2026-03-02;Café;2;12,50')
    assert.ok(result.ok)
    assert.equal(result.delimiter, ';')
    assert.deepEqual(cellsOf(result)[1], ['2026-03-02', 'Café', '2', '12,50'])
  })

  it('elimina la marca BOM que añade Excel al guardar como CSV UTF-8', () => {
    assert.equal(cellsOf(parseCsv('\uFEFFfecha,producto'))[0][0], 'fecha')
  })

  it('conserva las líneas vacías intermedias para que la validación las cuente', () => {
    assert.deepEqual(cellsOf(parseCsv('a\n\nb')), [['a'], [''], ['b']])
  })

  it('informa una comilla sin cerrar en lugar de devolver registros corruptos', () => {
    const result = parseCsv('a,b\n1,"sin cerrar\n2,3')
    assert.equal(result.ok, false)
    assert.match(!result.ok ? result.message : '', /línea 2/)
  })
})

describe('parseCsv: líneas físicas', () => {
  it('asigna a cada registro la línea donde empieza y donde termina', () => {
    const result = parseCsv('a,b\n1,"dos\nlíneas"\n3,4\n')
    assert.ok(result.ok)
    assert.deepEqual(
      result.records.map(({ line, endLine }) => [line, endLine]),
      [
        [1, 1],
        [2, 3],
        [4, 4],
      ],
    )
  })

  it('cuenta CRLF y CR como un salto de línea, dentro y fuera de comillas', () => {
    const result = parseCsv('a\r\n"x\r\ny\r\nz"\r\nb\rc')
    assert.ok(result.ok)
    assert.deepEqual(
      result.records.map(({ cells, line, endLine }) => [cells[0], line, endLine]),
      [
        ['a', 1, 1],
        ['x\r\ny\r\nz', 2, 4],
        ['b', 5, 5],
        ['c', 6, 6],
      ],
    )
  })

  it('ubica la comilla sin cerrar en su línea física aunque antes haya un campo de varias líneas', () => {
    const result = parseCsv('a,b\n"uno\ndos",1\n3,"abierta\n4,5')
    assert.equal(result.ok, false)
    assert.equal(!result.ok ? result.line : 0, 4)
  })
})
