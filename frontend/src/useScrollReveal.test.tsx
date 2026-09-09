import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { useScrollReveal } from './useScrollReveal'

function Example({ route = '/', extra = false }) {
  const ref = useScrollReveal(route)
  return (
    <div ref={ref}>
      <a href="/shop" data-reveal>
        Collection
      </a>
      {extra && <article data-reveal>New product</article>}
    </div>
  )
}

function motionEnvironment(reduced = false) {
  const preference = new EventTarget() as EventTarget & { matches: boolean }
  preference.matches = reduced
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => preference),
  )
  const observe = vi.fn()
  const disconnect = vi.fn()
  const unobserve = vi.fn()
  let intersect: IntersectionObserverCallback
  class Observer {
    constructor(callback: IntersectionObserverCallback) {
      intersect = callback
    }
    observe = observe
    disconnect = disconnect
    unobserve = unobserve
  }
  vi.stubGlobal('IntersectionObserver', Observer)
  return {
    observe,
    disconnect,
    unobserve,
    preference,
    enter: (target: Element) =>
      act(() =>
        intersect(
          [{ target, isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
      ),
  }
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('keeps content visible when observer support is unavailable', () => {
  vi.stubGlobal('IntersectionObserver', undefined)
  render(<Example />)
  expect(screen.getByRole('link').dataset.revealState).toBeUndefined()
})

it('reveals entering content once and includes asynchronously loaded products', async () => {
  const motion = motionEnvironment()
  const { rerender, unmount } = render(<Example />)
  const link = screen.getByRole('link')
  expect(link.dataset.revealState).toBe('waiting')
  motion.enter(link)
  expect(link.dataset.revealState).toBe('visible')
  expect(motion.unobserve).toHaveBeenCalledWith(link)
  rerender(<Example extra />)
  const product = screen.getByRole('article')
  await waitFor(() => expect(motion.observe).toHaveBeenCalledWith(product))
  motion.enter(product)
  expect(product.dataset.revealState).toBe('visible')
  unmount()
  expect(motion.disconnect).toHaveBeenCalled()
})

it('leaves all content visible for reduced motion and reacts to preference changes', () => {
  const motion = motionEnvironment(true)
  render(<Example />)
  const link = screen.getByRole('link')
  expect(link.dataset.revealState).toBeUndefined()
  expect(motion.observe).not.toHaveBeenCalled()
  act(() => {
    motion.preference.matches = false
    motion.preference.dispatchEvent(new Event('change'))
  })
  expect(link.dataset.revealState).toBe('waiting')
  act(() => {
    motion.preference.matches = true
    motion.preference.dispatchEvent(new Event('change'))
  })
  expect(link.dataset.revealState).toBeUndefined()
  expect(motion.disconnect).toHaveBeenCalled()
})

it('disconnects the previous route observer when navigation changes', () => {
  const motion = motionEnvironment()
  const { rerender } = render(<Example />)
  motion.enter(screen.getByRole('link'))
  rerender(<Example route="/shop" />)
  expect(motion.disconnect).toHaveBeenCalledTimes(1)
  expect(motion.observe).toHaveBeenCalledTimes(2)
})
