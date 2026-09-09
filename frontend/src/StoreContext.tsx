import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { changeBag, createApi, readBag } from './lib/store'
import type { BagItem, Product } from './lib/store'
import { isDemo } from './lib/config'

const api = createApi(import.meta.env.VITE_API_BASE_URL || '/api')
const bagKey = isDemo ? 'radiantskin.preview-bag.v1' : 'radiantskin.bag.v1'
type Store = {
  products: Product[]
  loading: boolean
  error: string
  reload: () => void
  bag: BagItem[]
  setQuantity: (product: Product, quantity: number) => void
  remove: (productId: number) => void
  count: number
  notice: string
}
const Context = createContext<Store | null>(null)
export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  const [notice, setNotice] = useState('')
  const [bag, setBag] = useState<BagItem[]>(() => {
    try {
      return readBag(localStorage.getItem(bagKey))
    } catch {
      return []
    }
  })
  useEffect(() => {
    const controller = new AbortController()
    const request = isDemo
      ? import('./lib/demo').then((module) => module.demoProducts)
      : api.products(controller.signal)
    request
      .then((result) => {
        if (!controller.signal.aborted) setProducts(result)
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setError(error instanceof Error ? error.message : 'The catalogue could not be loaded.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [version])
  useEffect(() => {
    try {
      localStorage.setItem(bagKey, JSON.stringify(bag))
    } catch {
      /* The bag remains usable without browser storage. */
    }
  }, [bag])
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === bagKey) setBag(readBag(event.newValue))
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])
  const reload = useCallback(() => {
    setLoading(true)
    setError('')
    setVersion((value) => value + 1)
  }, [])
  function setQuantity(product: Product, quantity: number) {
    setBag((current) => changeBag(current, product.productId, quantity, product.stockQuantity))
    setNotice(`${product.name} · bag updated`)
  }
  return (
    <Context.Provider
      value={{
        products,
        loading,
        error,
        reload,
        bag,
        setQuantity,
        remove: (id) => setBag((current) => current.filter((item) => item.productId !== id)),
        count: bag.reduce((sum, item) => sum + item.quantity, 0),
        notice,
      }}
    >
      {children}
    </Context.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const context = useContext(Context)
  if (!context) throw new Error('StoreProvider is missing')
  return context
}
