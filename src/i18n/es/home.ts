import { FULL_NAME } from '../names.ts'
import type { HomeText } from '../types.ts'

export const home: HomeText = {
  projects: {
    index: 'Trabajo publicado',
    title: 'Proyectos',
    intro: 'Una selección de sitios y aplicaciones publicados. Cada uno enlaza a su versión en línea.',
    visit: 'Visitar sitio',
    noteLabel: 'Nota:',
    previewPending: 'Vista previa pendiente',
    items: {
      insightcenter: {
        name: 'InsightCenter',
        kind: 'Plataforma de integración y analítica',
        description:
          'Sitio público de la plataforma que estoy desarrollando para integrar información de ERP, APIs, bases de datos y archivos, conservar su trazabilidad y prepararla para analítica.',
        context: 'Plataforma: React, NestJS, PostgreSQL y ETL en Python',
        note: null,
        previewAlt:
          'Portada del sitio de InsightCenter con el titular «Conecta la información de tu empresa y entiende mejor tu operación» junto a una vista de la aplicación.',
      },
      'landing-ismael': {
        name: 'Landing page para Ismael',
        kind: 'Landing page',
        description:
          'Página de presentación de Ismael Vasquez Quiros, que comparte herramientas y estrategias para explorar ingresos en línea. Explica el punto de partida, lo que ofrece y cómo empezar, y lleva el contacto a WhatsApp.',
        context: 'Publicada en Vercel',
        note: null,
        previewAlt:
          'Portada de la landing page de Ismael Vasquez Quiros con el titular «Construye una vida con más libertad, empezando desde donde estás» y su fotografía.',
      },
      'control-diesel': {
        name: 'Control de diésel',
        kind: 'Aplicación web',
        description:
          'Formulario para registrar dispensaciones de combustible con placa, cliente, lectura de odómetro, litros e imágenes de evidencia, y mostrar el resultado de consumo. Tiene un acceso aparte al panel administrativo.',
        context: 'Publicada en Firebase Hosting',
        //note: 'El enlace lleva a una herramienta operativa en uso. Puedes ver el formulario, pero no envíes registros de prueba.',
        note: null,
        previewAlt:
          'Formulario «Registro de dispensación» de Control de Diesel con campos de placa, cliente, fecha, odómetro, litros e imágenes de evidencia.',
      },
      'inventario-bodega': {
        name: 'Inventario de bodega',
        kind: 'Aplicación web',
        description:
          'Sistema de inventario con acceso mediante PIN de cuatro dígitos y un modo invitado de solo lectura para consultar productos. La vista previa muestra únicamente la pantalla de acceso.',
        context: 'Publicada en Firebase Hosting',
        note: null,
        previewAlt:
          'Pantalla de acceso del inventario con el logotipo de La Costa Distribución, un campo para el PIN y el botón para entrar como invitado.',
      },
    },
  },
  career: {
    index: 'De la formación a hoy',
    title: 'Trayectoria',
    intro:
      'Me formé en FWD Costa Rica y trabajé dos años como Software Developer en Moovin Logistics. También tengo experiencia en procesos administrativos y soporte TI. Las fechas de formación son las de los certificados.',
    linkLabels: { education: 'Ver el certificado', projects: 'Ver el proyecto' },
    items: {
      fwd: {
        when: 'may – dic 2023',
        stage: 'Formación',
        title: 'Programa de desarrollo full stack',
        place: 'FWD Costa Rica',
        description:
          'Programa «Desarrolladores de Software Full-Stack Bilingües», de 1080 horas, con MySQL, Rails, React y JavaScript.',
      },
      moovin: {
        when: 'jul 2023 – jul 2025',
        stage: 'Experiencia laboral',
        title: 'Software Developer',
        place: 'Moovin Logistics · jornada completa, en remoto',
        description:
          'Desarrollo de interfaz web para el sistema logístico de la empresa usando React, JavaScript, HTML y CSS.',
      },
      insightcenter: {
        when: 'Hoy',
        stage: 'En desarrollo',
        title: 'InsightCenter',
        place: 'Plataforma de integración y analítica',
        description:
          'Desarrollo una plataforma para integrar información de ERP, APIs, bases de datos y archivos, con React, NestJS, PostgreSQL y procesos ETL en Python.',
      },
    },
  },
  skills: {
    index: 'Stack técnico',
    title: 'Habilidades',
    intro: 'Tecnologías con las que trabajo, agrupadas por la función que cumplen.',
    groups: {
      frontend: {
        title: 'Lenguajes y frontend',
        description: 'Interfaces web, desde la maquetación hasta la lógica del cliente.',
      },
      backend: { title: 'Backend e integración', description: 'APIs, servicios y conexión entre sistemas.' },
      data: { title: 'Datos y automatización', description: 'Consultas, bases de datos relacionales y procesos ETL.' },
      tools: {
        title: 'Herramientas y flujo de trabajo',
        description: 'Control de versiones y entornos reproducibles.',
      },
    },
    ai: {
      title: 'Inteligencia artificial',
      text: {
        before: 'Conozco sus fundamentos y aplicaciones: completé ',
        strong: 'Elements of AI',
        after:
          ', de la Universidad de Helsinki y MinnaLearn. Me interesa integrarla en productos de software y en el análisis de datos.',
      },
      link: 'Ver el certificado',
    },
  },
  credentials: {
    index: 'Documentos',
    title: 'Certificaciones',
    titleTail: 'y formación',
    intro: 'Formación técnica y certificaciones. Puedes ampliar cada documento para leerlo completo.',
    enlarge: 'Ampliar',
    enlargeContext: ' el documento: ',
    missingDocument: 'Sin copia del documento',
    facts: {
      period: 'Periodo',
      duration: 'Duración',
      hours: (hours) => `${hours} horas`,
      expires: 'Vence',
    },
    verification: (label, source) => `${label} en ${source}`,
    viewer: { close: 'Cerrar', openOriginal: 'Abrir la imagen en tamaño original' },
    groups: {
      technical: {
        title: 'Formación técnica',
        description: 'Programas de FWD Costa Rica, con las horas y el periodo que indica cada certificado.',
      },
      certifications: {
        title: 'Certificaciones',
        description: 'Certificaciones profesionales y un curso en línea, con su enlace de verificación cuando existe.',
      },
    },
    items: {
      'fwd-full-stack': {
        kind: 'Certificado de participación',
        issuer: 'FWD Costa Rica',
        summary:
          'Programa «Desarrolladores de Software Full-Stack Bilingües». En el certificado figuran MySQL, Rails, React y JavaScript.',
        issuedLabel: 'Emitido',
        titleTranslation: null,
        documentAlt: `Certificado de participación de FWD Costa Rica a nombre de ${FULL_NAME} por completar el programa «Desarrolladores de Software Full-Stack Bilingües», con el título Full Stack Developer. Impartido del 22 de mayo al 15 de diciembre de 2023, con una duración de 1080 horas. Chacarita, Puntarenas, 2 de febrero de 2024. Incluye los logotipos de MySQL, Rails, React y JavaScript y las firmas de tres directores.`,
        documentNote: 'Fotografía del certificado impreso.',
        verificationLabel: null,
      },
      'fwd-back-end': {
        kind: 'Certificado de participación',
        issuer: 'FWD Costa Rica',
        summary: 'Segunda parte del mismo programa full stack. En el certificado figuran MySQL, Rails y React.',
        issuedLabel: 'Emitido',
        titleTranslation: null,
        documentAlt: `Certificado de participación de FWD Costa Rica a nombre de ${FULL_NAME} por completar la segunda parte del programa «Desarrolladores de Software Full-Stack Bilingües», con el título Back End Developer. Impartido del 24 de agosto al 15 de diciembre de 2023, con una duración de 560 horas. Chacarita, Puntarenas, 2 de febrero de 2024. Incluye los logotipos de MySQL, Rails y React y las firmas de tres directores.`,
        documentNote: null,
        verificationLabel: null,
      },
      'fwd-redes': {
        kind: 'Certificado de participación',
        issuer: 'FWD Costa Rica',
        summary: null,
        issuedLabel: 'Emitido',
        titleTranslation: null,
        documentAlt: `Certificado de participación de FWD Costa Rica a nombre de ${FULL_NAME} por completar el programa «TI Redes y Soporte Técnico». Impartido del 15 de enero de 2024 al 15 de marzo de 2025, con una duración de 560 horas. Chacarita, Puntarenas, 2 de abril de 2025. Incluye íconos de una computadora, una red y unos audífonos, y las firmas de tres directores.`,
        documentNote: null,
        verificationLabel: null,
      },
      'elements-of-ai': {
        kind: 'Curso en línea',
        issuer: 'MinnaLearn y Universidad de Helsinki',
        summary: 'Certificado de aprovechamiento del curso «Elementos de IA», de unas 50 horas de estudio.',
        issuedLabel: 'Fecha',
        titleTranslation: null,
        documentAlt: `Certificado de aprovechamiento de Elements of AI, de MinnaLearn y la Universidad de Helsinki, que certifica que ${FULL_NAME} completó con éxito el curso en línea «Elementos de IA», de unas 50 horas de estudio. Fechado el 8 de septiembre de 2026, con las firmas de Teemu Roos, profesor de la Universidad de Helsinki, y Ville Valtonen, director ejecutivo de MinnaLearn.`,
        documentNote: null,
        verificationLabel: 'Validar el certificado',
      },
      sfpc: {
        kind: 'Certificación profesional',
        issuer: 'CertiProf',
        summary: null,
        issuedLabel: 'Certificada',
        titleTranslation: null,
        documentAlt: `Certificado de CertiProf que acredita que ${FULL_NAME} cumplió los requisitos de la Scrum Foundation Professional Certification (SFPC™). Fecha de certificación: 30 de septiembre de 2024. Vence el 30 de septiembre de 2027. Incluye la firma del director ejecutivo y el sello de la certificación.`,
        documentNote: 'En esta copia se ocultó el número de certificado.',
        verificationLabel: null,
      },
      dspc: {
        kind: 'Certificación profesional',
        issuer: 'CertiProf',
        summary: 'Credencial digital publicada en Credly.',
        issuedLabel: 'Emitida',
        titleTranslation: null,
        documentAlt:
          'Insignia de la Design Sprint Professional Certification de CertiProf: un sello circular con el texto «Professional Certification», el logotipo de CertiProf, la franja «Design Sprint» y la sigla DSPC™.',
        documentNote: 'Insignia de la credencial digital; el certificado no se publica en esta página.',
        verificationLabel: 'Ver la credencial',
      },
    },
  },
}
