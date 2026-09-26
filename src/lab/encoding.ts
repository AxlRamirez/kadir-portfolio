const REPLACEMENT_CHARACTER = '\uFFFD'
const EXCERPT_RADIUS = 20

export type DecodeResult =
  | { ok: true; text: string }
  | {
      ok: false
      message: string
      /** Primera línea física con texto ilegible; `null` si el problema es del archivo completo. */
      line: number | null
      excerpt: string | null
    }

function excerptAround(lineText: string, index: number): string {
  const start = Math.max(0, index - EXCERPT_RADIUS)
  const end = Math.min(lineText.length, index + EXCERPT_RADIUS)
  return `${start > 0 ? '…' : ''}${lineText.slice(start, end).trim()}${end < lineText.length ? '…' : ''}`
}

/**
 * Política de codificación: los archivos deben estar en UTF-8, con o sin BOM.
 * No se intenta adivinar otra codificación. Si al decodificar aparece el carácter de reemplazo
 * (U+FFFD), el texto está dañado —normalmente porque el archivo se guardó en ANSI/Windows-1252—
 * y se rechaza, en lugar de analizar nombres de producto alterados como «Caf�».
 * También se rechaza si el propio archivo ya contenía U+FFFD: el texto se dañó antes de llegar aquí.
 */
export function decodeUtf8File(bytes: Uint8Array): DecodeResult {
  // Detectar la marca de UTF-16 solo sirve para dar un mensaje más preciso; no se decodifica.
  if ((bytes[0] === 0xff && bytes[1] === 0xfe) || (bytes[0] === 0xfe && bytes[1] === 0xff)) {
    return {
      ok: false,
      line: null,
      excerpt: null,
      message: 'El archivo está guardado en UTF-16 («Texto Unicode»). Guárdalo como «CSV UTF-8» y vuelve a cargarlo.',
    }
  }

  // Sin `fatal`, cada secuencia inválida se convierte en U+FFFD; así se puede ubicar la primera.
  // El decodificador descarta el BOM de UTF-8 si existe.
  const text = new TextDecoder('utf-8').decode(bytes)
  if (!text.includes(REPLACEMENT_CHARACTER)) return { ok: true, text }

  const lines = text.split(/\r\n|\n|\r/)
  const damagedLines = lines.flatMap((lineText, index) => (lineText.includes(REPLACEMENT_CHARACTER) ? [index + 1] : []))
  const firstLine = damagedLines[0]
  const firstLineText = lines[firstLine - 1]
  const others = damagedLines.length - 1

  return {
    ok: false,
    line: firstLine,
    excerpt: excerptAround(firstLineText, firstLineText.indexOf(REPLACEMENT_CHARACTER)),
    message: `Tiene caracteres que no se pudieron leer como UTF-8${others > 0 ? ` (y ${others} ${others === 1 ? 'línea más' : 'líneas más'} con el mismo problema)` : ''}. El archivo no está en UTF-8 o su texto está dañado. No se analizó para no mostrar nombres alterados. En Excel, usa Archivo › Guardar como › «CSV UTF-8» y vuelve a cargarlo.`,
  }
}
