// Inserta el HTML de cada página en su documento de dist/ para que el contenido exista antes de que cargue
// el JavaScript, y aunque no llegue a cargar. Se ejecuta después de los builds de cliente y de servidor.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const serverDir = `${root}dist-ssr`
const placeholder = '<div id="root"></div>'

const { routes, render } = await import(pathToFileURL(`${serverDir}/entry-server.js`).href)

for (const route of routes) {
  // Cada ruta es una carpeta con su index.html: /en/services/ se sirve desde dist/en/services/index.html.
  const file = `dist${route.path}index.html`
  const template = readFileSync(`${root}${file}`, 'utf8')
  if (!template.includes(placeholder)) {
    throw new Error(`No se encontró ${placeholder} en ${file}`)
  }
  if (!template.includes(`<html lang="${route.locale}">`)) {
    throw new Error(`${file} no declara lang="${route.locale}"`)
  }
  writeFileSync(`${root}${file}`, template.replace(placeholder, `<div id="root">${render(route)}</div>`))
  console.log(`Prerenderizado: ${file}`)
}

rmSync(serverDir, { recursive: true, force: true })
