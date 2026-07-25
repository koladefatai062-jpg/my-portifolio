import { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../api/orders';
import './Admin.css';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6',
  delivered: '#22c55e', cancelled: '#ef4444',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('rogue_token');

  const load = () => getAdminOrders(token).then(setOrders).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status, token);
      load();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">ROGUE</h2>
        <nav>
          <a href="/admin" className="admin-nav-link">Dashboard</a>
          <a href="/admin/products" className="admin-nav-link">Products</a>
          <a href="/admin/orders" className="admin-nav-link active">Orders</a>
        </nav>
      </aside>
      <main className="admin-main">
        <h1 className="section-title">Orders</h1>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="order-id">#{order._id.slice(-8)}</td>
                <td>
                  <p>{order.customerName}</p>
                  <p className="order-email">{order.email}</p>
                </td>
                <td>{order.items.map(i => `${i.name} (${i.size || 'N/A'}) x${i.quantity}`).join(', ')}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <select
                    className="status-select"
                    style={{ background: STATUS_COLORS[order.status] || '#999', color: '#fff' }}
                    value={order.status}
                    onChange={(e) => handleStatus(order._id, e.target.value)}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
