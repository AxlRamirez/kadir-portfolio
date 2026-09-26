# Portafolio de Kadir Ramírez

Repositorio del portafolio personal de Kadir Ramírez. Está construido con [Vite](https://vite.dev/), [React](https://react.dev/) y TypeScript.

## Estado actual

El sitio tiene dos páginas, en español y en inglés:

| Página        | Español       | Inglés          | Contenido                                                  |
| ------------- | ------------- | --------------- | ---------------------------------------------------------- |
| Conocerme     | `/`           | `/en/`          | Proyectos, trayectoria, habilidades y formación            |
| Mis servicios | `/servicios/` | `/en/services/` | Los servicios que ofrezco y cuatro prompts gratuitos       |

Todas comparten:

- Navegación con enlaces a las secciones; en escritorio queda fija arriba y marca la sección visible. Desde Servicios, los enlaces a Proyectos, Trayectoria, Habilidades y Formación llevan a esas secciones en la portada del mismo idioma.
- Selector ES/EN en la cabecera, en escritorio y en móvil. Marca el idioma actual y lleva a la misma página en el otro idioma, conservando la sección si tiene equivalente (`/servicios/#prompt-seguridad` ↔ `/en/services/#prompt-security`); si no, lleva al inicio de esa página. No hay redirección automática según el idioma del navegador.
- Portada con el nombre, un selector entre las dos páginas que marca la actual, un avance de los proyectos (sus capturas apiladas, enlazadas a la sección), un resumen breve de lo actual y lo anterior, y enlaces de contacto (LinkedIn, WhatsApp y correo, con opción de copiar la dirección). El texto y los botones principales cambian según la página.
- Pie con la autoría del sitio y un enlace para volver arriba.

En la portada:

- Sección de proyectos con cuatro sitios publicados, cada uno con vista previa y enlace. El primero se presenta destacado, el segundo en dos columnas y los demás en formato compacto.
- Trayectoria: la formación en FWD, el trabajo como Software Developer en Moovin Logistics (julio de 2023 a julio de 2025) y el desarrollo actual de InsightCenter.
- Sección de habilidades agrupadas por función, con una nota sobre inteligencia artificial vinculada al certificado de Elements of AI.
- Sección de certificaciones y formación: programas de FWD Costa Rica y certificaciones con su enlace de verificación cuando existe. Cada documento se puede ampliar en un visor accesible con el teclado.

En Servicios:

- Servicios: sitios web y landing pages, con un rango orientativo de US$350–500, y sistemas web a medida, que se cotizan después de conversar sobre los requisitos. De cada uno se ven siempre el título, la descripción, el precio y los enlaces a WhatsApp y al correo (con un mensaje o asunto inicial en el idioma de la página). El alcance y las condiciones están en un desplegable «Ver qué incluye» / «Ocultar detalles» (`<details>`), que funciona con el teclado y sin JavaScript.
- Prompts gratuitos: auditoría de código, QA y accesibilidad, seguridad, y arquitectura y rendimiento. Cada uno se puede copiar con un botón que confirma la copia; si el portapapeles falla, el texto queda seleccionado para copiarlo a mano. Sin JavaScript, el texto completo sigue disponible en un desplegable.

Todavía no incluye CV descargable, páginas de casos ni la demo de IA.

### Rutas

Cada ruta es un documento HTML propio (`index.html`, `servicios/index.html`, `en/index.html` y `en/services/index.html`), con su entrada de JavaScript en `src/entries/` (`es-home.tsx`, `es-services.tsx`, `en-home.tsx`, `en-services.tsx`). No hay router: se pasa de una página a otra con enlaces normales, así que abrir una URL directamente, recargar y usar atrás y adelante funcionan como en cualquier sitio estático. Al generar la versión final, el contenido de cada ruta se prerenderiza en su HTML.

`src/routes.ts` es la fuente de las rutas: la lista de idiomas y páginas, la ruta de cada combinación y las anclas de cada sección en cada idioma (`#formacion` ↔ `#education`). De ahí salen los enlaces del menú, el selector de idioma, las entradas del build y el prerender.

Las páginas comparten `SiteLayout` (cabecera, portada y pie). El build separa ese código común en un archivo propio, y cada ruta descarga además solo lo suyo: su página, los textos de su idioma y los de la interfaz común. Las portadas no descargan los servicios ni los prompts, Servicios no descarga los proyectos, la trayectoria ni las certificaciones, y ninguna ruta descarga los textos del otro idioma.

El idioma, el título, la descripción y los enlaces `hreflang` de cada HTML los añade el plugin `pageHead` de `vite.config.ts` a partir de `src/head.ts` y los textos de `src/i18n/*/meta.ts`. La URL canónica solo se añade si se indica el dominio al compilar, porque la configuración actual no lo define:

```bash
SITE_URL=https://mi-dominio.com npm run build
```

Con `SITE_URL` (debe usar https), cada página recibe `<link rel="canonical">` y los enlaces entre idiomas pasan a ser absolutos, como piden los buscadores. Sin ella, esos enlaces son relativos a la raíz y no hay canónica.

Para añadir una página: añádela a `pageIds` y `pagePaths` en `src/routes.ts` (con sus anclas), escribe sus textos y su título y descripción en cada idioma dentro de `src/i18n/`, crea su componente en `src/pages/`, una entrada por idioma en `src/entries/` y un HTML por idioma en la carpeta de cada ruta, y regístrala en `src/entry-server.tsx`. TypeScript avisa si falta alguna ruta, ancla o texto.

### Textos e idiomas

Los textos viven en `src/i18n/`, una carpeta por idioma con los mismos archivos: `site.ts` (cabecera, portada, pie y mensajes comunes), `home.ts`, `services.ts`, `prompts.ts` y `meta.ts` (título y descripción de cada página). Los tipos de `src/i18n/types.ts` describen cada diccionario, y los datos con una entrada por elemento usan `Record<Id, …>` con los identificadores de `src/ids.ts`, así que si falta una traducción, un proyecto o un prompt en un idioma, el build no compila. Los campos que no siempre se usan se declaran como `string | null` para que también haya que decidirlos en cada idioma.

Lo que no depende del idioma (enlaces, imágenes, fechas, horas, títulos oficiales de las credenciales) está en `src/data/`. Los componentes son los mismos para los dos idiomas y reciben los textos por props o por el contexto de `src/components/siteContext.ts`, que también formatea las fechas según el idioma.

Los nombres de marcas, tecnologías y títulos oficiales se mantienen. Cuando el inglés cita un texto que solo existe en español (el título de un certificado, el texto de una aplicación), va entre comillas “…” con su traducción; los títulos en otro idioma que el de la página se marcan con `lang` para que los lectores de pantalla los pronuncien bien.

Para cambiar o añadir un texto, edítalo en los dos idiomas; `src/i18n/i18n.test.ts` comprueba que ambos diccionarios tengan la misma estructura, que no haya cadenas vacías, que la versión inglesa no contenga español fuera de las citas y que los mensajes de WhatsApp y los asuntos de correo estén en el idioma de su página.

### Diseño y movimiento

Los colores, tipografías, medidas y tiempos de animación están en variables de `src/index.css`. Cada sección usa uno de cuatro temas (`theme-dark`, `theme-light`, `theme-wash`, `theme-petrol`) que definen roles como `--bg`, `--fg` o `--accent`; los componentes usan esos roles y no los colores directamente.

Las páginas se prerenderizan al generar la versión final, así que todo el contenido está en el HTML aunque JavaScript no cargue. La aparición escalonada de secciones (`src/motion/reveal.ts`) solo oculta elementos que JavaScript marcó y que están por debajo de la pantalla inicial, y se desactiva con `prefers-reduced-motion`. Las animaciones usan solo `transform` y `opacity`; en la portada, el nombre y el texto principal solo se desplazan, sin opacidad, para que se lean desde el primer cuadro.

Para añadir una credencial, agrega su identificador en `src/ids.ts`, sus datos en `src/data/credentials.ts` y sus textos (tipo, emisor, resumen y un texto alternativo que transcriba el documento) en `home.ts` de cada idioma. Si hay copia del documento, su imagen va en `src/assets/credentials/`.

Para añadir un proyecto, agrega su identificador en `src/ids.ts`, su enlace y captura en `src/data/projects.ts` (la imagen en `src/assets/projects/`) y sus textos en `home.ts` de cada idioma. Si todavía no hay captura, omite `preview` y la página mostrará «Vista previa pendiente» o «Preview coming soon».

Los servicios están en `src/i18n/*/services.ts` y los prompts en `src/i18n/*/prompts.ts`, separados de la interfaz. Las pruebas de `src/i18n/prompts.test.ts` comprueban que cada prompt, en los dos idiomas, siga pidiendo contexto, restricciones, evidencia con archivo y línea, la separación entre hallazgos e hipótesis, prioridades y verificación, y que las dos versiones tengan los mismos apartados.

## Requisitos

- [Node.js](https://nodejs.org/) 20.19 o superior, o 22.12 o superior
- npm (se instala junto con Node.js)

## Instalación

```bash
npm install
```

## Comandos disponibles

| Comando           | Descripción                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo en `http://localhost:5173`                  |
| `npm run build`   | Revisa los tipos, genera la versión final en `dist/` y prerenderiza el HTML  |
| `npm run preview` | Sirve localmente la versión generada en `dist/`                              |
| `npm run lint`    | Analiza el código con Oxlint                                                 |
| `npm test`        | Ejecuta las pruebas de `src/**/*.test.ts` con el ejecutor de Node            |

Las pruebas usan `node:test` y la ejecución nativa de TypeScript de Node (que elimina los tipos sin compilar), así que no requieren dependencias adicionales. Hace falta Node 22.18 o superior para `npm test`; el resto de los comandos funciona con las versiones indicadas en «Requisitos».

## Estructura

```
public/favicon.svg            Ícono de la pestaña (iniciales KR)
index.html                    Documento HTML de / (Conocerme)
servicios/index.html          Documento HTML de /servicios/ (Mis servicios)
en/index.html                 Documento HTML de /en/ (About me)
en/services/index.html        Documento HTML de /en/services/ (Services)
src/routes.ts                 Idiomas, páginas, rutas y anclas de cada sección en cada idioma
src/ids.ts                    Identificadores de proyectos, credenciales, servicios, prompts, etc.
src/head.ts                   Título, descripción, hreflang y canónica de cada ruta
src/client.tsx                Hidrata el HTML prerenderizado de una página (o la monta si no lo hay)
src/entries/                  Una entrada de JavaScript por ruta
src/entry-server.tsx          Render a texto HTML de cada ruta, que usa el prerender
src/pages/                    Composición de cada página
src/i18n/types.ts             Tipos de los textos de cada idioma
src/i18n/es/, src/i18n/en/    Textos de la interfaz, las páginas, los servicios, los prompts y los metadatos
src/index.css                 Paleta, temas, tipografía, medidas y estilos base
src/motion/reveal.ts          Aparición escalonada de contenido al hacer scroll
src/components/SiteLayout.tsx Estructura común: cabecera, portada y pie
src/components/siteContext.ts Textos comunes del idioma actual y formato de fechas
src/components/SiteHeader.*   Navegación
src/components/LanguageSwitch.tsx  Selector ES/EN
src/components/Hero.*         Portada, selector de páginas y contacto
src/components/useFinePointer.ts  Elige el enlace de WhatsApp según el tipo de puntero
src/components/Projects.*     Sección de proyectos
src/components/ProjectEntry.* Presentación de un proyecto
src/components/Career.*       Trayectoria
src/components/Skills.*       Habilidades
src/components/Credentials.*  Certificaciones y formación
src/components/CredentialViewer.tsx  Visor ampliado de un documento (diálogo modal)
src/components/Services.*     Servicios y su desplegable de alcance
src/components/FreePrompts.*  Prompts gratuitos y su botón de copiar
src/components/SiteFooter.*   Pie de página
src/data/projects.ts          Enlaces y vistas previas de los proyectos
src/data/skills.ts            Habilidades de cada grupo
src/data/credentials.ts       Títulos oficiales, fechas, documentos y verificación de las credenciales
src/data/career.ts            Pasos de la trayectoria y sus enlaces
src/data/contact.ts           Correo, WhatsApp y enlaces de contacto
src/assets/projects/          Vistas previas de los proyectos (WebP)
src/assets/credentials/       Copias de los certificados para la web (WebP)
src/assets/icons/             Íconos de tecnologías (SVG)
src/assets/fonts/             Tipografía Newsreader y su licencia
scripts/prerender.mjs         Inserta el HTML renderizado de cada página en dist/ después del build
```

## Procedencia de recursos externos

Todos los recursos se sirven desde este repositorio; la página no carga nada de URLs externas (solo enlaza a ellas).

### Íconos de tecnologías

Salvo `database-generic.svg` (ver más abajo), los SVG de `src/assets/icons/` se copiaron sin modificaciones del paquete [Simple Icons](https://simpleicons.org/) **v16.32.0** ([repositorio](https://github.com/simple-icons/simple-icons)). El proyecto Simple Icons se publica bajo CC0-1.0, pero eso no significa que cada ícono sea CC0: cada logotipo es una marca de su propietario y se usa únicamente para identificar la tecnología correspondiente. Ver el [aviso legal de Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md).

La columna «Licencia» refleja los datos del propio paquete; «—» indica que Simple Icons no registra una licencia para ese ícono.

| Tecnología | Archivo          | Fuente original                                                                                   | Guías de marca                                                             | Licencia  |
| ---------- | ---------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------- |
| JavaScript | `javascript.svg` | [logo.js](https://github.com/voodootikigod/logo.js)                                               | —                                                                          | MIT       |
| TypeScript | `typescript.svg` | [typescriptlang.org/branding](https://www.typescriptlang.org/branding)                            | [Branding](https://www.typescriptlang.org/branding)                        | —         |
| React      | `react.svg`      | [create-react-app](https://github.com/facebook/create-react-app)                                  | —                                                                          | —         |
| HTML       | `html5.svg`      | [w3.org/html/logo](https://www.w3.org/html/logo/)                                                 | —                                                                          | —         |
| CSS        | `css.svg`        | [CSS-Next/logo.css](https://github.com/CSS-Next/logo.css)                                         | [CSS-Next/logo.css](https://github.com/CSS-Next/logo.css)                  | —         |
| jQuery     | `jquery.svg`     | [brand.jquery.org](https://brand.jquery.org/logos/)                                               | [brand.jquery.org](https://brand.jquery.org/logos/)                        | —         |
| Bootstrap  | `bootstrap.svg`  | [Bootstrap brand](https://getbootstrap.com/docs/5.3/about/brand)                                  | [Bootstrap brand](https://getbootstrap.com/docs/5.3/about/brand)           | MIT       |
| Node.js    | `nodedotjs.svg`  | [nodejs.org/en/about/branding](https://nodejs.org/en/about/branding)                              | [Branding](https://nodejs.org/en/about/branding)                           | —         |
| NestJS     | `nestjs.svg`     | [nestjs.com](https://nestjs.com)                                                                  | —                                                                          | —         |
| Python     | `python.svg`     | [python.org/community/logos](https://www.python.org/community/logos/)                             | [Python logos](https://www.python.org/community/logos/)                    | —         |
| PostgreSQL | `postgresql.svg` | [wiki.postgresql.org/wiki/Logo](https://wiki.postgresql.org/wiki/Logo)                            | [Trademark policy](https://www.postgresql.org/about/policies/trademarks/)  | —         |
| Git        | `git.svg`        | [git-scm.com/community/logos](https://git-scm.com/community/logos)                                | —                                                                          | CC BY 3.0 |
| Docker     | `docker.svg`     | [Docker media resources](https://www.docker.com/company/newsroom/media-resources)                 | —                                                                          | —         |
| Firebase   | `firebase.svg`   | [firebase.google.com/brand-guidelines](https://firebase.google.com/brand-guidelines)              | [Brand guidelines](https://firebase.google.com/brand-guidelines)           | —         |

**SQL** no tiene un logotipo oficial: es un lenguaje estándar, no una marca. Por eso `database-generic.svg` es un símbolo genérico de base de datos (un cilindro) dibujado para este proyecto; no representa a ningún producto ni imita un logotipo. Su propio `<title>` lo identifica como símbolo genérico, y en la página siempre aparece junto al texto «SQL».

El logotipo de Git es obra de [Jason Long](https://github.com/jasonlong) y se usa bajo la licencia [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/).

Los íconos se muestran en un solo color, que es el formato en el que los distribuye Simple Icons.

### Vistas previas de proyectos

Las imágenes de `src/assets/projects/` son capturas propias de la página pública de cada sitio, tomadas el 25 de septiembre de 2026 con Chrome en modo headless (1280 × 800, WebP). No se inició sesión en ningún sitio: la vista previa de «Inventario de bodega» muestra solo su pantalla de acceso. Los archivos `-640` y `-960` son reducciones de esas mismas capturas (WebP, calidad 0,86) para pantallas que no necesitan la original. Los contenidos y marcas visibles en las capturas pertenecen a sus respectivos sitios.

### Certificados

Las imágenes de `src/assets/credentials/` son copias de los documentos del propietario del portafolio, convertidas a WebP (calidad 0,88) sin cambiar su tamaño en píxeles. La vista previa de «TI Redes y Soporte Técnico» se giró 90° para corregir su orientación, sin recortar. En la copia de la certificación SFPC se ocultó el número de certificado. La imagen de la DSPC es la insignia de su credencial digital, no el certificado. «Full Stack Developer» es una fotografía del certificado impreso. Los logotipos visibles pertenecen a sus emisores.

### Tipografía

`src/assets/fonts/newsreader-latin-wght-normal.woff2` es [Newsreader](https://github.com/productiontype/Newsreader) (Production Type), obtenida del paquete [@fontsource-variable/newsreader](https://fontsource.org/fonts/newsreader) **v5.3.0**, subconjunto latino con peso variable. Se distribuye bajo la [SIL Open Font License 1.1](src/assets/fonts/OFL.txt), incluida junto al archivo.
