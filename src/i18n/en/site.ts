import type { SiteText } from '../types.ts'

export const site: SiteText = {
  locale: 'en',
  formatLocale: 'en-US',
  skipLink: 'Skip to content',
  newTab: '(opens in a new tab)',
  header: {
    homeLabel: 'Kadir Ramírez, go to the home page',
    updatedPrefix: 'Portfolio updated on',
    navLabel: 'Main',
    nav: {
      projects: 'Projects',
      career: 'Career',
      skills: 'Skills',
      education: 'Education',
      services: 'Services',
      contact: 'Contact',
    },
  },
  languageSwitch: { label: 'Language' },
  pageSwitch: {
    label: 'Portfolio pages',
    pages: { home: 'About me', services: 'Services' },
  },
  hero: {
    eyebrow: 'Full-stack developer',
    pages: {
      home: {
        lead: { before: 'I design and build web applications ', key: 'from start to finish', after: '.' },
        sub: 'I like turning different ideas and needs into products people can actually use.',
        primary: 'See projects',
        secondary: 'Career',
      },
      services: {
        lead: { before: 'I build websites and systems ', key: 'tailored to your project', after: '.' },
        sub: 'Before we start, we agree on what the work includes, what it leaves out and what it costs.',
        primary: 'See services',
        secondary: 'Free prompts',
      },
    },
    facts: {
      now: {
        label: 'Now',
        text: { before: 'Building ', strong: 'InsightCenter', after: ', a data integration and analytics platform.' },
      },
      before: {
        label: 'Before',
        text: { before: 'Software Developer at ', strong: 'Moovin Logistics', after: ', from 2023 to 2025.' },
      },
    },
    deckCaption: 'published projects',
    contactTitle: 'Contact',
    emailLabel: 'Email',
    copyEmail: {
      idle: 'Copy',
      copied: 'Copied',
      failed: 'Failed',
      copiedStatus: 'Email address copied to the clipboard',
      failedStatus: 'Couldn’t copy the email address',
    },
  },
  footer: {
    credit: 'Portfolio built with React, TypeScript and Vite by Kaddev',
    backToTop: 'Back to top',
  },
}
