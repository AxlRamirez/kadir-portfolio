# Portafolio de Kadir Ramírez

Repositorio del portafolio personal de Kadir Ramírez. Está construido con [Vite](https://vite.dev/), [React](https://react.dev/) y TypeScript.

## Estado actual

El proyecto está en su configuración inicial. La página solo muestra el mensaje «Portafolio de Kadir Ramírez — en construcción». Todavía no tiene secciones, diseño ni contenido del portafolio.

## Requisitos

- [Node.js](https://nodejs.org/) 20.19 o superior, o 22.12 o superior
- npm (se instala junto con Node.js)

## Instalación

```bash
npm install
```

## Comandos disponibles

| Comando           | Descripción                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo en `http://localhost:5173`         |
| `npm run build`   | Revisa los tipos con TypeScript y genera la versión final en `dist/` |
| `npm run preview` | Sirve localmente la versión generada en `dist/`                     |
| `npm run lint`    | Analiza el código con Oxlint                                        |

## Estructura

```
public/           Archivos estáticos (favicon)
src/main.tsx      Punto de entrada: monta la aplicación en la página
src/App.tsx       Componente principal
src/index.css     Estilos globales
index.html        Documento HTML base
```
