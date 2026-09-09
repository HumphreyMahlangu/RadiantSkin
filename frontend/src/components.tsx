import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiArrowUpRight,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiShoppingBag,
} from 'react-icons/fi'
import { useStore } from './StoreContext'
import { categories, money } from './lib/store'
import type { Product } from './lib/store'

export function ProductImage({ product }: { product: Product }) {
  const [failedUrl, setFailedUrl] = useState('')
  return (
    <div
      className={`product-image image-${product.category}${product.imageUrl.startsWith('/images/products/') ? ' image-packshot' : ''}`}
    >
      {product.imageUrl && failedUrl !== product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={() => setFailedUrl(product.imageUrl)}
        />
      ) : (
        <div className="image-placeholder">
          <span className="placeholder-mark" aria-hidden="true">
            RS.
          </span>
          <span>{categories.find((category) => category.id === product.category)?.label}</span>
          <small>Image coming soon</small>
        </div>
      )}
    </div>
  )
}
export function ProductCard({ product }: { product: Product }) {
  const { bag, setQuantity } = useStore()
  const quantity = bag.find((item) => item.productId === product.productId)?.quantity || 0
  const unavailable = product.stockQuantity <= quantity || quantity >= 99
  return (
    <article className="product-card" data-reveal>
      <Link className="product-image-link" to={`/products/${product.productId}`}>
        <ProductImage product={product} />
        <span className="product-discover" aria-hidden="true">
          Discover <FiArrowUpRight />
        </span>
        {product.stockQuantity === 0 && <span className="product-badge">Out of stock</span>}
      </Link>
      <div className="product-meta">
        <span>
          {product.brand || categories.find((category) => category.id === product.category)?.label}
        </span>
        <span>{product.volumeMl > 0 ? `${product.volumeMl} ml` : ''}</span>
      </div>
      <Link className="product-title" to={`/products/${product.productId}`}>
        {product.name}
      </Link>
      <div className="product-card-bottom">
        <span>{money(product.price)}</span>
        <button
          className="add-button"
          aria-label={`Add ${product.name} to bag`}
          disabled={unavailable}
          onClick={() => setQuantity(product, quantity + 1)}
        >
          {unavailable ? (quantity ? 'In your bag' : 'Unavailable') : 'Add to bag'}
          <FiPlus aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <FiShoppingBag aria-hidden="true" />
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  )
}
export function CatalogueStatus({ children }: { children: ReactNode }) {
  const { loading, error, reload } = useStore()
  if (loading)
    return (
      <div className="product-grid" role="status" aria-label="Loading products">
        {[1, 2, 3, 4].map((id) => (
          <div key={id} className="skeleton">
            <div />
            <span />
            <span />
          </div>
        ))}
        <span className="sr-only">Loading products…</span>
      </div>
    )
  if (error)
    return (
      <div className="error-state" role="alert">
        <FiRefreshCw aria-hidden="true" />
        <h2>A little pause</h2>
        <p>{error}</p>
        <button className="button secondary" onClick={reload}>
          Try again <FiRefreshCw />
        </button>
      </div>
    )
  return children
}
export function Quantity({
  quantity,
  max,
  name,
  onChange,
}: {
  quantity: number
  max: number
  name: string
  onChange: (quantity: number) => void
}) {
  return (
    <div className="quantity">
      <button
        aria-label={`Decrease quantity of ${name}`}
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <FiMinus />
      </button>
      <span aria-label={`Quantity ${quantity}`}>{quantity}</span>
      <button
        aria-label={`Increase quantity of ${name}`}
        disabled={quantity >= Math.min(max, 99)}
        onClick={() => onChange(quantity + 1)}
      >
        <FiPlus />
      </button>
    </div>
  )
}
export function ShopLink() {
  return (
    <Link className="button" to="/shop">
      Explore the collection <FiArrowRight />
    </Link>
  )
}
