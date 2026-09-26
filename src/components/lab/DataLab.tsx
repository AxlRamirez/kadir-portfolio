import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { readFileBytes } from '../../lab/fileReading.ts'
import { fileIssue, MAX_FILE_BYTES, readSalesCsv, readSalesFile } from '../../lab/pipeline.ts'
import { INVALID_SAMPLE_CSV, SAMPLE_CSV, SAMPLE_FILE_NAME } from '../../lab/sampleData.ts'
import type { ValidationResult } from '../../lab/types.ts'
import FormatGuide from './FormatGuide.tsx'
import LabResults from './LabResults.tsx'
import ValidationReport from './ValidationReport.tsx'
import './DataLab.css'

type DataSource = { kind: 'sample' } | { kind: 'invalid-sample' } | { kind: 'file'; name: string }

type LabData = {
  source: DataSource
  result: ValidationResult
  /** Cambia en cada carga para reiniciar filtros y resaltados de los resultados. */
  version: number
}

// El BOM hace que Excel abra la muestra como UTF-8 y muestre bien las tildes.
const SAMPLE_DOWNLOAD_HREF = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${SAMPLE_CSV}`)}`

function describeResult(source: DataSource, result: ValidationResult): string {
  const origin = source.kind === 'file' ? `El archivo ${source.name}` : source.kind === 'sample' ? 'El ejemplo' : 'El ejemplo con errores'
  if (result.ok) {
    return `${origin} se validó: ${result.records.length} ${result.records.length === 1 ? 'registro' : 'registros'} listos para el análisis.`
  }
  return `${origin} tiene ${result.issues.length} ${result.issues.length === 1 ? 'problema' : 'problemas'}. No se calculó el análisis.`
}

type DataLabProps = {
  /** Se llama cuando el analizador ya está en la página, para poder situarlo. */
  onReady?: () => void
}

/** El analizador completo. Se carga bajo demanda desde LabSection, que aporta la cabecera de la sección. */
function DataLab({ onReady }: DataLabProps) {
  useEffect(() => {
    onReady?.()
  }, [onReady])

  const [data, setData] = useState<LabData>(() => ({
    source: { kind: 'sample' },
    result: readSalesCsv(SAMPLE_CSV),
    version: 0,
  }))
  const [announcement, setAnnouncement] = useState('')
  const latestRead = useRef(0)

  const show = (source: DataSource, result: ValidationResult) => {
    setData((current) => ({ source, result, version: current.version + 1 }))
    setAnnouncement(describeResult(source, result))
  }

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    // Vaciar el campo permite volver a elegir el mismo archivo después de corregirlo.
    input.value = ''
    if (!file) return

    // Si se eligen dos archivos seguidos, solo se muestra el último, aunque el anterior termine de leerse después.
    const readId = ++latestRead.current
    const source: DataSource = { kind: 'file', name: file.name }
    if (file.size > MAX_FILE_BYTES) {
      show(source, fileIssue('El archivo supera 1 MB. Divide los datos en archivos más pequeños.'))
      return
    }

    // Se leen los bytes y no `file.text()`, que reemplaza en silencio lo que no es UTF-8 válido.
    const read = await readFileBytes(file)
    if (readId !== latestRead.current) return
    show(source, read.ok ? readSalesFile(read.bytes) : fileIssue(read.message))
  }

  const resetToSample = () => show({ kind: 'sample' }, readSalesCsv(SAMPLE_CSV))
  const loadInvalidSample = () => show({ kind: 'invalid-sample' }, readSalesCsv(INVALID_SAMPLE_CSV))

  const { source, result, version } = data

  return (
    <div className="lab-tool">
      <div className="lab-source" aria-labelledby="lab-source-title" role="group">
        <div className="lab-source-main">
          <h3 id="lab-source-title" className="lab-kicker">
            Datos en uso
          </h3>
          {source.kind === 'sample' && (
            <p className="lab-source-name">
              <span className="lab-badge">Ejemplo ficticio</span> Ventas inventadas de una tienda imaginaria, para
              mostrar el análisis.
            </p>
          )}
          {source.kind === 'invalid-sample' && (
            <p className="lab-source-name">
              <span className="lab-badge">Ejemplo con errores</span> Un archivo preparado con fallos frecuentes, para
              ver cómo se reportan.
            </p>
          )}
          {source.kind === 'file' && (
            <p className="lab-source-name">
              <span className="lab-badge">Tu archivo</span> <span className="lab-file-name">{source.name}</span>,
              sin salir de este navegador.
            </p>
          )}

          <div className="lab-actions">
            <input
              id="lab-file"
              className="visually-hidden"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
            />
            <label htmlFor="lab-file" className="lab-button lab-button-primary">
              Cargar un CSV
            </label>
            <a className="lab-button" href={SAMPLE_DOWNLOAD_HREF} download={SAMPLE_FILE_NAME}>
              Descargar la muestra
            </a>
            <button type="button" className="lab-button" onClick={resetToSample}>
              Restablecer el ejemplo
            </button>
            <button type="button" className="lab-button lab-button-quiet" onClick={loadInvalidSample}>
              Probar un archivo con errores
            </button>
          </div>
        </div>

        <FormatGuide />
      </div>

      <p className="visually-hidden" role="status">
        {announcement}
      </p>

      {result.ok ? (
        <LabResults key={version} records={result.records} skippedEmptyLines={result.skippedEmptyLines} ignoredColumns={result.ignoredColumns} />
      ) : (
        <ValidationReport issues={result.issues} skippedEmptyLines={result.skippedEmptyLines} onReset={resetToSample} />
      )}
    </div>
  )
}

export default DataLab
