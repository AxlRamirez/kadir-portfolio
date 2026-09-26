import { useMemo, useState, type CSSProperties } from 'react'
import { quantityByDate, summarizeByDate, type SalesAnalysis } from '../../lab/analysis.ts'
import { formatAmount, formatDate, formatQuantity, formatShortDate } from '../../lab/format.ts'
import type { SaleRecord } from '../../lab/types.ts'

type Metric = 'revenue' | 'quantity'

type TrendPoint = {
  date: string
  value: number
  label: string
  lines: number[]
}

type DateTrendProps = {
  records: SaleRecord[]
  analysis: SalesAnalysis
  /** Fecha señalada por la regla de caída; solo aplica a la vista de todos los productos. */
  dropDate?: string
  highlightedLines: ReadonlySet<number>
}

const ALL_PRODUCTS = ''

function DateTrend({ records, analysis, dropDate, highlightedLines }: DateTrendProps) {
  const [productKey, setProductKey] = useState(ALL_PRODUCTS)
  const [metric, setMetric] = useState<Metric>('revenue')
  const isAllProducts = productKey === ALL_PRODUCTS
  // La cantidad solo existe como medida cuando hay un único producto.
  const activeMetric: Metric = isAllProducts ? 'revenue' : metric

  const points = useMemo<TrendPoint[]>(() => {
    if (activeMetric === 'quantity') {
      return quantityByDate(records, productKey).map((day) => ({
        date: day.date,
        value: day.quantity,
        label: formatQuantity(day.quantity),
        lines: day.lines,
      }))
    }
    const dates = isAllProducts ? analysis.dates : summarizeByDate(records, productKey)
    return dates.map((day) => ({
      date: day.date,
      value: day.revenueCents,
      label: formatAmount(day.revenueCents),
      lines: day.lines,
    }))
  }, [activeMetric, analysis.dates, isAllProducts, productKey, records])

  const maxValue = Math.max(...points.map((point) => point.value))
  const productName = analysis.products.find((product) => product.productKey === productKey)?.product

  return (
    <section className="lab-panel lab-trend" aria-labelledby="lab-trend-title">
      <h3 id="lab-trend-title" className="lab-panel-title">
        Evolución por fecha
      </h3>

      <div className="lab-trend-controls">
        <label className="lab-field">
          <span className="lab-field-label">Producto</span>
          <select
            value={productKey}
            onChange={(event) => {
              setProductKey(event.target.value)
              if (event.target.value === ALL_PRODUCTS) setMetric('revenue')
            }}
          >
            <option value={ALL_PRODUCTS}>Todos los productos</option>
            {analysis.products.map((product) => (
              <option key={product.productKey} value={product.productKey}>
                {product.product}
              </option>
            ))}
          </select>
        </label>

        <div className="lab-field" role="group" aria-labelledby="lab-metric-label">
          <span id="lab-metric-label" className="lab-field-label">
            Medida
          </span>
          <div className="lab-toggle">
            <button type="button" aria-pressed={activeMetric === 'revenue'} onClick={() => setMetric('revenue')}>
              Ingresos
            </button>
            <button
              type="button"
              aria-pressed={activeMetric === 'quantity'}
              aria-describedby="lab-trend-hint"
              disabled={isAllProducts}
              onClick={() => setMetric('quantity')}
            >
              Cantidad
            </button>
          </div>
        </div>
      </div>

      <p id="lab-trend-hint" className="lab-trend-hint">
        {isAllProducts
          ? 'Para ver cantidades elige un producto: las unidades de productos distintos no se suman.'
          : `Solo aparecen las fechas con registros de ${productName}.`}
      </p>

      <ol className="lab-bars" role="list" aria-label={`${activeMetric === 'revenue' ? 'Ingresos' : 'Cantidad'} por fecha`}>
        {points.map((point) => {
          const isDrop = isAllProducts && point.date === dropDate
          const isHighlighted = point.lines.some((line) => highlightedLines.has(line))
          const className = ['lab-bar', isDrop && 'is-drop', isHighlighted && 'is-highlighted'].filter(Boolean).join(' ')
          const ratio = maxValue === 0 ? 0 : point.value / maxValue

          return (
            <li key={point.date} className={className}>
              <time className="lab-bar-date" dateTime={point.date} title={formatDate(point.date)}>
                {formatShortDate(point.date)}
              </time>
              <span className="lab-bar-track" aria-hidden="true">
                <span className="lab-bar-fill" style={{ '--ratio': ratio } as CSSProperties} />
              </span>
              <span className="lab-bar-value">
                {point.label}
                {isDrop && <span className="lab-bar-flag"> caída</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default DateTrend
