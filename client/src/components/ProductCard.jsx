import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img src={product.images?.[0] || 'https://placehold.co/600x800/111/fff?text=ROGUE'} alt={product.name} />
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <p className="product-card-category">{product.category}</p>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
