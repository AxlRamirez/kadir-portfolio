export const EMAIL = 'kadirramirez19@gmail.com'

export type ExternalContact = {
  label: string
  value: string
  href: string
  /** Enlace alternativo para equipos con ratón o trackpad, donde `href` no lleva directamente al destino. */
  desktopHref?: string
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
    href: 'https://wa.me/50662375946',
    // En escritorio wa.me muestra una página intermedia que solo abre la app instalada; WhatsApp Web abre el chat.
    desktopHref: 'https://web.whatsapp.com/send?phone=50662375946',
  },
]
