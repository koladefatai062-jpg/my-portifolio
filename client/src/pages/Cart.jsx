import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/orders';
import './Cart.css';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: '', email: '', phone: '', address: '' });
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await placeOrder({
        ...form,
        items: items.map(i => ({ product: i._id, name: i.name, size: i.size, quantity: i.quantity, price: i.price })),
        totalAmount,
      });
      setPlaced(true);
      clearCart();
    } catch {
      setError('Failed to place order. Try again.');
    }
  };

  if (placed) {
    return (
      <div className="cart-page container">
        <div className="cart-empty">
          <h2>Order Placed!</h2>
          <p>Your order has been submitted. We'll send a confirmation to your email.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 24 }}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page container">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add some items to get started.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 24 }}>Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="section-title">Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={`${item._id}-${item.size}`} className="cart-item">
              <img src={item.images?.[0] || 'https://placehold.co/120x160/111/fff?text=ROGUE'} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-size">Size: {item.size}</p>
                <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}>+</button>
              </div>
              <button className="cart-item-remove" onClick={() => removeItem(item._id, item.size)}>&times;</button>
            </div>
          ))}
        </div>

        <form className="cart-checkout" onSubmit={handleCheckout}>
          <h3>Checkout</h3>
          {error && <p className="error-msg">{error}</p>}
          <input name="customerName" placeholder="Full Name" value={form.customerName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <textarea name="address" placeholder="Shipping Address" value={form.address} onChange={handleChange} required rows={3} />
          <div className="cart-total">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
