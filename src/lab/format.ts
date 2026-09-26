// El archivo no indica moneda, así que los importes se muestran como números sin símbolo.
const amountFormatter = new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const quantityFormatter = new Intl.NumberFormat('es-CR', { maximumFractionDigits: 3 })
// Las fechas se construyen en UTC para que la zona horaria del visitante no las mueva un día.
const dateFormatter = new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const shortDateFormatter = new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'short', timeZone: 'UTC' })

function isoToUtcDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function formatAmount(cents: number): string {
  return amountFormatter.format(cents / 100)
}

export function formatQuantity(quantity: number): string {
  return quantityFormatter.format(quantity)
}

export function formatPercent(ratio: number, fractionDigits = 1): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(ratio)
}

export function formatDate(iso: string): string {
  return dateFormatter.format(isoToUtcDate(iso))
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(isoToUtcDate(iso))
}

/** «5» o «5–6» para un registro que ocupa varias líneas. */
export function formatLineRange(line: number, endLine: number): string {
  return line === endLine ? String(line) : `${line}–${endLine}`
}

/** «2, 5, 9» o «2–4, 9» cuando hay líneas consecutivas. */
export function formatLineList(lines: number[]): string {
  if (lines.length === 0) return ''
  const sorted = [...lines].sort((a, b) => a - b)
  const ranges: string[] = []
  let start = sorted[0]
  let previous = sorted[0]

  for (const line of [...sorted.slice(1), Number.NaN]) {
    if (line === previous + 1) {
      previous = line
      continue
    }
    ranges.push(start === previous ? String(start) : `${start}–${previous}`)
    start = line
    previous = line
  }
  return ranges.join(', ')
}
