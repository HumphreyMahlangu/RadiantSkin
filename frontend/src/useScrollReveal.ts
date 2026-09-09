import { useEffect, useRef } from 'react'

/** Reveal each editorial element once; content stays visible if motion APIs are absent. */
export function useScrollReveal(route: string) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = root.current
    if (!container || !window.matchMedia || !window.IntersectionObserver) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const observed = new Set<HTMLElement>()
    let observer: IntersectionObserver | undefined
    let changes: MutationObserver | undefined

    const clear = () => {
      observer?.disconnect()
      changes?.disconnect()
      observed.forEach((element) => {
        delete element.dataset.revealState
      })
      observed.clear()
    }

    const start = () => {
      clear()
      if (preference.matches) return

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ isIntersecting, target }) => {
            if (!isIntersecting) return
            const element = target as HTMLElement
            element.dataset.revealState = 'visible'
            observer?.unobserve(target)
          })
        },
        { threshold: 0.08 },
      )

      const register = () => {
        // Release removed cards when filters change, and register asynchronous catalogue results.
        observed.forEach((element) => {
          if (!container.contains(element)) {
            observer?.unobserve(element)
            observed.delete(element)
          }
        })
        container.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
          if (observed.has(element)) return
          observed.add(element)
          element.dataset.revealState = 'waiting'
          observer?.observe(element)
        })
      }

      register()
      changes = new MutationObserver(register)
      changes.observe(container, { childList: true, subtree: true })
    }

    start()
    preference.addEventListener('change', start)
    return () => {
      clear()
      preference.removeEventListener('change', start)
    }
  }, [route])

  return root
}
