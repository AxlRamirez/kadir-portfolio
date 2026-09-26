import type { ServicesText } from '../types.ts'
import { prompts } from './prompts.ts'

export const services: ServicesText = {
  services: {
    index: 'Cómo puedo ayudarte',
    title: 'Servicios',
    intro: 'Dos formas de trabajar juntos. En las dos, antes de empezar dejamos por escrito qué incluye el trabajo.',
    whatsapp: 'Escribir por WhatsApp',
    email: 'Enviar un correo',
    topicContext: (topic) => ` sobre ${topic}`,
    detailsOpen: 'Ver qué incluye',
    detailsClose: 'Ocultar detalles',
    items: {
      websites: {
        title: 'Sitios web y landing pages',
        summary:
          'Para presentar un negocio, un servicio o un proyecto personal en una página clara, que se vea bien en el teléfono y lleve a la gente a escribirte.',
        price: {
          label: 'Rango orientativo',
          value: 'US$350–500',
          note: 'El precio final depende de los requisitos que acordemos.',
        },
        lists: [
          {
            title: 'Puede incluir',
            tone: 'includes',
            items: [
              'Diseño responsive, pensado primero para el teléfono.',
              'Desarrollo del sitio y su publicación.',
              'Entre 5 y 8 secciones, según el alcance que acordemos.',
              'Enlaces o botones de contacto por WhatsApp y correo.',
              'SEO técnico básico: títulos, descripciones, encabezados ordenados y una carga ligera.',
            ],
          },
          {
            title: 'Se detalla en la propuesta',
            tone: 'terms',
            items: [
              'El dominio del primer año, si está disponible y según el costo que acordemos.',
              'A nombre de quién queda el dominio, cómo se renueva, dónde se aloja el sitio y qué servicios de terceros intervienen.',
            ],
          },
          {
            title: 'No incluye, salvo que lo acordemos aparte',
            tone: 'excludes',
            items: [
              'Páginas independientes para cada sección: las secciones forman parte de un mismo sitio.',
              'Formularios que guarden o procesen datos en un servidor.',
              'Pagos en línea.',
              'Redacción de los textos: el contenido lo aportas tú y te indico qué necesita cada sección.',
              'Mantenimiento ilimitado ni posiciones garantizadas en buscadores.',
            ],
          },
        ],
        steps: null,
        contactTopic: 'un sitio web o landing page',
        whatsappMessage: 'Hola, Kadir. Me interesa un sitio web o una landing page. Te cuento de qué se trata:',
        emailSubject: 'Sitio web o landing page',
      },
      'custom-systems': {
        title: 'Sistemas web a medida',
        summary:
          'Para proyectos personales o empresariales que necesitan una herramienta propia: un registro de operaciones, un inventario o un panel de administración. Primero conversamos sobre los requisitos y después preparo una cotización.',
        price: {
          label: 'Precio',
          value: 'Según cotización',
          note: 'No doy un precio antes de entender el proyecto: cada sistema cambia según lo que tenga que hacer.',
        },
        lists: [],
        steps: {
          title: 'Antes de cotizar',
          items: [
            {
              title: 'Requisitos y usuarios',
              description: 'Qué problema resuelve el sistema, quién lo va a usar y qué necesita hacer cada persona.',
            },
            {
              title: 'Funciones, integraciones y datos',
              description:
                'Qué funciones hacen falta, con qué otros sistemas se conecta y qué información guarda o consulta.',
            },
            {
              title: 'Seguridad',
              description: 'Quién puede ver o cambiar cada cosa y cómo se protege la información.',
            },
            {
              title: 'Etapas',
              description: 'Dividimos el trabajo en entregas que puedas probar antes de seguir con la siguiente.',
            },
            {
              title: 'Cotización',
              description: 'Con todo eso definido, preparo una cotización por etapas.',
            },
          ],
        },
        contactTopic: 'un sistema web a medida',
        whatsappMessage: 'Hola, Kadir. Quiero conversar sobre un sistema web a medida. Te cuento la idea:',
        emailSubject: 'Sistema web a medida',
      },
    },
  },
  prompts: {
    index: 'Gratis, para copiar',
    title: 'Prompts gratuitos',
    intro:
      'Cuatro prompts para pedirle a un asistente de IA una revisión de tu proyecto con evidencia. Completa lo que está entre corchetes antes de enviarlos y revisa lo que te responda: la IA también se equivoca.',
    coversLabel: 'Qué revisa',
    copy: 'Copiar prompt',
    copied: 'Copiado',
    copiedStatus: 'Copiado al portapapeles. Completa los corchetes antes de enviarlo.',
    manualStatus:
      'No se pudo copiar automáticamente. El texto quedó seleccionado abajo: cópialo con Ctrl+C (Cmd+C en Mac) o, en el teléfono, con la opción Copiar del menú.',
    showText: 'Ver el prompt completo',
    items: prompts,
  },
}
