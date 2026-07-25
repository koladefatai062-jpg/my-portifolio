import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts({ featured: 'true' }).then(setFeatured).catch(() => {});
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">NEW SEASON<br />NOW LIVE</h1>
          <p className="hero-sub">Bold cuts. Heavy fabrics. No limits.</p>
          <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
        </div>
      </section>

      <section className="container">
        <h2 className="section-title">Featured</h2>
        <div className="featured-grid">
          {featured.map(p => <ProductCard key={p._id} product={p} />)}
          {featured.length === 0 && (
            <p className="empty-msg">No featured items yet. Check back soon.</p>
          )}
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Categories</h2>
          <div className="categories-grid">
            {['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories', 'Shoes'].map(cat => (
              <Link key={cat} to={`/shop?category=${cat}`} className="category-card">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
