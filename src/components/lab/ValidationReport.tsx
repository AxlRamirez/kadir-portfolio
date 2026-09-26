import { formatLineList, formatLineRange } from '../../lab/format.ts'
import type { ValidationIssue } from '../../lab/types.ts'

type ValidationReportProps = {
  issues: ValidationIssue[]
  skippedEmptyLines: number[]
  onReset: () => void
}

/** Un archivo muy dañado podría generar miles de errores; los primeros bastan para saber qué corregir. */
const MAX_VISIBLE_ISSUES = 100

// Un valor entre comillas puede contener saltos de línea; se muestran como ↵ para que se vean en una sola línea.
function showLineBreaks(value: string): string {
  return value.replace(/\r\n|\n|\r/g, ' ↵ ')
}

function countAffectedLines(issues: ValidationIssue[]): number {
  const lines = new Set<number>()
  for (const issue of issues) {
    if (issue.line === null) continue
    for (let line = issue.line; line <= (issue.endLine ?? issue.line); line++) lines.add(line)
  }
  return lines.size
}

function ValidationReport({ issues, skippedEmptyLines, onReset }: ValidationReportProps) {
  const fileIssues = issues.filter((issue) => issue.line === null)
  const locatedIssues = issues.filter((issue) => issue.line !== null)
  const visibleIssues = locatedIssues.slice(0, MAX_VISIBLE_ISSUES)
  const affectedLines = countAffectedLines(locatedIssues)

  return (
    <section className="lab-report" aria-labelledby="lab-report-title">
      <h3 id="lab-report-title" className="lab-report-title">
        {issues.length} {issues.length === 1 ? 'problema' : 'problemas'} por corregir
        {affectedLines > 0 && ` en ${affectedLines} ${affectedLines === 1 ? 'línea' : 'líneas'}`}
      </h3>
      <p className="lab-report-intro">
        No se calculó ningún resultado, para no mostrar un análisis incompleto. Corrige el archivo y vuelve a cargarlo.
        Los números de línea son los mismos que muestra un editor de texto.
        {skippedEmptyLines.length === 1 && ` La línea vacía ${skippedEmptyLines[0]} se omite y no cuenta como error.`}
        {skippedEmptyLines.length > 1 && ` Las líneas vacías (${formatLineList(skippedEmptyLines)}) se omiten y no cuentan como error.`}
      </p>

      {fileIssues.length > 0 && (
        <ul className="lab-report-file" role="list">
          {fileIssues.map((issue) => (
            <li key={issue.message}>{issue.message}</li>
          ))}
        </ul>
      )}

      {visibleIssues.length > 0 && (
        <ol className="lab-issues" role="list">
          {visibleIssues.map((issue, index) => {
            const line = issue.line ?? 0
            const endLine = issue.endLine ?? line
            return (
              <li key={`${line}-${issue.column ?? 'registro'}-${index}`} className="lab-issue">
                <p className="lab-issue-where">
                  <span className="lab-issue-row">
                    {line === endLine ? 'Línea' : 'Líneas'} {formatLineRange(line, endLine)}
                  </span>
                  <span>{issue.column ? <code>{issue.column}</code> : line === endLine ? 'Toda la línea' : 'Todo el registro'}</span>
                </p>
                <p className="lab-issue-value">
                  <span className="lab-issue-label">Valor recibido</span>{' '}
                  {issue.value === null || issue.value.trim() === '' ? <em>(vacío)</em> : <code>{showLineBreaks(issue.value)}</code>}
                </p>
                <p className="lab-issue-message">{issue.message}</p>
              </li>
            )
          })}
        </ol>
      )}
      {locatedIssues.length > MAX_VISIBLE_ISSUES && (
        <p className="lab-report-more">
          Se muestran los primeros {MAX_VISIBLE_ISSUES} de {locatedIssues.length} problemas.
        </p>
      )}

      <button type="button" className="lab-button" onClick={onReset}>
        Volver al ejemplo
      </button>
    </section>
  )
}

export default ValidationReport
