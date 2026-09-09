import { Link } from 'react-router-dom'
import { FiArrowDown, FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { CatalogueStatus, EmptyState, ProductCard } from './components'
import { useStore } from './StoreContext'

export function HomePage() {
  const { products } = useStore()

  return (
    <div className="home-editorial">
      <section className="campaign" aria-labelledby="campaign-title">
        <div className="campaign-portraits" aria-hidden="true">
          <img
            className="portrait-woman"
            src="/images/campaign-woman.jpg"
            alt=""
            width="1400"
            height="2097"
            fetchPriority="high"
          />
          <img
            className="portrait-man"
            src="/images/campaign-man.jpg"
            alt=""
            width="1200"
            height="1800"
          />
        </div>
        <div className="campaign-topline">
          <span>Care, in your own way.</span>
          <span>The RadiantSkin edit / 01</span>
        </div>
        <div className="campaign-content">
          <h1 id="campaign-title">
            <span>A daily ritual.</span>
            <em>Entirely yours.</em>
          </h1>
          <div className="campaign-invitation">
            <p>
              For your skin. For your hair.
              <br />
              For the moments you make your own.
            </p>
            <Link to="/shop" className="campaign-shop">
              Discover the collection <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <a className="campaign-scroll" href="#collections" aria-label="Explore the collections">
          <FiArrowDown aria-hidden="true" />
        </a>
      </section>

      <nav className="collection-index" aria-label="Explore care collections">
        <Link to="/shop?category=skin">
          <span>01</span> Skin care <FiArrowUpRight aria-hidden="true" />
        </Link>
        <Link to="/shop?category=body">
          <span>02</span> Body care <FiArrowUpRight aria-hidden="true" />
        </Link>
        <Link to="/shop?category=hair">
          <span>03</span> Hair care <FiArrowUpRight aria-hidden="true" />
        </Link>
      </nav>

      <section
        className="collection-stories section"
        id="collections"
        aria-labelledby="collections-title"
      >
        <div className="stories-heading" data-reveal>
          <span className="eyebrow">The art of everyday care</span>
          <h2 id="collections-title">
            A little time.
            <br />
            <em>All for you.</em>
          </h2>
          <p>
            Different needs. Different rituals.
            <br />
            Find what feels like you.
          </p>
        </div>
        <div className="stories-mosaic">
          <Link className="story story-skin" to="/shop?category=skin" data-reveal>
            <div className="story-image">
              <img
                src="/images/campaign-woman.jpg"
                alt=""
                loading="lazy"
                width="1400"
                height="2097"
              />
            </div>
            <div className="story-label">
              <span className="eyebrow">01 / Face the day</span>
              <h3>Skin comes first.</h3>
              <span className="story-action">
                Explore skin care <FiArrowUpRight aria-hidden="true" />
              </span>
            </div>
          </Link>
          <Link className="story story-hair" to="/shop?category=hair" data-reveal>
            <div className="story-image">
              <img
                src="/images/campaign-man.jpg"
                alt=""
                loading="lazy"
                width="1200"
                height="1800"
              />
            </div>
            <div className="story-label">
              <span className="eyebrow">03 / Rooted in you</span>
              <h3>Your natural rhythm.</h3>
              <span className="story-action">
                Explore hair care <FiArrowUpRight aria-hidden="true" />
              </span>
            </div>
          </Link>
          <Link className="story story-body" to="/shop?category=body" data-reveal>
            <div className="story-image">
              <img
                src="/images/cream-texture.jpg"
                alt=""
                loading="lazy"
                width="1400"
                height="1490"
              />
            </div>
            <div className="story-label">
              <span className="eyebrow">02 / A softer moment</span>
              <h3>Head to toe.</h3>
              <span className="story-action">
                Explore body care <FiArrowUpRight aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="shelf-section section" id="collection" aria-labelledby="shelf-title">
        <div className="shelf-intro" data-reveal>
          <span className="eyebrow">On your shelf</span>
          <h2 id="shelf-title">
            Small rituals.
            <br />
            <em>Daily essentials.</em>
          </h2>
          <p>The first cleanse. The final touch. Make room for your everyday care.</p>
          <Link className="text-link" to="/shop">
            Explore all products <FiArrowRight aria-hidden="true" />
          </Link>
          <span className="shelf-monogram" aria-hidden="true">
            rs.
          </span>
        </div>
        <div className="shelf-products">
          <CatalogueStatus>
            {products.length ? (
              <div className="product-grid">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState title="The collection is coming soon">
                Our shelves are being prepared. Check back soon.
              </EmptyState>
            )}
          </CatalogueStatus>
        </div>
      </section>

      <section className="ritual-note" aria-labelledby="ritual-title">
        <div className="ritual-texture" data-reveal="image">
          <img
            src="/images/cream-texture.jpg"
            alt="The soft texture of a cream"
            loading="lazy"
            width="1400"
            height="1490"
          />
        </div>
        <div className="ritual-copy" data-reveal>
          <span className="eyebrow">A moment, just for you</span>
          <h2 id="ritual-title">
            Take your time.
            <br />
            <em>Make it a ritual.</em>
          </h2>
          <Link to="/shop" className="ritual-link">
            <span>
              Find your
              <br />
              essentials
            </span>
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
