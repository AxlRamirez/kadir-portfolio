// Inserta el HTML de la aplicación en dist/index.html para que el contenido exista antes de que cargue
// el JavaScript, y aunque no llegue a cargar. Se ejecuta después de los builds de cliente y de servidor.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const serverDir = `${root}dist-ssr`
const indexPath = `${root}dist/index.html`

const { render } = await import(pathToFileURL(`${serverDir}/entry-server.js`).href)
const template = readFileSync(indexPath, 'utf8')
const placeholder = '<div id="root"></div>'

if (!template.includes(placeholder)) {
  throw new Error(`No se encontró ${placeholder} en dist/index.html`)
}

writeFileSync(indexPath, template.replace(placeholder, `<div id="root">${render()}</div>`))
rmSync(serverDir, { recursive: true, force: true })
console.log('Prerenderizado: dist/index.html')
