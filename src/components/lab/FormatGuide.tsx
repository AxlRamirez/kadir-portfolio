import { MAX_DATA_RECORDS } from '../../lab/validation.ts'

const columns = [
  { name: 'fecha', rule: 'AAAA-MM-DD, por ejemplo 2026-03-05.' },
  { name: 'producto', rule: 'Texto. Mayúsculas y espacios repetidos no distinguen productos.' },
  { name: 'cantidad', rule: 'Mayor que 0, hasta 3 decimales (sirve para kilos o litros).' },
  { name: 'precio_unitario', rule: 'Mayor que 0, hasta 2 decimales, sin símbolo de moneda.' },
]

function FormatGuide() {
  return (
    <details className="lab-format">
      <summary>Formato del archivo</summary>
      <div className="lab-format-body">
        <p>La primera línea es el encabezado, con estas cuatro columnas en cualquier orden:</p>
        <dl className="lab-format-columns">
          {columns.map((column) => (
            <div key={column.name}>
              <dt>
                <code>{column.name}</code>
              </dt>
              <dd>{column.rule}</dd>
            </div>
          ))}
        </dl>
        <p>Así empieza la muestra descargable:</p>
        <pre className="lab-format-sample">
          {'fecha,producto,cantidad,precio_unitario\n2026-03-02,Café molido 500 g,6,12.50\n2026-03-02,Té verde (caja),4,8.75'}
        </pre>
        <ul className="lab-format-rules" role="list">
          <li>Separador de columnas: coma o punto y coma.</li>
          <li>
            Decimales con punto o coma (<code>12.50</code> o <code>12,50</code>). Si el separador es la coma, escribe
            entre comillas los valores con coma decimal. No uses separador de miles.
          </li>
          <li>Las líneas vacías se omiten y se informan. Las columnas adicionales se ignoran.</li>
          <li>
            Se rechazan cantidades y precios negativos o en cero: la herramienta analiza ventas, no devoluciones ni
            entregas sin costo.
          </li>
          <li>Si algún registro tiene errores no se calcula nada, para no mostrar resultados incompletos.</li>
          <li>
            Codificación UTF-8 (en Excel, «CSV UTF-8»). Si el texto no se puede leer como UTF-8, el archivo se rechaza en
            lugar de analizar nombres alterados.
          </li>
          <li>Hasta 1 MB y {MAX_DATA_RECORDS.toLocaleString('es-CR')} registros.</li>
        </ul>
      </div>
    </details>
  )
}

export default FormatGuide
