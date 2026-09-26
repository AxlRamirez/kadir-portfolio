export const EMAIL = 'kadirramirez19@gmail.com'
const WHATSAPP_NUMBER = '50662375946'

export type ContactHref = {
  href: string
  /** Enlace alternativo para equipos con ratón o trackpad, donde `href` no lleva directamente al destino. */
  desktopHref?: string
}

export type ExternalContact = ContactHref & {
  label: string
  value: string
}

/** Chat de WhatsApp, con un mensaje inicial opcional que la persona puede editar antes de enviarlo. */
export function whatsappHref(message?: string): ContactHref {
  const text = message ? `text=${encodeURIComponent(message)}` : ''
  return {
    href: `https://wa.me/${WHATSAPP_NUMBER}${text && `?${text}`}`,
    // En escritorio wa.me muestra una página intermedia que solo abre la app instalada; WhatsApp Web abre el chat.
    desktopHref: `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}${text && `&${text}`}`,
  }
}

export function emailHref(subject?: string): string {
  return subject ? `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}` : `mailto:${EMAIL}`
}

export const externalContacts: ExternalContact[] = [
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/kaddev97',
    href: 'https://www.linkedin.com/in/kaddev97/',
  },
  {
    label: 'WhatsApp',
    value: '+506 6237 5946',
    ...whatsappHref(),
  },
]
