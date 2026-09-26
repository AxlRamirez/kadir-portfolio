import type { DateSummary, SalesAnalysis } from './analysis.ts'
import { formatAmount, formatDate, formatLineList, formatPercent } from './format.ts'

/** Una caída menor se considera variación normal y no se reporta. */
export const DROP_THRESHOLD = 0.2

export type InsightId = 'top-product' | 'largest-drop' | 'peak-date'

export type Insight = {
  statement: string
  /** Cómo se obtuvo el resultado, con los valores y las líneas del archivo que intervienen. */
  calculation: string
  /** Línea inicial de cada registro que respalda la observación. */
  lines: number[]
  /** Fecha que señala la observación, si se refiere a una. */
  focusDate?: string
}

export type RuleOutcome = {
  id: InsightId
  rule: string
  /** `null` cuando los datos no bastan para afirmar nada. */
  insight: Insight | null
  /** Por qué no se generó la observación. */
  reason: string | null
}

const DAY_MS = 86_400_000

function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / DAY_MS)
}

function skipped(id: InsightId, rule: string, reason: string): RuleOutcome {
  return { id, rule, insight: null, reason }
}

export function topProductRule({ products, totalRevenueCents }: SalesAnalysis): RuleOutcome {
  const id = 'top-product'
  const rule = 'Producto con mayores ingresos'
  if (products.length < 2) return skipped(id, rule, 'Solo hay un producto, así que no hay con qué compararlo.')

  const [first, second] = products
  if (first.revenueCents === second.revenueCents) {
    return skipped(id, rule, `${first.product} y ${second.product} empatan con ${formatAmount(first.revenueCents)}.`)
  }

  return {
    id,
    rule,
    reason: null,
    insight: {
      statement: `${first.product} genera los mayores ingresos: ${formatAmount(first.revenueCents)}, el ${formatPercent(first.revenueShare)} del total.`,
      calculation: `Suma de cantidad × precio unitario en sus ${first.lines.length} registros (líneas ${formatLineList(first.lines)}). ${formatAmount(first.revenueCents)} ÷ ${formatAmount(totalRevenueCents)} de ingresos totales = ${formatPercent(first.revenueShare)}. Le sigue ${second.product} con ${formatAmount(second.revenueCents)}.`,
      lines: first.lines,
    },
  }
}

export function largestDropRule({ dates }: SalesAnalysis): RuleOutcome {
  const id = 'largest-drop'
  const rule = `Mayor caída entre fechas consecutivas (al menos ${formatPercent(DROP_THRESHOLD, 0)})`
  if (dates.length < 2) return skipped(id, rule, 'Solo hay una fecha; se necesitan al menos dos para comparar.')

  let largest: { previous: DateSummary; current: DateSummary; drop: number } | null = null
  for (let i = 1; i < dates.length; i++) {
    const previous = dates[i - 1]
    const current = dates[i]
    const drop = (previous.revenueCents - current.revenueCents) / previous.revenueCents
    if (drop > 0 && (largest === null || drop > largest.drop)) largest = { previous, current, drop }
  }

  if (largest === null) return skipped(id, rule, 'Los ingresos no bajaron entre ninguna fecha y la anterior.')
  if (largest.drop < DROP_THRESHOLD) {
    return skipped(id, rule, `La mayor baja fue de ${formatPercent(largest.drop)}, por debajo del umbral.`)
  }

  const { previous, current, drop } = largest
  const gap = daysBetween(previous.date, current.date)
  const gapNote = gap > 1 ? ` Entre ambas fechas hay ${gap - 1} ${gap - 1 === 1 ? 'día' : 'días'} sin registros en el archivo.` : ''

  return {
    id,
    rule,
    reason: null,
    insight: {
      statement: `El ${formatDate(current.date)} los ingresos bajaron un ${formatPercent(drop)} respecto al ${formatDate(previous.date)}.`,
      calculation: `${formatDate(previous.date)}: ${formatAmount(previous.revenueCents)} (líneas ${formatLineList(previous.lines)}). ${formatDate(current.date)}: ${formatAmount(current.revenueCents)} (líneas ${formatLineList(current.lines)}). (${formatAmount(previous.revenueCents)} − ${formatAmount(current.revenueCents)}) ÷ ${formatAmount(previous.revenueCents)} = ${formatPercent(drop)}.${gapNote}`,
      lines: [...previous.lines, ...current.lines],
      focusDate: current.date,
    },
  }
}

export function peakDateRule({ dates }: SalesAnalysis): RuleOutcome {
  const id = 'peak-date'
  const rule = 'Fecha con mayores ingresos'
  if (dates.length < 2) return skipped(id, rule, 'Solo hay una fecha; se necesitan al menos dos para comparar.')

  const [first, second] = [...dates].sort((a, b) => b.revenueCents - a.revenueCents)
  if (first.revenueCents === second.revenueCents) {
    return skipped(id, rule, `El ${formatDate(first.date)} y el ${formatDate(second.date)} empatan con ${formatAmount(first.revenueCents)}.`)
  }

  return {
    id,
    rule,
    reason: null,
    insight: {
      statement: `El ${formatDate(first.date)} fue la fecha con mayores ingresos: ${formatAmount(first.revenueCents)} en ${first.lines.length} ${first.lines.length === 1 ? 'registro' : 'registros'}.`,
      calculation: `Suma de cantidad × precio unitario de los registros de las líneas ${formatLineList(first.lines)}. La siguiente fecha más alta es el ${formatDate(second.date)}, con ${formatAmount(second.revenueCents)}.`,
      lines: first.lines,
      focusDate: first.date,
    },
  }
}

export function evaluateRules(analysis: SalesAnalysis): RuleOutcome[] {
  return [topProductRule(analysis), largestDropRule(analysis), peakDateRule(analysis)]
}
