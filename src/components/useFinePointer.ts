import { useSyncExternalStore } from 'react'
import type { ContactHref } from '../data/contact.ts'

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

function subscribeToPointer(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** El HTML prerenderizado usa el enlace móvil; en el navegador se cambia si el puntero principal es un ratón. */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribeToPointer,
    () => window.matchMedia(FINE_POINTER_QUERY).matches,
    () => false,
  )
}

export function useContactHref(contact: ContactHref): string {
  const finePointer = useFinePointer()
  return (finePointer && contact.desktopHref) || contact.href
}
