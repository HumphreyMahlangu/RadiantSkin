import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { FiArrowRight, FiArrowUpRight, FiMenu, FiSearch, FiShoppingBag, FiX } from 'react-icons/fi'
import { StoreProvider, useStore } from './StoreContext'
import { isDemo } from './lib/config'
import { useScrollReveal } from './useScrollReveal'
import {
  HomePage,
  ShopPage,
  ProductPage,
  BagPage,
  CheckoutPage,
  OrdersPage,
  NotFoundPage,
} from './pages'

function Shell() {
  const { count, notice } = useStore()
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const motionRoot = useScrollReveal(location.pathname)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('search')?.toString().trim() || ''
    navigate(`/shop${value ? `?q=${encodeURIComponent(value)}` : ''}`)
    setMenu(false)
  }
  return (
    <div className="storefront" ref={motionRoot}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {isDemo && (
        <div className="preview-banner" role="note">
          Frontend preview · Sample products and prices · No orders or payments
        </div>
      )}
      <div className="announcement">
        <span>Skin. Body. Hair.</span>
        <span>Everyday care, considered.</span>
        <span>South Africa / ZAR</span>
      </div>
      <div className="navigation-shell">
        <header className="header">
          <Link to="/" className="wordmark" aria-label="RadiantSkin home">
            RADIANT<span>SKIN</span>
            <span className="wordmark-period">.</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink to="/shop">Shop all</NavLink>
            <Link to="/shop?category=skin">Skin care</Link>
            <Link to="/shop?category=body">Body care</Link>
            <Link to="/shop?category=hair">Hair care</Link>
          </nav>
          <div className="header-actions">
            <Link className="track-link" to="/orders">
              Track order
            </Link>
            <Link className="icon-button" to="/shop#search" aria-label="Search products">
              <FiSearch />
            </Link>
            <Link className="bag-link" to="/bag" aria-label={`Shopping bag, ${count} items`}>
              <FiShoppingBag />
              <span>Bag</span>
              <span className="bag-count" key={count}>
                ({count})
              </span>
            </Link>
            <button
              className="icon-button menu-toggle"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </header>
        {menu && (
          <div id="mobile-menu" className="mobile-menu">
            <nav aria-label="Mobile navigation" onClick={() => setMenu(false)}>
              <Link to="/shop">Shop all</Link>
              <Link to="/shop?category=skin">Skin care</Link>
              <Link to="/shop?category=body">Body care</Link>
              <Link to="/shop?category=hair">Hair care</Link>
              <Link to="/orders">Track order</Link>
            </nav>
            <form onSubmit={search}>
              <label className="sr-only" htmlFor="mobile-search">
                Search products
              </label>
              <input
                id="mobile-search"
                name="search"
                placeholder="Find your next essential"
                type="search"
              />
              <button className="icon-button" aria-label="Search">
                <FiArrowRight />
              </button>
            </form>
          </div>
        )}
      </div>
      <main id="main" tabIndex={-1}>
        <div className="route-content" key={location.pathname}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <footer className="footer">
        <div className="footer-top" data-reveal>
          <div>
            <Link className="wordmark" to="/">
              RADIANT<span>SKIN</span>
              <span className="wordmark-period">.</span>
            </Link>
            <p>Your skin. Your standards.</p>
          </div>
          <div className="footer-links">
            <span className="eyebrow">Explore</span>
            <Link to="/shop">
              Shop the collection <FiArrowUpRight />
            </Link>
            <Link to="/bag">
              Your shopping bag <FiArrowUpRight />
            </Link>
            <Link to="/orders">
              Track your order <FiArrowUpRight />
            </Link>
          </div>
          <div className="footer-note">
            <span className="eyebrow">Considered care</span>
            <p>
              Skin, body, and hair care.
              <br />
              Selected by you, for you.
            </p>
          </div>
        </div>
        <div className="footer-statement" aria-hidden="true" data-reveal>
          Feel like <em>you.</em>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RadiantSkin</span>
          <span>South Africa · ZAR</span>
          <span>Every day. On your terms.</span>
        </div>
      </footer>
      <div className={`toast ${notice ? 'visible' : ''}`} role="status" aria-live="polite">
        {notice}
      </div>
    </div>
  )
}
export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </BrowserRouter>
  )
}
