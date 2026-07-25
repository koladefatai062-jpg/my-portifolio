import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const CATEGORIES = ['All', 'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories', 'Shoes'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCat = searchParams.get('category') || 'All';

  useEffect(() => {
    setLoading(true);
    getProducts(activeCat === 'All' ? {} : { category: activeCat })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCat]);

  const filterBy = (cat) => {
    const params = cat === 'All' ? {} : { category: cat };
    setSearchParams(params);
  };

  return (
    <div className="shop-page container">
      <h1 className="section-title">Shop</h1>

      <div className="shop-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCat === cat ? 'active' : ''}`}
            onClick={() => filterBy(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty-msg">Loading...</p>
      ) : (
        <div className="shop-grid">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
          {products.length === 0 && (
            <p className="empty-msg">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
