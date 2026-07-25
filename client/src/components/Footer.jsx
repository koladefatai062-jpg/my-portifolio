import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">ROGUE</span>
          <p>Streetwear for the bold.</p>
        </div>
        <div className="footer-links">
          <Link to="/shop">Shop</Link>
          <Link to="/orders">Track Order</Link>
        </div>
        <p className="footer-copy">&copy; 2026 ROGUE. All rights reserved.</p>
      </div>
    </footer>
  );
}
