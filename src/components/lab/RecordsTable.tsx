import { useEffect, useRef } from 'react'
import { formatAmount, formatDate, formatLineRange, formatQuantity } from '../../lab/format.ts'
import type { SaleRecord } from '../../lab/types.ts'

type RecordsTableProps = {
  records: SaleRecord[]
  highlightedLines: ReadonlySet<number>
}

function RecordsTable({ records, highlightedLines }: RecordsTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Desplaza solo el contenedor de la tabla, no la página, para que el primer registro resaltado quede a la vista.
  useEffect(() => {
    const container = scrollRef.current
    const firstRow = container?.querySelector<HTMLTableRowElement>('tbody tr.is-highlighted')
    if (!container || !firstRow) return
    const headerHeight = container.querySelector('thead')?.offsetHeight ?? 0
    const smooth = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    container.scrollTo({ top: firstRow.offsetTop - headerHeight, behavior: smooth ? 'smooth' : 'auto' })
  }, [highlightedLines])

  return (
    <section className="lab-panel lab-records" aria-labelledby="lab-records-title">
      <h3 id="lab-records-title" className="lab-panel-title">
        Registros validados
      </h3>
      <p className="lab-panel-intro">
        {records.length} {records.length === 1 ? 'registro' : 'registros'} tal como se leyeron. «Línea» es donde empieza
        cada registro en el archivo, igual que en un editor de texto.
      </p>

      <div ref={scrollRef} className="lab-table-scroll lab-records-scroll" role="region" aria-labelledby="lab-records-title" tabIndex={0}>
        <table className="lab-table">
          <thead>
            <tr>
              <th scope="col" className="is-number">
                Línea
              </th>
              <th scope="col">Fecha</th>
              <th scope="col">Producto</th>
              <th scope="col" className="is-number">
                Cantidad
              </th>
              <th scope="col" className="is-number">
                Precio unitario
              </th>
              <th scope="col" className="is-number">
                Ingreso
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const isHighlighted = highlightedLines.has(record.line)
              return (
                <tr key={record.line} className={isHighlighted ? 'is-highlighted' : undefined}>
                  <td className="is-number">
                    {formatLineRange(record.line, record.endLine)}
                    {isHighlighted && <span className="visually-hidden"> (resaltada)</span>}
                  </td>
                  <td>
                    <time dateTime={record.date}>{formatDate(record.date)}</time>
                  </td>
                  <td>{record.product}</td>
                  <td className="is-number">{formatQuantity(record.quantity)}</td>
                  <td className="is-number">{formatAmount(record.unitPriceCents)}</td>
                  <td className="is-number">{formatAmount(record.revenueCents)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RecordsTable
