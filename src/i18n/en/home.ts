import { FULL_NAME } from '../names.ts'
import type { HomeText } from '../types.ts'

/* Los textos de los sitios y los certificados están en español: se citan entre comillas “…”, seguidos de
   una traducción entre paréntesis. Los títulos oficiales se conservan tal como figuran en el documento. */
export const home: HomeText = {
  projects: {
    index: 'Published work',
    title: 'Projects',
    intro: 'A selection of published sites and applications. Each one links to its live version.',
    visit: 'Visit site',
    noteLabel: 'Note:',
    previewPending: 'Preview coming soon',
    items: {
      insightcenter: {
        name: 'InsightCenter',
        kind: 'Data integration and analytics platform',
        description:
          'Public site for the platform I’m building to bring together data from ERP systems, APIs, databases and files, keep it traceable and get it ready for analytics.',
        context: 'Platform: React, NestJS, PostgreSQL and Python ETL',
        note: null,
        previewAlt:
          'Home page of the InsightCenter site with the headline “Conecta la información de tu empresa y entiende mejor tu operación” (Connect your company’s information and understand your operations better) next to a view of the app.',
      },
      'landing-ismael': {
        name: 'Landing page for Ismael',
        kind: 'Landing page',
        description:
          'Introduction page for Ismael Vasquez Quiros, who shares tools and strategies for exploring online income. It explains where he started, what he offers and how to get started, and sends visitors to WhatsApp to get in touch.',
        context: 'Published on Vercel',
        note: null,
        previewAlt:
          'Home page of Ismael Vasquez Quiros’s landing page with the headline “Construye una vida con más libertad, empezando desde donde estás” (Build a life with more freedom, starting from where you are) and his photo.',
      },
      'control-diesel': {
        name: 'Diesel tracker',
        kind: 'Web application',
        description:
          'A form for logging fuel dispensing with license plate, customer, odometer reading, liters and photo evidence, and for showing the resulting fuel consumption. It has a separate entry point to the admin panel.',
        context: 'Published on Firebase Hosting',
        note: null,
        previewAlt:
          'The “Registro de dispensación” (dispensing log) form of the “Control de Diesel” app, with fields for license plate, customer, date, odometer, liters and photo evidence.',
      },
      'inventario-bodega': {
        name: 'Warehouse inventory',
        kind: 'Web application',
        description:
          'An inventory system with four-digit PIN access and a read-only guest mode for looking up products. The preview shows only the sign-in screen.',
        context: 'Published on Firebase Hosting',
        note: null,
        previewAlt:
          'The inventory sign-in screen with the “La Costa Distribución” logo, a PIN field and a button to continue as a guest.',
      },
    },
  },
  career: {
    index: 'From training to today',
    title: 'Career',
    intro:
      'I trained at FWD Costa Rica and worked for two years as a Software Developer at Moovin Logistics. I also have experience in administrative processes and IT support. Training dates match the certificates.',
    linkLabels: { education: 'See the certificate', projects: 'See the project' },
    items: {
      fwd: {
        when: 'May – Dec 2023',
        stage: 'Training',
        title: 'Full-stack development program',
        place: 'FWD Costa Rica',
        description:
          'The 1,080-hour “Desarrolladores de Software Full-Stack Bilingües” (Bilingual Full-Stack Software Developers) program, covering MySQL, Rails, React and JavaScript.',
      },
      moovin: {
        when: 'Jul 2023 – Jul 2025',
        stage: 'Work experience',
        title: 'Software Developer',
        place: 'Moovin Logistics · full-time, remote',
        description:
          'Front-end development for the company’s logistics system using React, JavaScript, HTML and CSS.',
      },
      insightcenter: {
        when: 'Today',
        stage: 'In progress',
        title: 'InsightCenter',
        place: 'Data integration and analytics platform',
        description:
          'I’m building a platform that brings together data from ERP systems, APIs, databases and files, with React, NestJS, PostgreSQL and Python ETL processes.',
      },
    },
  },
  skills: {
    index: 'Tech stack',
    title: 'Skills',
    intro: 'Technologies I work with, grouped by what they do.',
    groups: {
      frontend: {
        title: 'Languages and front end',
        description: 'Web interfaces, from layout to client-side logic.',
      },
      backend: { title: 'Back end and integration', description: 'APIs, services and connecting systems.' },
      data: { title: 'Data and automation', description: 'Queries, relational databases and ETL processes.' },
      tools: { title: 'Tools and workflow', description: 'Version control and reproducible environments.' },
    },
    ai: {
      title: 'Artificial intelligence',
      text: {
        before: 'I know its fundamentals and applications: I completed ',
        strong: 'Elements of AI',
        after:
          ', from the University of Helsinki and MinnaLearn. I’m interested in bringing it into software products and data analysis.',
      },
      link: 'See the certificate',
    },
  },
  credentials: {
    index: 'Documents',
    title: 'Certifications',
    titleTail: 'and education',
    intro: 'Technical training and certifications. You can enlarge each document to read it in full.',
    enlarge: 'Enlarge',
    enlargeContext: ' the document: ',
    missingDocument: 'No copy of the document',
    facts: {
      period: 'Period',
      duration: 'Duration',
      hours: (hours) => `${hours.toLocaleString('en-US')} hours`,
      expires: 'Expires',
    },
    verification: (label, source) => `${label} on ${source}`,
    viewer: { close: 'Close', openOriginal: 'Open the image at full size' },
    groups: {
      technical: {
        title: 'Technical training',
        description: 'FWD Costa Rica programs, with the hours and dates shown on each certificate.',
      },
      certifications: {
        title: 'Certifications',
        description: 'Professional certifications and an online course, with a verification link where there is one.',
      },
    },
    items: {
      'fwd-full-stack': {
        kind: 'Certificate of participation',
        issuer: 'FWD Costa Rica',
        summary:
          'The “Desarrolladores de Software Full-Stack Bilingües” (Bilingual Full-Stack Software Developers) program. The certificate lists MySQL, Rails, React and JavaScript.',
        issuedLabel: 'Issued',
        titleTranslation: null,
        documentAlt: `Certificate of participation from FWD Costa Rica issued to ${FULL_NAME} for completing the “Desarrolladores de Software Full-Stack Bilingües” (Bilingual Full-Stack Software Developers) program, with the title Full Stack Developer. Taught from May 22 to December 15, 2023, for a total of 1,080 hours. Chacarita, Puntarenas, February 2, 2024. It shows the MySQL, Rails, React and JavaScript logos and the signatures of three directors.`,
        documentNote: 'Photo of the printed certificate.',
        verificationLabel: null,
      },
      'fwd-back-end': {
        kind: 'Certificate of participation',
        issuer: 'FWD Costa Rica',
        summary: 'The second part of the same full-stack program. The certificate lists MySQL, Rails and React.',
        issuedLabel: 'Issued',
        titleTranslation: null,
        documentAlt: `Certificate of participation from FWD Costa Rica issued to ${FULL_NAME} for completing the second part of the “Desarrolladores de Software Full-Stack Bilingües” (Bilingual Full-Stack Software Developers) program, with the title Back End Developer. Taught from August 24 to December 15, 2023, for a total of 560 hours. Chacarita, Puntarenas, February 2, 2024. It shows the MySQL, Rails and React logos and the signatures of three directors.`,
        documentNote: null,
        verificationLabel: null,
      },
      'fwd-redes': {
        kind: 'Certificate of participation',
        issuer: 'FWD Costa Rica',
        summary: null,
        issuedLabel: 'Issued',
        titleTranslation: 'IT Networks and Technical Support',
        documentAlt: `Certificate of participation from FWD Costa Rica issued to ${FULL_NAME} for completing the “TI Redes y Soporte Técnico” (IT Networks and Technical Support) program. Taught from January 15, 2024 to March 15, 2025, for a total of 560 hours. Chacarita, Puntarenas, April 2, 2025. It shows icons of a computer, a network and a headset, and the signatures of three directors.`,
        documentNote: null,
        verificationLabel: null,
      },
      'elements-of-ai': {
        kind: 'Online course',
        issuer: 'MinnaLearn and the University of Helsinki',
        summary:
          'Certificate of completion for the course, taken in its Spanish edition, “Elementos de IA”, with about 50 hours of study.',
        issuedLabel: 'Date',
        titleTranslation: null,
        documentAlt: `Certificate of completion for Elements of AI, from MinnaLearn and the University of Helsinki, certifying that ${FULL_NAME} successfully completed the online course “Elementos de IA” (Elements of AI), with about 50 hours of study. Dated September 8, 2026, and signed by Teemu Roos, professor at the University of Helsinki, and Ville Valtonen, CEO of MinnaLearn.`,
        documentNote: null,
        verificationLabel: 'Validate the certificate',
      },
      sfpc: {
        kind: 'Professional certification',
        issuer: 'CertiProf',
        summary: null,
        issuedLabel: 'Certified',
        titleTranslation: null,
        documentAlt: `CertiProf certificate stating that ${FULL_NAME} met the requirements of the Scrum Foundation Professional Certification (SFPC™). Certification date: September 30, 2024. Expires on September 30, 2027. It shows the CEO’s signature and the certification seal.`,
        documentNote: 'The certificate number is hidden in this copy.',
        verificationLabel: null,
      },
      dspc: {
        kind: 'Professional certification',
        issuer: 'CertiProf',
        summary: 'Digital credential published on Credly.',
        issuedLabel: 'Issued',
        titleTranslation: null,
        documentAlt:
          'Badge for the CertiProf Design Sprint Professional Certification: a circular seal with the text “Professional Certification”, the CertiProf logo, a “Design Sprint” band and the acronym DSPC™.',
        documentNote: 'Badge of the digital credential; the certificate itself isn’t published on this page.',
        verificationLabel: 'View the credential',
      },
    },
  },
}
