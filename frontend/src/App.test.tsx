import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const products = [
  {
    productId: 1,
    name: 'Daily Cream',
    brand: 'RadiantSkin',
    price: 245,
    stockQuantity: 2,
    usageInstructions: 'Apply as needed',
    description: 'Everyday care',
    reviews: [],
  },
  {
    productId: 2,
    name: 'Body Lotion',
    brand: 'RadiantSkin',
    price: 189,
    stockQuantity: 0,
    skinConcern: 'Daily care',
    reviews: [],
  },
  {
    productId: 3,
    name: 'Ritual Shampoo',
    brand: 'RadiantSkin',
    price: 210,
    stockQuantity: 5,
    hairConcern: 'Daily care',
    reviews: [],
  },
]
const fetcher = vi.fn<typeof fetch>()
function open(path = '/shop') {
  window.history.replaceState({}, '', path)
  return render(<App />)
}
beforeEach(() => {
  localStorage.clear()
  fetcher
    .mockReset()
    .mockImplementation(async () => new Response(JSON.stringify(products), { status: 200 }))
  vi.stubGlobal('fetch', fetcher)
  vi.stubGlobal('scrollTo', vi.fn())
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Customer storefront', () => {
  it('filters the catalogue by category, search, and availability', async () => {
    const user = userEvent.setup()
    open()
    await screen.findByRole('link', { name: 'Daily Cream' })
    await user.click(screen.getByRole('button', { name: 'Hair care' }))
    expect(screen.queryByRole('link', { name: 'Daily Cream' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Ritual Shampoo' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Shop all' }))
    await user.click(screen.getByLabelText('In stock only'))
    expect(screen.queryByRole('link', { name: 'Body Lotion' })).toBeNull()
    await user.type(screen.getByRole('searchbox', { name: 'Search products' }), 'cream')
    expect(screen.queryByRole('link', { name: 'Ritual Shampoo' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Daily Cream' })).toBeTruthy()
  })
  it('adds to the bag, enforces stock limits, persists, and removes an item', async () => {
    const user = userEvent.setup()
    open()
    const add = await screen.findByRole('button', { name: 'Add Daily Cream to bag' })
    await user.click(add)
    await user.click(add)
    expect((add as HTMLButtonElement).disabled).toBe(true)
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem('radiantskin.bag.v1') || '[]')).toEqual([
        { productId: 1, quantity: 2 },
      ]),
    )
    await user.click(screen.getByRole('link', { name: 'Shopping bag, 2 items' }))
    expect(screen.getByRole('heading', { name: 'Daily Cream' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Remove Daily Cream from bag' }))
    expect(
      screen.getByRole('heading', { name: 'Your bag is waiting for a little care' }),
    ).toBeTruthy()
  })
  it('shows a recoverable error then reloads the real catalogue', async () => {
    fetcher.mockRejectedValueOnce(new TypeError('Network failure'))
    const user = userEvent.setup()
    open()
    expect(await screen.findByRole('alert')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('link', { name: 'Daily Cream' })).toBeTruthy()
  })
  it('keeps unavailable saved items visible and blocks checkout until removed', async () => {
    localStorage.setItem('radiantskin.bag.v1', JSON.stringify([{ productId: 999, quantity: 1 }]))
    open('/bag')
    expect(await screen.findByRole('heading', { name: 'Product no longer available' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Review checkout' })).toBeNull()
  })
  it('renders product details and a real empty catalogue without invented products', async () => {
    open('/products/1')
    expect(await screen.findByRole('heading', { level: 1, name: 'Daily Cream' })).toBeTruthy()
    expect(screen.getByText('Apply as needed')).toBeTruthy()
    cleanup()
    fetcher.mockResolvedValueOnce(new Response('[]'))
    open('/shop')
    expect(
      await screen.findByRole('heading', { name: 'Our shelves are being prepared' }),
    ).toBeTruthy()
  })
  it('prepares a checkout without sending contact details or placing an order', async () => {
    localStorage.setItem('radiantskin.bag.v1', JSON.stringify([{ productId: 1, quantity: 1 }]))
    const user = userEvent.setup()
    open('/checkout')
    await screen.findByLabelText('First name')
    const values = {
      'First name': 'Test',
      'Last name': 'Customer',
      'Email address': 'test@example.com',
      'Phone number': '0712345678',
      'Street address': '1 Test Street',
      City: 'Pretoria',
      'Postal code': '0001',
    }
    for (const [label, value] of Object.entries(values))
      await user.type(screen.getByLabelText(label), value)
    await user.selectOptions(screen.getByLabelText('Province'), 'Gauteng')
    await user.click(screen.getByRole('button', { name: 'Review details' }))
    expect(await screen.findByRole('heading', { name: 'Your checkout details' })).toBeTruthy()
    expect(
      (screen.getByRole('button', { name: 'Ordering currently unavailable' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
    expect(fetcher.mock.calls.every(([url]) => String(url).endsWith('/product/getAll'))).toBe(true)
    expect(JSON.stringify(localStorage)).not.toContain('test@example.com')
  })
  it('looks up an existing order and displays server status without claiming payment', async () => {
    fetcher.mockImplementation(
      async (url) =>
        new Response(
          JSON.stringify(
            String(url).includes('/order/read/')
              ? {
                  orderId: 42,
                  orderDate: '2026-09-09T12:00:00',
                  status: 'SHIPPED',
                  totalAmount: 245,
                  orderItems: [
                    {
                      orderItemId: 1,
                      quantity: 1,
                      unitPrice: 245,
                      product: { name: 'Daily Cream' },
                    },
                  ],
                }
              : products,
          ),
        ),
    )
    const user = userEvent.setup()
    open('/orders')
    await user.type(screen.getByLabelText('Order number'), '42')
    await user.click(screen.getByRole('button', { name: 'Track order' }))
    expect(await screen.findByRole('heading', { name: 'shipped' })).toBeTruthy()
    expect(screen.getByText(/does not confirm payment/)).toBeTruthy()
  })
  it('provides mobile menu navigation and a useful unknown-route page', async () => {
    const user = userEvent.setup()
    open('/missing')
    expect(screen.getByRole('heading', { name: 'A little off the beaten path' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(
      within(screen.getByRole('navigation', { name: 'Mobile navigation' })).getByRole('link', {
        name: 'Hair care',
      }),
    )
    expect(await screen.findByRole('link', { name: 'Ritual Shampoo' })).toBeTruthy()
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull()
  })
})
