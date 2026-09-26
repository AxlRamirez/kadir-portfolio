import type { ServicesText } from '../types.ts'
import { prompts } from './prompts.ts'

export const services: ServicesText = {
  services: {
    index: 'How I can help',
    title: 'Services',
    intro: 'Two ways to work together. Either way, before we start we put in writing what the work includes.',
    whatsapp: 'Message me on WhatsApp',
    email: 'Send an email',
    topicContext: (topic) => ` about ${topic}`,
    detailsOpen: 'See what’s included',
    detailsClose: 'Hide details',
    items: {
      websites: {
        title: 'Websites and landing pages',
        summary:
          'To present a business, a service or a personal project on one clear page that looks good on a phone and gets people to reach out.',
        price: {
          label: 'Estimated range',
          value: 'US$350–500',
          note: 'The final price depends on the requirements we agree on.',
        },
        lists: [
          {
            title: 'Can include',
            tone: 'includes',
            items: [
              'Responsive design, planned for phones first.',
              'Building the site and publishing it.',
              'Between 5 and 8 sections, depending on the scope we agree on.',
              'Contact links or buttons for WhatsApp and email.',
              'Basic technical SEO: titles, descriptions, well-ordered headings and a lightweight page.',
            ],
          },
          {
            title: 'Set out in the proposal',
            tone: 'terms',
            items: [
              'The domain for the first year, if it’s available and at the cost we agree on.',
              'Whose name the domain is registered in, how it’s renewed, where the site is hosted and which third-party services are involved.',
            ],
          },
          {
            title: 'Not included unless we agree on it separately',
            tone: 'excludes',
            items: [
              'A separate page for each section: the sections are part of a single site.',
              'Forms that store or process data on a server.',
              'Online payments.',
              'Copywriting: you provide the content, and I tell you what each section needs.',
              'Unlimited maintenance or guaranteed search rankings.',
            ],
          },
        ],
        steps: null,
        contactTopic: 'a website or landing page',
        whatsappMessage: 'Hi Kadir, I’m interested in a website or landing page. Here’s what it’s about:',
        emailSubject: 'Website or landing page',
      },
      'custom-systems': {
        title: 'Custom web systems',
        summary:
          'For personal or business projects that need a tool of their own: an operations log, an inventory or an admin panel. We talk through the requirements first, and then I prepare a quote.',
        price: {
          label: 'Price',
          value: 'Quoted per project',
          note: 'I don’t give a price before I understand the project: every system depends on what it has to do.',
        },
        lists: [],
        steps: {
          title: 'Before the quote',
          items: [
            {
              title: 'Requirements and users',
              description: 'What problem the system solves, who will use it and what each person needs to do.',
            },
            {
              title: 'Features, integrations and data',
              description: 'Which features are needed, which other systems it connects to and what information it stores or looks up.',
            },
            {
              title: 'Security',
              description: 'Who can see or change what, and how the information is protected.',
            },
            {
              title: 'Stages',
              description: 'We split the work into deliveries you can try out before moving on to the next one.',
            },
            {
              title: 'Quote',
              description: 'With all of that defined, I prepare a quote broken down by stage.',
            },
          ],
        },
        contactTopic: 'a custom web system',
        whatsappMessage: 'Hi Kadir, I’d like to talk about a custom web system. Here’s the idea:',
        emailSubject: 'Custom web system',
      },
    },
  },
  prompts: {
    index: 'Free to copy',
    title: 'Free prompts',
    intro:
      'Four prompts for asking an AI assistant to review your project with evidence. Fill in the brackets before you send them, and check the answers you get: AI makes mistakes too.',
    coversLabel: 'What it reviews',
    copy: 'Copy prompt',
    copied: 'Copied',
    copiedStatus: 'Copied to the clipboard. Fill in the brackets before you send it.',
    manualStatus:
      'Couldn’t copy automatically. The text is selected below: copy it with Ctrl+C (Cmd+C on a Mac) or, on a phone, with the Copy option in the menu.',
    showText: 'Show the full prompt',
    items: prompts,
  },
}
