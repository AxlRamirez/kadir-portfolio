const STAGGER_MS = 90
const MAX_STAGGER_STEPS = 5

/**
 * Oculta los elementos `[data-reveal]` que están por debajo de la pantalla y los muestra al acercarse.
 * Lo que ya se ve al cargar no se toca, para que el contenido prerenderizado no parpadee al hidratar.
 * Devuelve la función de limpieza.
 */
export function setupReveal(): () => void {
  if (!('IntersectionObserver' in window)) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const observer = new IntersectionObserver(
    (entries) => {
      // Los elementos que entran juntos aparecen escalonados; uno que entra solo no espera.
      const visible = entries.filter((entry) => entry.isIntersecting)
      visible.forEach((entry, index) => {
        const element = entry.target as HTMLElement
        element.style.setProperty('--reveal-delay', `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS}ms`)
        element.dataset.revealState = 'shown'
        observer.unobserve(element)
      })
    },
    { rootMargin: '0px 0px -8% 0px' },
  )

  const fold = window.innerHeight
  for (const element of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    if (element.dataset.revealState === 'shown') continue
    if (element.dataset.revealState !== 'pending' && element.getBoundingClientRect().top < fold) continue
    element.dataset.revealState = 'pending'
    observer.observe(element)
  }

  return () => observer.disconnect()
}
