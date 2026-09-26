/** Lo mínimo que se usa de `File`; permite probar la lectura sin un navegador. */
export type ReadableFile = {
  name: string
  arrayBuffer(): Promise<ArrayBuffer>
}

export type FileBytesResult = { ok: true; bytes: Uint8Array } | { ok: false; message: string }

/**
 * `arrayBuffer()` puede rechazar (NotFoundError, NotReadableError…) si el archivo se movió, se borró o cambió
 * después de elegirlo, o si el sistema no permite leerlo. El motivo concreto no ayuda al visitante,
 * así que todos los casos dan el mismo mensaje con la acción que lo resuelve.
 */
export async function readFileBytes(file: ReadableFile): Promise<FileBytesResult> {
  try {
    return { ok: true, bytes: new Uint8Array(await file.arrayBuffer()) }
  } catch {
    return {
      ok: false,
      message: `No se pudo leer «${file.name}». Puede que se haya movido, eliminado o modificado después de elegirlo, o que el navegador no tenga permiso para abrirlo. Vuelve a elegirlo.`,
    }
  }
}
