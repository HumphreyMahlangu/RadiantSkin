import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
vi.mock('./lib/config', () => ({ isDemo: true }))
import App from './App'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('scrollTo', vi.fn())
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Preview must never use the backend')))
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('labels preview products and keeps the preview bag separate from the real bag', async () => {
  const user = userEvent.setup()
  localStorage.setItem('radiantskin.bag.v1', JSON.stringify([{ productId: 50, quantity: 1 }]))
  window.history.replaceState({}, '', '/shop')
  render(<App />)
  expect(screen.getByRole('note').textContent).toContain('Sample products and prices')
  await user.click(await screen.findByRole('button', { name: 'Add The Daily Cream to bag' }))
  expect(JSON.parse(localStorage.getItem('radiantskin.preview-bag.v1') || '[]')).toEqual([
    { productId: 1, quantity: 1 },
  ])
  expect(JSON.parse(localStorage.getItem('radiantskin.bag.v1') || '[]')).toEqual([
    { productId: 50, quantity: 1 },
  ])
  expect(fetch).not.toHaveBeenCalled()
})

it('does not attempt a real order lookup from preview mode', async () => {
  const user = userEvent.setup()
  window.history.replaceState({}, '', '/orders')
  render(<App />)
  await user.type(screen.getByLabelText('Order number'), '12')
  await user.click(screen.getByRole('button', { name: 'Track order' }))
  expect(await screen.findByRole('alert')).toBeTruthy()
  expect(fetch).not.toHaveBeenCalled()
})
