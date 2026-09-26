export const REQUIRED_COLUMNS = ['fecha', 'producto', 'cantidad', 'precio_unitario'] as const

export type ColumnName = (typeof REQUIRED_COLUMNS)[number]

/** Una venta ya validada. Los importes se guardan en céntimos enteros para no acumular errores de coma flotante. */
export type SaleRecord = {
  /** Línea física del archivo donde empieza el registro; el encabezado suele ser la línea 1. Identifica al registro. */
  line: number
  /** Línea donde termina; solo difiere de `line` si un campo entre comillas ocupa varias líneas. */
  endLine: number
  /** Fecha ISO `AAAA-MM-DD`. */
  date: string
  /** Nombre tal como aparece en el primer registro de ese producto. */
  product: string
  /** Clave para agrupar: sin mayúsculas ni espacios repetidos. */
  productKey: string
  quantity: number
  unitPriceCents: number
  revenueCents: number
}

export type ValidationIssue = {
  /** `null` cuando el problema es del archivo completo o del encabezado. */
  line: number | null
  endLine: number | null
  /** `null` cuando el problema afecta a todo el registro. */
  column: ColumnName | null
  value: string | null
  message: string
}

export type ValidationResult =
  | { ok: true; records: SaleRecord[]; skippedEmptyLines: number[]; ignoredColumns: string[] }
  | { ok: false; issues: ValidationIssue[]; skippedEmptyLines: number[] }
