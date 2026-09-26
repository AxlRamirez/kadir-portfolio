import { parseCsv } from './csv.ts'
import { decodeUtf8File } from './encoding.ts'
import type { ValidationResult } from './types.ts'
import { validateSalesRecords } from './validation.ts'

/** Tamaño máximo aceptado antes de leer el archivo. */
export const MAX_FILE_BYTES = 1_000_000

/** Resultado para un problema del archivo completo, sin línea ni columna. */
export function fileIssue(message: string): ValidationResult {
  return { ok: false, skippedEmptyLines: [], issues: [{ line: null, endLine: null, column: null, value: null, message }] }
}

export function readSalesCsv(text: string): ValidationResult {
  const parsed = parseCsv(text)
  if (!parsed.ok) {
    return {
      ok: false,
      issues: [{ line: parsed.line, endLine: parsed.line, column: null, value: null, message: parsed.message }],
      skippedEmptyLines: [],
    }
  }
  return validateSalesRecords(parsed.records)
}

/** Punto de entrada para archivos cargados: primero exige UTF-8 legible y después valida el contenido. */
export function readSalesFile(bytes: Uint8Array): ValidationResult {
  const decoded = decodeUtf8File(bytes)
  if (!decoded.ok) {
    return {
      ok: false,
      issues: [{ line: decoded.line, endLine: decoded.line, column: null, value: decoded.excerpt, message: decoded.message }],
      skippedEmptyLines: [],
    }
  }
  return readSalesCsv(decoded.text)
}
