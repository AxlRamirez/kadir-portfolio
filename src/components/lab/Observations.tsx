import { formatLineList } from '../../lab/format.ts'
import type { InsightId, RuleOutcome } from '../../lab/insights.ts'

type ObservationsProps = {
  outcomes: RuleOutcome[]
  highlightedInsight: InsightId | null
  onHighlight: (id: InsightId | null) => void
}

function Observations({ outcomes, highlightedInsight, onHighlight }: ObservationsProps) {
  const generated = outcomes.filter((outcome) => outcome.insight !== null)
  const skipped = outcomes.filter((outcome) => outcome.insight === null)

  return (
    <section className="lab-panel lab-observations" aria-labelledby="lab-observations-title">
      <h3 id="lab-observations-title" className="lab-panel-title">
        Observaciones
      </h3>
      <p className="lab-panel-intro">
        Salen de reglas fijas, no de un modelo. Cada una muestra su cálculo y las líneas del archivo que la respaldan.
      </p>

      {generated.length > 0 ? (
        <ol className="lab-insights" role="list">
          {generated.map((outcome, index) => {
            if (!outcome.insight) return null
            const isActive = highlightedInsight === outcome.id
            return (
              <li key={outcome.id} className={isActive ? 'lab-insight is-active' : 'lab-insight'}>
                <p className="lab-insight-rule">
                  <span className="lab-insight-number">{index + 1}</span> {outcome.rule}
                </p>
                <p className="lab-insight-statement">{outcome.insight.statement}</p>
                <p className="lab-insight-calculation">{outcome.insight.calculation}</p>
                <button
                  type="button"
                  className="lab-text-button"
                  aria-pressed={isActive}
                  onClick={() => onHighlight(isActive ? null : outcome.id)}
                >
                  Resaltar líneas {formatLineList(outcome.insight.lines)}
                </button>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="lab-insight-empty">Con estos datos no hay evidencia suficiente para ninguna observación.</p>
      )}

      {skipped.length > 0 && (
        <div className="lab-skipped">
          <h4 className="lab-skipped-title">Reglas sin evidencia suficiente</h4>
          <ul role="list">
            {skipped.map((outcome) => (
              <li key={outcome.id}>
                <strong>{outcome.rule}.</strong> {outcome.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default Observations
