import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(p => { setProduct(p); setSelectedSize(p.sizes?.[0] || ''); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="container" style={{ paddingTop: 48 }}><p>Loading...</p></div>;
  if (!product) return <div className="container" style={{ paddingTop: 48 }}><p>Product not found.</p></div>;

  return (
    <div className="product-detail container">
      <Link to="/shop" className="back-link">&larr; Back to shop</Link>
      <div className="product-detail-grid">
        <div className="product-detail-img">
          <img src={product.images?.[0] || 'https://placehold.co/600x800/111/fff?text=ROGUE'} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <p className="product-detail-category">{product.category}</p>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-desc">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="size-selector">
              <p className="size-label">Size</p>
              <div className="size-options">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-primary btn-add" onClick={handleAdd} disabled={!selectedSize}>
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
