import type { CsvRecord } from './csv.ts'
import {
  REQUIRED_COLUMNS,
  type ColumnName,
  type SaleRecord,
  type ValidationIssue,
  type ValidationResult,
} from './types.ts'

/** Límite pensado para que el análisis siga siendo instantáneo en un teléfono. */
export const MAX_DATA_RECORDS = 5000
export const MAX_PRODUCT_LENGTH = 120

const PRICE_DECIMALS = 2
// Se admiten cantidades fraccionarias (por ejemplo, kilos), con precisión de gramos.
const QUANTITY_DECIMALS = 3
const MAX_SCALED_VALUE = 1_000_000_000_000

type FieldResult<T> = { ok: true; value: T } | { ok: false; message: string }

/** «Precio Unitario», « precio-unitario » y «PRECIO_UNITARIO» se tratan como la misma columna. */
export function normalizeHeader(header: string): string {
  return header
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

/** También convierte en espacios los saltos de línea de un nombre escrito en varias líneas dentro de comillas. */
export function normalizeProductName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function isCalendarDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

// Solo se acepta AAAA-MM-DD: «03/05/2026» puede ser 3 de mayo o 5 de marzo según quién exportó el archivo.
export function parseIsoDate(raw: string): FieldResult<string> {
  const value = raw.trim()
  if (value === '') {
    return { ok: false, message: 'Está vacía. Usa el formato AAAA-MM-DD, por ejemplo 2026-03-05.' }
  }
  if (/^\d{1,2}[/.-]\d{1,2}[/.-]\d{4}$/.test(value)) {
    return {
      ok: false,
      message: 'Parece estar en formato día/mes/año. Escríbela como AAAA-MM-DD (por ejemplo, 2026-03-05) para no confundir el día con el mes.',
    }
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    return { ok: false, message: 'No tiene el formato AAAA-MM-DD. Ejemplo: 2026-03-05.' }
  }
  if (!isCalendarDate(Number(match[1]), Number(match[2]), Number(match[3]))) {
    return { ok: false, message: 'Esa fecha no existe en el calendario. Revisa el día y el mes.' }
  }
  return { ok: true, value }
}

/**
 * Lee un número positivo y lo devuelve escalado a entero (12.50 con 2 decimales → 1250).
 * Se trabaja con el texto en lugar de `Number()` para que 0.29 no se convierta en 28.999… céntimos.
 * Punto y coma decimal son equivalentes; los separadores de miles se rechazan porque «1.250» es ambiguo.
 */
export function parsePositiveDecimal(raw: string, maxDecimals: number, noun: 'cantidad' | 'precio'): FieldResult<number> {
  const value = raw.trim().replace(/\s/g, '')
  const isQuantity = noun === 'cantidad'

  if (value === '') {
    return {
      ok: false,
      message: isQuantity ? 'Está vacía. Escribe cuántas unidades se vendieron.' : 'Está vacío. Escribe el precio de una unidad.',
    }
  }
  if (/[₡$€¢£]|[a-z]{3}$/i.test(value) && /\d/.test(value)) {
    return { ok: false, message: 'Quita el símbolo o código de moneda y deja solo el número, por ejemplo 12.50.' }
  }
  const separators = value.match(/[.,]/g) ?? []
  if (separators.length > 1 && /^-?[\d.,]+$/.test(value)) {
    return {
      ok: false,
      message: 'Parece llevar separador de miles. Escribe el número sin él y con un solo separador decimal, por ejemplo 1250.00.',
    }
  }

  const match = /^([+-]?)(\d+)(?:[.,](\d+))?$/.exec(value)
  if (!match) {
    return { ok: false, message: 'No es un número. Usa solo dígitos y, si hace falta, punto o coma decimal: 12.50.' }
  }
  const [, sign, integerPart, fractionPart = ''] = match

  if (sign === '-' && /[1-9]/.test(integerPart + fractionPart)) {
    return {
      ok: false,
      message: isQuantity
        ? 'No puede ser negativa. Esta herramienta analiza solo ventas; registra las devoluciones en otro archivo.'
        : 'No puede ser negativo. Si es un descuento, aplícalo al precio unitario.',
    }
  }
  if (fractionPart.length > maxDecimals) {
    return { ok: false, message: `Admite como máximo ${maxDecimals} decimales.` }
  }

  const scaled = Number(integerPart + fractionPart.padEnd(maxDecimals, '0'))
  if (scaled === 0) {
    return {
      ok: false,
      message: isQuantity
        ? 'Debe ser mayor que 0. Si en ese registro no hubo venta, elimínalo.'
        : 'Debe ser mayor que 0. Esta herramienta no analiza productos entregados sin costo.',
    }
  }
  if (scaled > MAX_SCALED_VALUE) {
    return { ok: false, message: 'Es demasiado grande para este análisis. Revisa si sobran dígitos.' }
  }
  return { ok: true, value: scaled }
}

function parseProduct(raw: string): FieldResult<string> {
  const value = normalizeProductName(raw)
  if (value === '') return { ok: false, message: 'Está vacío. Escribe el nombre del producto.' }
  if (value.length > MAX_PRODUCT_LENGTH) {
    return { ok: false, message: `Es demasiado largo: admite hasta ${MAX_PRODUCT_LENGTH} caracteres.` }
  }
  return { ok: true, value }
}

function isEmpty(cells: string[]): boolean {
  return cells.every((cell) => cell.trim() === '')
}

function fileIssue(message: string): ValidationIssue {
  return { line: null, endLine: null, column: null, value: null, message }
}

/**
 * Valida los registros del parser y los convierte en ventas.
 * Si hay cualquier problema se devuelven todos y ningún registro: el análisis no debe
 * calcularse con una parte del archivo sin que quien lo cargó lo sepa.
 * Las ubicaciones son líneas físicas del archivo, las mismas que muestra un editor de texto.
 */
export function validateSalesRecords(records: CsvRecord[]): ValidationResult {
  const skippedEmptyLines: number[] = []
  const headerIndex = records.findIndex((record) => !isEmpty(record.cells))

  if (headerIndex === -1) {
    return { ok: false, issues: [fileIssue('El archivo está vacío.')], skippedEmptyLines }
  }
  for (const record of records.slice(0, headerIndex)) skippedEmptyLines.push(record.line)

  const header = records[headerIndex]
  const headers = header.cells.map(normalizeHeader)
  const issues: ValidationIssue[] = []
  const columnIndex = {} as Record<ColumnName, number>

  for (const column of REQUIRED_COLUMNS) {
    const positions = headers.flatMap((name, index) => (name === column ? [index] : []))
    if (positions.length === 0) {
      issues.push(fileIssue(`Falta la columna «${column}» en el encabezado.`))
    } else if (positions.length > 1) {
      issues.push(fileIssue(`La columna «${column}» aparece ${positions.length} veces en el encabezado.`))
    } else {
      columnIndex[column] = positions[0]
    }
  }
  if (issues.length > 0) {
    issues.push(
      fileIssue(
        `Encabezado recibido en la línea ${header.line}: ${header.cells.map((cell) => `«${cell.trim()}»`).join(', ')}. La primera línea con datos debe ser: ${REQUIRED_COLUMNS.join(', ')}.`,
      ),
    )
    return { ok: false, issues, skippedEmptyLines }
  }

  const requiredSet = new Set<string>(REQUIRED_COLUMNS)
  const ignoredColumns = header.cells
    .filter((cell, index) => cell.trim() !== '' && !requiredSet.has(headers[index]))
    .map((cell) => cell.trim())
  // Las columnas con encabezado vacío (p. ej., por un separador al final de la línea) no cuentan como datos.
  const lastUsedColumn = headers.findLastIndex((name) => name !== '')

  const dataRecords = records.slice(headerIndex + 1)
  const nonEmptyCount = dataRecords.filter((record) => !isEmpty(record.cells)).length
  if (nonEmptyCount === 0) {
    return { ok: false, issues: [fileIssue('El archivo no tiene registros debajo del encabezado.')], skippedEmptyLines }
  }
  if (nonEmptyCount > MAX_DATA_RECORDS) {
    return {
      ok: false,
      issues: [fileIssue(`El archivo tiene ${nonEmptyCount} registros; el máximo es ${MAX_DATA_RECORDS}.`)],
      skippedEmptyLines,
    }
  }

  const sales: SaleRecord[] = []
  const productNames = new Map<string, string>()

  for (const { cells, line, endLine } of dataRecords) {
    if (isEmpty(cells)) {
      skippedEmptyLines.push(line)
      continue
    }

    const usedCells = cells.length > lastUsedColumn + 1 && isEmpty(cells.slice(lastUsedColumn + 1)) ? cells.slice(0, lastUsedColumn + 1) : cells
    const expected = lastUsedColumn + 1
    if (usedCells.length !== expected) {
      const hint =
        usedCells.length > expected
          ? ' Si un producto o un precio contiene comas, escríbelo entre comillas o usa punto decimal.'
          : ' Completa los valores que faltan.'
      issues.push({
        line,
        endLine,
        column: null,
        value: cells.join(' | '),
        message: `Tiene ${usedCells.length} valores y el encabezado tiene ${expected}.${hint}`,
      })
      continue
    }

    const cell = (column: ColumnName) => usedCells[columnIndex[column]] ?? ''
    const date = parseIsoDate(cell('fecha'))
    const product = parseProduct(cell('producto'))
    const quantity = parsePositiveDecimal(cell('cantidad'), QUANTITY_DECIMALS, 'cantidad')
    const price = parsePositiveDecimal(cell('precio_unitario'), PRICE_DECIMALS, 'precio')

    const fieldResults: [ColumnName, FieldResult<unknown>][] = [
      ['fecha', date],
      ['producto', product],
      ['cantidad', quantity],
      ['precio_unitario', price],
    ]
    for (const [column, result] of fieldResults) {
      if (!result.ok) issues.push({ line, endLine, column, value: cell(column), message: result.message })
    }
    if (!date.ok || !product.ok || !quantity.ok || !price.ok) continue

    // Productos que solo difieren en mayúsculas o espacios se agrupan juntos y conservan el primer nombre visto.
    const productKey = product.value.toLocaleLowerCase('es')
    if (!productNames.has(productKey)) productNames.set(productKey, product.value)

    const quantityThousandths = quantity.value
    const unitPriceCents = price.value
    sales.push({
      line,
      endLine,
      date: date.value,
      product: productNames.get(productKey) ?? product.value,
      productKey,
      quantity: quantityThousandths / 10 ** QUANTITY_DECIMALS,
      unitPriceCents,
      // Ambos factores son enteros, así que el producto es exacto; se redondea al céntimo (mitad hacia arriba).
      revenueCents: Math.round((quantityThousandths * unitPriceCents) / 10 ** QUANTITY_DECIMALS),
    })
  }

  if (issues.length > 0) return { ok: false, issues, skippedEmptyLines }
  return { ok: true, records: sales, skippedEmptyLines, ignoredColumns }
}
