import type { SaleRecord } from './types.ts'

export type ProductSummary = {
  productKey: string
  product: string
  /** Solo se suma dentro del mismo producto: las unidades de productos distintos no son comparables. */
  quantity: number
  revenueCents: number
  /** Proporción de los ingresos totales, entre 0 y 1. */
  revenueShare: number
  lines: number[]
}

export type DateSummary = {
  date: string
  revenueCents: number
  lines: number[]
}

export type SalesAnalysis = {
  totalRevenueCents: number
  recordCount: number
  products: ProductSummary[]
  /** Solo incluye las fechas presentes en el archivo, en orden cronológico. */
  dates: DateSummary[]
  firstDate: string
  lastDate: string
}

function compareText(a: string, b: string): number {
  return a.localeCompare(b, 'es')
}

export function summarizeByProduct(records: SaleRecord[]): ProductSummary[] {
  const totalRevenueCents = records.reduce((sum, record) => sum + record.revenueCents, 0)
  const byKey = new Map<string, ProductSummary>()

  for (const record of records) {
    const summary = byKey.get(record.productKey) ?? {
      productKey: record.productKey,
      product: record.product,
      quantity: 0,
      revenueCents: 0,
      revenueShare: 0,
      lines: [],
    }
    summary.quantity += record.quantity
    summary.revenueCents += record.revenueCents
    summary.lines.push(record.line)
    byKey.set(record.productKey, summary)
  }

  return [...byKey.values()]
    .map((summary) => ({
      ...summary,
      // Las cantidades admiten tres decimales; redondear evita arrastrar residuos de la suma en coma flotante.
      quantity: Math.round(summary.quantity * 1000) / 1000,
      revenueShare: totalRevenueCents === 0 ? 0 : summary.revenueCents / totalRevenueCents,
    }))
    .sort((a, b) => b.revenueCents - a.revenueCents || compareText(a.product, b.product))
}

/**
 * Ingresos por fecha. Una fecha sin registros no aparece como cero:
 * que falte en el archivo no demuestra que ese día no hubo ventas.
 */
export function summarizeByDate(records: SaleRecord[], productKey?: string): DateSummary[] {
  const byDate = new Map<string, DateSummary>()

  for (const record of records) {
    if (productKey !== undefined && record.productKey !== productKey) continue
    const summary = byDate.get(record.date) ?? { date: record.date, revenueCents: 0, lines: [] }
    summary.revenueCents += record.revenueCents
    summary.lines.push(record.line)
    byDate.set(record.date, summary)
  }

  // Las fechas ISO se ordenan cronológicamente al compararlas como texto.
  return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export type DateQuantity = {
  date: string
  quantity: number
  lines: number[]
}

/** Cantidad vendida por fecha de un solo producto; por eso `productKey` es obligatorio. */
export function quantityByDate(records: SaleRecord[], productKey: string): DateQuantity[] {
  const byDate = new Map<string, DateQuantity>()

  for (const record of records) {
    if (record.productKey !== productKey) continue
    const summary = byDate.get(record.date) ?? { date: record.date, quantity: 0, lines: [] }
    summary.quantity += record.quantity
    summary.lines.push(record.line)
    byDate.set(record.date, summary)
  }

  return [...byDate.values()]
    .map((summary) => ({ ...summary, quantity: Math.round(summary.quantity * 1000) / 1000 }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export function analyzeSales(records: SaleRecord[]): SalesAnalysis {
  if (records.length === 0) {
    throw new Error('analyzeSales necesita al menos un registro validado.')
  }
  const dates = summarizeByDate(records)
  return {
    totalRevenueCents: records.reduce((sum, record) => sum + record.revenueCents, 0),
    recordCount: records.length,
    products: summarizeByProduct(records),
    dates,
    firstDate: dates[0].date,
    lastDate: dates[dates.length - 1].date,
  }
}
