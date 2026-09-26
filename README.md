# Portafolio de Kadir Ramírez

Repositorio del portafolio personal de Kadir Ramírez. Está construido con [Vite](https://vite.dev/), [React](https://react.dev/) y TypeScript.

## Estado actual

La página tiene:

- Navegación con enlaces a las secciones; en escritorio queda fija arriba y marca la sección visible.
- Portada con presentación, un avance de los proyectos (sus capturas apiladas, enlazadas a la sección), un resumen breve de lo actual y lo anterior, y enlaces de contacto (LinkedIn, WhatsApp y correo, con opción de copiar la dirección).
- Sección de proyectos con cuatro sitios publicados, cada uno con vista previa y enlace. El primero se presenta destacado, el segundo en dos columnas y los demás en formato compacto.
- Laboratorio de datos: un analizador de ventas que funciona en el navegador (ver más abajo). La sección se muestra plegada, con una muestra del ejemplo, y se abre con «Abrir laboratorio».
- Trayectoria: la formación en FWD, el trabajo como Software Developer en Moovin Logistics (julio de 2023 a julio de 2025) y el desarrollo actual de InsightCenter.
- Sección de habilidades agrupadas por función, con una nota sobre inteligencia artificial vinculada al certificado de Elements of AI.
- Sección de certificaciones y formación: programas de FWD Costa Rica y certificaciones con su enlace de verificación cuando existe. Cada documento se puede ampliar en un visor accesible con el teclado.
- Pie con los enlaces de contacto.

Todavía no incluye CV descargable, páginas de casos ni la demo de IA.

### Diseño y movimiento

Los colores, tipografías, medidas y tiempos de animación están en variables de `src/index.css`. Cada sección usa uno de cuatro temas (`theme-dark`, `theme-light`, `theme-wash`, `theme-petrol`) que definen roles como `--bg`, `--fg` o `--accent`; los componentes usan esos roles y no los colores directamente.

La página se prerenderiza al generar la versión final, así que todo el contenido está en el HTML aunque JavaScript no cargue. La aparición escalonada de secciones (`src/motion/reveal.ts`) solo oculta elementos que JavaScript marcó y que están por debajo de la pantalla inicial, y se desactiva con `prefers-reduced-motion`. Las animaciones usan solo `transform` y `opacity`.

Para añadir una credencial, agrega una entrada en `src/data/credentials.ts` y, si hay copia del documento, su imagen en `src/assets/credentials/` con un texto alternativo que transcriba su contenido.

Para añadir un proyecto, agrega una entrada en `src/data/projects.ts` y su captura en `src/assets/projects/`. Si todavía no hay captura, omite `preview` y la página mostrará «Vista previa pendiente».

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
src/main.tsx                  Punto de entrada: hidrata el HTML prerenderizado (o monta la aplicación si no lo hay)
src/entry-server.tsx          Render a texto HTML que usa el prerender
src/App.tsx                   Composición de la página
src/index.css                 Paleta, temas, tipografía, medidas y estilos base
src/motion/reveal.ts          Aparición escalonada de contenido al hacer scroll
src/components/SiteHeader.*   Navegación
src/components/Hero.*         Portada y contacto
src/components/Projects.*     Sección de proyectos
src/components/ProjectEntry.* Presentación de un proyecto
src/components/Career.*       Trayectoria
src/components/Skills.*       Habilidades
src/components/Credentials.*  Certificaciones y formación
src/components/CredentialViewer.tsx  Visor ampliado de un documento (diálogo modal)
src/components/SiteFooter.*   Pie de página
src/components/lab/LabSection.*  Sección del laboratorio: cabecera, muestra y apertura del analizador
src/components/lab/           Resto de componentes del laboratorio (el analizador se carga al abrirlo)
src/lab/                      Lógica del laboratorio, sin React: parser CSV, validación, cálculos, observaciones y pruebas
src/data/projects.ts          Datos de los proyectos (textos, enlaces, vistas previas)
src/data/skills.ts            Datos de las habilidades y sus grupos
src/data/credentials.ts       Datos de las certificaciones y la formación
src/data/career.ts            Pasos de la trayectoria
src/data/contact.ts           Correo y enlaces de contacto (portada y pie)
src/assets/projects/          Vistas previas de los proyectos (WebP)
src/assets/credentials/       Copias de los certificados para la web (WebP)
src/assets/icons/             Íconos de tecnologías (SVG)
src/assets/fonts/             Tipografía Newsreader y su licencia
index.html                    Documento HTML base
scripts/prerender.mjs         Inserta el HTML renderizado en dist/index.html después del build
```

## Laboratorio de datos

Analiza ventas a partir de un CSV con las columnas `fecha`, `producto`, `cantidad` y `precio_unitario`. Al entrar muestra un ejemplo ficticio (`src/lab/sampleData.ts`), que se puede descargar como muestra y restablecer. También incluye un ejemplo con errores para ver la validación. Los archivos se leen con la API `File` del navegador y no se envían a ningún servidor. Si el navegador no puede leer el archivo (por ejemplo, porque se movió o se eliminó después de elegirlo), se muestra un error y se puede elegir otro. No usa IA: todo sale de cálculos y reglas explícitas.

La sección arranca plegada y el código del analizador (`DataLab.tsx` y sus dependencias) se descarga al abrirla; se adelanta la descarga cuando el puntero o el foco llegan al botón. Una vez abierto, el analizador sigue montado aunque se cierre, así que conserva el archivo, los filtros y los resultados. Los enlaces a `#laboratorio` lo abren y llevan a la sección; los enlaces a `#laboratorio-herramienta` lo abren y llevan el foco al analizador.

Flujo: `encoding.ts` decodifica los bytes como UTF-8, `csv.ts` separa registros y celdas, `validation.ts` convierte cada registro en una venta o en errores, `analysis.ts` calcula los totales e `insights.ts` aplica las reglas de observaciones. `pipeline.ts` une esos pasos.

### Decisiones de formato

- **Encabezado:** es obligatorio y admite cualquier orden. Mayúsculas, tildes, espacios y guiones no importan («Precio Unitario» equivale a `precio_unitario`). Las columnas adicionales se ignoran y se informa cuáles fueron.
- **Codificación:** solo UTF-8, con o sin BOM (en Excel, «CSV UTF-8»). El archivo se lee como bytes y se decodifica sin adivinar otras codificaciones. Si el resultado contiene caracteres de reemplazo (U+FFFD), por ejemplo en un CSV guardado como ANSI/Windows-1252, se rechaza completo y se indica la primera línea afectada con un extracto. Los archivos UTF-16 («Texto Unicode» de Excel) se reconocen por su marca inicial para dar un mensaje más claro, pero también se rechazan. Un U+FFFD escrito a propósito en el archivo se rechaza igual, porque no se puede distinguir de un daño.
- **Separador:** coma o punto y coma, detectado en la primera línea. Los campos entre comillas pueden contener separadores, saltos de línea y comillas dobles escapadas (`""`). Se elimina el BOM de Excel.
- **Fechas:** solo `AAAA-MM-DD`, y deben existir en el calendario. `05/03/2026` se rechaza con una sugerencia, porque puede significar 5 de marzo o 3 de mayo.
- **Decimales:** punto o coma (`12.50` o `12,50`). Se rechazan los separadores de miles (`1,250.00`) y los símbolos de moneda.
- **Cantidad:** mayor que 0, con hasta 3 decimales (productos por peso o volumen).
- **Precio unitario:** mayor que 0, con hasta 2 decimales.
- **Negativos y ceros:** se rechazan. La herramienta analiza ventas; las devoluciones y las entregas sin costo necesitarían otro modelo.
- **Líneas vacías:** se omiten y se informa su número. Un separador sobrante al final de la línea no cuenta como columna.
- **Productos:** se agrupan sin distinguir mayúsculas ni espacios repetidos y conservan el nombre de su primera aparición. Un salto de línea dentro del nombre cuenta como espacio.
- **Todo o nada:** si algún registro tiene errores no se calcula nada y se listan todos los problemas con su línea, columna y valor. Así el análisis nunca se basa, sin avisar, en una parte del archivo.
- **Límites:** 1 MB y 5 000 registros de datos.
- **Números de línea:** son las líneas físicas del archivo, las mismas que muestra un editor de texto (el encabezado suele ser la línea 1). Si un campo entre comillas ocupa varias líneas, el registro se identifica por su rango («Líneas 5–7»), y los registros siguientes conservan su línea real. Una comilla sin cerrar se informa en la línea donde se abre.

### Decisiones de cálculo

- **Importes exactos:** los importes se guardan en céntimos enteros y las cantidades en milésimas, leídos desde el texto, para evitar errores de coma flotante. El ingreso de cada registro es cantidad × precio, redondeado al céntimo (mitad hacia arriba).
- **Moneda:** el archivo no indica moneda, así que los importes se muestran sin símbolo.
- **Cantidades por producto:** se suman solo dentro de cada producto. No hay total de unidades y la evolución por fecha solo permite ver cantidades cuando se elige un producto.
- **Fechas sin registros:** la evolución por fecha muestra solo las fechas presentes. Una fecha que falta no se trata como cero.
- **Observaciones:** solo se generan si hay evidencia suficiente, y cada una indica su cálculo y las líneas que la respaldan:
  - Producto con mayores ingresos: requiere al menos dos productos y que no haya empate.
  - Mayor caída entre fechas consecutivas del archivo: requiere al menos dos fechas y una caída de al menos el 20 %. Avisa si entre ambas fechas hay días sin registros.
  - Fecha con mayores ingresos: requiere al menos dos fechas y que no haya empate.

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
