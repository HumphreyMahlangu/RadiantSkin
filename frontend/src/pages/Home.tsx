import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <section className="section">
        <div className="container hero">
          <div>
            <span className="eyebrow">Facial, Body &amp; Hair</span>
            <h1>Skincare made simple, honest, and effective.</h1>
            <p>
              Dermatologist-tested formulas across facial, body, and hair — free
              from harsh chemicals, priced for everyday use.
            </p>
            <div className="hero-actions">
              <Link to="/shop/body-care" className="btn btn-primary">
                Shop Now
              </Link>
            </div>
          </div>
          <img src="/images/Hero Image.png" alt="RadiantSkin hero" />
        </div>
      </section>

      <section className="section section-lavender">
        <div className="container">
          <span className="eyebrow">Shop by Category</span>
          <h2 className="section-title">Find your routine</h2>
          <p className="section-sub">Three ranges, one standard of quality.</p>
          <div className="category-grid">
            <Link to="/shop/skin-care" className="category-card">
              <img src="/images/Facial Care1.png" alt="Facial Care" />
              <div className="category-overlay">
                <h3>Facial Care</h3>
              </div>
            </Link>
            <Link to="/shop/body-care" className="category-card">
              <img src="/images/Body Care1.png" alt="Body Care" />
              <div className="category-overlay">
                <h3>Body Care</h3>
              </div>
            </Link>
            <Link to="/shop/hair-care" className="category-card">
              <img src="/images/Hair Care1.png" alt="Hair Care" />
              <div className="category-overlay">
                <h3>Hair Care</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="section-title">What makes RadiantSkin different</h2>
          <div className="why-strip">
            <div className="why-card card">
              <div className="why-icon">🌿</div>
              <h4>Clean Ingredients</h4>
              <p>No parabens, sulfates, or fillers.</p>
            </div>
            <div className="why-card card">
              <div className="why-icon">🔬</div>
              <h4>Dermatologist Tested</h4>
              <p>Clinically tested for safety.</p>
            </div>
            <div className="why-card card">
              <div className="why-icon">🌍</div>
              <h4>Sustainably Made</h4>
              <p>Recyclable, responsibly sourced.</p>
            </div>
            <div className="why-card card">
              <div className="why-icon">🚚</div>
              <h4>Fast Delivery</h4>
              <p>Nationwide shipping across SA.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-lavender">
        <div className="container">
          <span className="eyebrow">Featured Products</span>
          <h2 className="section-title">Customer favourites</h2>
          <p className="section-sub">Our best-selling products this month.</p>
          <div className="featured-grid">
            <div className="product-card card">
              <img
                src="/images/Body Care2.png"
                alt="Whipped Shea Body Butter"
              />
              <div className="product-info">
                <h4>Whipped Shea Body Butter</h4>
                <div className="product-price">R289</div>
                <div className="product-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/login")}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            <div className="product-card card">
              <img src="/images/Hair Care2.png" alt="Keratin Repair Shampoo" />
              <div className="product-info">
                <h4>Keratin Repair Shampoo</h4>
                <div className="product-price">R219</div>
                <div className="product-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/login")}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            <div className="product-card card">
              <img src="/images/Facial Care2.png" alt="Vitamin C Face Serum" />
              <div className="product-info">
                <h4>Vitamin C Face Serum</h4>
                <div className="product-price">R349</div>
                <div className="product-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/login")}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            <div className="product-card card">
              <img src="/images/Hair Care3.png" alt="Argan Shine Hair Oil" />
              <div className="product-info">
                <h4>Argan Shine Hair Oil</h4>
                <div className="product-price">R289</div>
                <div className="product-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/login")}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container about-preview">
          <img src="/images/About Section Image.png" alt="About RadiantSkin" />
          <div>
            <span className="eyebrow">About RadiantSkin</span>
            <h2 className="section-title">Honest skincare, made simple</h2>
            <p>
              We started RadiantSkin to make effective, transparent skincare
              accessible — no guesswork, no filler ingredients, just results you
              can feel.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
