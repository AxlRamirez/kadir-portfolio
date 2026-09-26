import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Connect, type HtmlTagDescriptor, type Plugin } from 'vite'
import { headTags } from './src/head.ts'
import { routeKey, routes } from './src/routes.ts'

/* Como hacen los hosts estáticos, /servicios lleva a /servicios/: sin la barra, el servidor de desarrollo y la
   vista previa no encuentran la página. En producción esta redirección depende del host. */
function trailingSlashRedirect(): Plugin {
  const folders = new Set(routes.map(({ path }) => path.slice(0, -1)).filter(Boolean))
  const redirect: Connect.NextHandleFunction = (req, res, next) => {
    const [path, query] = (req.url ?? '').split('?')
    if (!folders.has(path)) return next()
    res.statusCode = 301
    res.setHeader('Location', `${path}/${query ? `?${query}` : ''}`)
    res.end()
  }
  return {
    name: 'trailing-slash-redirect',
    configureServer: (server) => void server.middlewares.use(redirect),
    configurePreviewServer: (server) => void server.middlewares.use(redirect),
  }
}

/* URL pública del sitio, solo si se indica al compilar (SITE_URL=https://… npm run build). Con ella se añade
   la URL canónica y los enlaces entre idiomas pasan a ser absolutos, como piden los buscadores. */
function siteUrl(): string | undefined {
  const value = process.env.SITE_URL
  if (!value) return undefined
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error(`SITE_URL debe usar https: ${value}`)
  return url.origin
}

const escapeText = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* Idioma, título, descripción y enlaces entre idiomas de cada HTML, desde los textos de src/i18n. Se aplica
   igual en desarrollo y en el build, antes del prerender. */
function pageHead(): Plugin {
  const url = siteUrl()
  return {
    name: 'page-head',
    transformIndexHtml(html, { path }) {
      const route = routes.find((candidate) => `${candidate.path}index.html` === path)
      if (!route) throw new Error(`No hay una ruta para ${path}`)
      const tags: HtmlTagDescriptor[] = headTags(route, url).map(({ tag, attrs, text }) => ({
        tag,
        attrs,
        children: text === undefined ? undefined : escapeText(text),
        injectTo: 'head',
      }))
      return { html: html.replace(/<html lang="[^"]*">/, `<html lang="${route.locale}">`), tags }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), trailingSlashRedirect(), pageHead()],
  // Varias páginas HTML: una ruta desconocida responde 404 en vez de mostrar la página de inicio.
  appType: 'mpa',
  build: {
    // Los recursos pequeños incrustados como data: iban dos veces en la carga inicial, en el HTML prerenderizado
    // y en el JavaScript, aunque se usen más abajo con carga diferida. Como archivos se piden solo al necesitarse.
    assetsInlineLimit: 0,
    rolldownOptions: {
      // Una página HTML por ruta, cada una con su entrada: ninguna descarga el contenido ni el idioma de otra.
      input: Object.fromEntries(
        routes.map((route) => [routeKey(route), fileURLToPath(new URL(`.${route.path}index.html`, import.meta.url))]),
      ),
    },
  },
})
