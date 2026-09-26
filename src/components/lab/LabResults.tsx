import { useMemo, useState } from 'react'
import { analyzeSales } from '../../lab/analysis.ts'
import { formatAmount, formatDate, formatLineList } from '../../lab/format.ts'
import { evaluateRules, type InsightId } from '../../lab/insights.ts'
import type { SaleRecord } from '../../lab/types.ts'
import DateTrend from './DateTrend.tsx'
import Observations from './Observations.tsx'
import ProductTable from './ProductTable.tsx'
import RecordsTable from './RecordsTable.tsx'

type LabResultsProps = {
  records: SaleRecord[]
  skippedEmptyLines: number[]
  ignoredColumns: string[]
}

const NO_LINES: ReadonlySet<number> = new Set()

function LabResults({ records, skippedEmptyLines, ignoredColumns }: LabResultsProps) {
  const analysis = useMemo(() => analyzeSales(records), [records])
  const outcomes = useMemo(() => evaluateRules(analysis), [analysis])
  const [highlightedInsight, setHighlightedInsight] = useState<InsightId | null>(null)

  const highlightedLines = useMemo(() => {
    const insight = outcomes.find((outcome) => outcome.id === highlightedInsight)?.insight
    return insight ? new Set(insight.lines) : NO_LINES
  }, [outcomes, highlightedInsight])

  const dropDate = outcomes.find((outcome) => outcome.id === 'largest-drop')?.insight?.focusDate

  const period =
    analysis.firstDate === analysis.lastDate
      ? formatDate(analysis.firstDate)
      : `${formatDate(analysis.firstDate)} – ${formatDate(analysis.lastDate)}`

  return (
    <div className="lab-results">
      <div className="lab-summary">
        <dl className="lab-ledger">
          <div className="lab-ledger-item lab-ledger-revenue">
            <dt>Ingresos calculados</dt>
            <dd>{formatAmount(analysis.totalRevenueCents)}</dd>
          </div>
          <div className="lab-ledger-item">
            <dt>Registros</dt>
            <dd>{analysis.recordCount}</dd>
          </div>
          <div className="lab-ledger-item">
            <dt>Productos</dt>
            <dd>{analysis.products.length}</dd>
          </div>
          <div className="lab-ledger-item lab-ledger-period">
            <dt>Periodo</dt>
            <dd>{period}</dd>
          </div>
        </dl>
        <p className="lab-note">
          Ingresos = cantidad × precio unitario, sumados por registro. El archivo no indica moneda: los importes están en
          la misma unidad que el precio.
          {skippedEmptyLines.length === 1 && ` Se omitió la línea vacía ${skippedEmptyLines[0]}.`}
          {skippedEmptyLines.length > 1 && ` Se omitieron las líneas vacías ${formatLineList(skippedEmptyLines)}.`}
          {ignoredColumns.length > 0 &&
            ` ${ignoredColumns.length === 1 ? 'Se ignoró la columna' : 'Se ignoraron las columnas'} ${ignoredColumns.map((name) => `«${name}»`).join(', ')}.`}
        </p>
      </div>

      <div className="lab-grid">
        <DateTrend records={records} analysis={analysis} dropDate={dropDate} highlightedLines={highlightedLines} />
        <Observations outcomes={outcomes} highlightedInsight={highlightedInsight} onHighlight={setHighlightedInsight} />
        <ProductTable products={analysis.products} highlightedLines={highlightedLines} />
      </div>

      <RecordsTable records={records} highlightedLines={highlightedLines} />
    </div>
  )
}

export default LabResults
