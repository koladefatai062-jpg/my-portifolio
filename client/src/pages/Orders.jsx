import { useState } from 'react';
import { lookupOrders } from '../api/orders';
import './Orders.css';

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function Orders() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const data = await lookupOrders(email);
      setOrders(data);
    } catch {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-page container">
      <h1 className="section-title">Track Orders</h1>

      <form className="orders-search" onSubmit={handleSearch}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-dark btn-sm">Search</button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {loading && <p>Loading...</p>}

      {orders !== null && !loading && (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p className="empty-msg">No orders found for this email.</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">#{order._id.slice(-8)}</span>
                  <span className="order-status" style={{ background: STATUS_COLORS[order.status] || '#999' }}>
                    {order.status}
                  </span>
                </div>
                <div className="order-card-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <span>{item.name} {item.size && `(${item.size})`} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-card-total">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
