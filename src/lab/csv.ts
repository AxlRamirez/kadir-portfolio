export type CsvDelimiter = ',' | ';'

export type CsvRecord = {
  cells: string[]
  /** Línea física del archivo donde empieza el registro; la primera línea es la 1. */
  line: number
  /** Línea donde termina. Es mayor que `line` cuando un campo entre comillas contiene saltos de línea. */
  endLine: number
}

export type CsvParseResult =
  | { ok: true; delimiter: CsvDelimiter; records: CsvRecord[] }
  | { ok: false; message: string; line: number }

// Excel en configuración regional española exporta con punto y coma, así que se aceptan ambos separadores.
// Se elige el que más aparece en la primera línea (el encabezado).
function detectDelimiter(text: string): CsvDelimiter {
  const firstLine = text.split(/\r\n|\n|\r/, 1)[0] ?? ''
  const semicolons = firstLine.split(';').length - 1
  const commas = firstLine.split(',').length - 1
  return semicolons > commas ? ';' : ','
}

/**
 * Convierte texto CSV en registros de celdas sin interpretar su contenido.
 * Sigue las reglas habituales de RFC 4180: campos entre comillas dobles pueden contener
 * separadores y saltos de línea, y `""` dentro de ellos representa una comilla literal.
 * Cada registro conserva las líneas físicas que ocupa, para que los errores señalen
 * la misma línea que muestra un editor de texto aunque haya campos de varias líneas.
 */
export function parseCsv(input: string): CsvParseResult {
  const text = input.startsWith('\uFEFF') ? input.slice(1) : input
  const delimiter = detectDelimiter(text)

  const records: CsvRecord[] = []
  let cells: string[] = []
  let field = ''
  let inQuotes = false
  let line = 1
  let recordStartLine = 1
  let quoteStartLine = 1

  const endField = () => {
    cells.push(field)
    field = ''
  }
  const endRecord = () => {
    endField()
    records.push({ cells, line: recordStartLine, endLine: line })
    cells = []
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const isLineBreak = char === '\r' || char === '\n'
    // \r\n cuenta como un solo salto de línea, dentro o fuera de comillas.
    const lineBreak = char === '\r' && text[i + 1] === '\n' ? '\r\n' : char

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else if (isLineBreak) {
        field += lineBreak
        i += lineBreak.length - 1
        line++
      } else {
        field += char
      }
      continue
    }

    if (char === '"' && field === '') {
      inQuotes = true
      quoteStartLine = line
    } else if (char === delimiter) {
      endField()
    } else if (isLineBreak) {
      i += lineBreak.length - 1
      endRecord()
      line++
      recordStartLine = line
    } else {
      field += char
    }
  }

  if (inQuotes) {
    return {
      ok: false,
      line: quoteStartLine,
      message: `La comilla que se abre en la línea ${quoteStartLine} no se cierra. Revisa que cada valor entre comillas termine con otra comilla.`,
    }
  }

  // Un salto de línea al final del archivo no crea un registro adicional.
  if (field !== '' || cells.length > 0) endRecord()

  return { ok: true, delimiter, records }
}
