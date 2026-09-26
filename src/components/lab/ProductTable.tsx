import type { CSSProperties } from 'react'
import type { ProductSummary } from '../../lab/analysis.ts'
import { formatAmount, formatPercent, formatQuantity } from '../../lab/format.ts'

type ProductTableProps = {
  products: ProductSummary[]
  highlightedLines: ReadonlySet<number>
}

function ProductTable({ products, highlightedLines }: ProductTableProps) {
  const totalRevenueCents = products.reduce((sum, product) => sum + product.revenueCents, 0)

  return (
    <section className="lab-panel lab-products" aria-labelledby="lab-products-title">
      <h3 id="lab-products-title" className="lab-panel-title">
        Ventas por producto
      </h3>
      <p className="lab-panel-intro">
        Cada cantidad está en la unidad de su producto, así que no hay un total de unidades: solo los ingresos se
        pueden sumar.
      </p>

      <div className="lab-table-scroll" role="region" aria-labelledby="lab-products-title" tabIndex={0}>
        <table className="lab-table">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col" className="is-number">
                Cantidad vendida
              </th>
              <th scope="col" className="is-number">
                Ingresos
              </th>
              <th scope="col">Participación</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.productKey}
                className={product.lines.some((line) => highlightedLines.has(line)) ? 'is-highlighted' : undefined}
              >
                <th scope="row">{product.product}</th>
                <td className="is-number">{formatQuantity(product.quantity)}</td>
                <td className="is-number">{formatAmount(product.revenueCents)}</td>
                <td>
                  <span className="lab-share">
                    <span className="lab-share-track" aria-hidden="true">
                      <span className="lab-share-fill" style={{ '--ratio': product.revenueShare } as CSSProperties} />
                    </span>
                    {formatPercent(product.revenueShare)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td className="is-number">
                <span aria-hidden="true">—</span>
                <span className="visually-hidden">No se suman unidades de productos distintos</span>
              </td>
              <td className="is-number">{formatAmount(totalRevenueCents)}</td>
              <td>{formatPercent(1)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

export default ProductTable
