import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../api/products';
import { getAdminOrders } from '../../api/orders';
import './Admin.css';

export default function Dashboard() {
  const { email, logout } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    getProducts().then(p => setProductCount(p.length)).catch(() => {});
    getAdminOrders(localStorage.getItem('rogue_token'))
      .then(o => {
        setOrderCount(o.length);
        setRevenue(o.filter(ord => ord.status !== 'cancelled').reduce((sum, ord) => sum + ord.totalAmount, 0));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">ROGUE</h2>
        <nav>
          <a href="/admin" className="admin-nav-link active">Dashboard</a>
          <a href="/admin/products" className="admin-nav-link">Products</a>
          <a href="/admin/orders" className="admin-nav-link">Orders</a>
        </nav>
        <div className="admin-sidebar-footer">
          <span className="admin-email">{email}</span>
          <button onClick={logout} className="btn btn-sm btn-outline">Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        <h1 className="section-title">Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <p className="stat-number">{productCount}</p>
            <p className="stat-label">Products</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{orderCount}</p>
            <p className="stat-label">Orders</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">${revenue.toFixed(0)}</p>
            <p className="stat-label">Revenue</p>
          </div>
        </div>
      </main>
    </div>
  );
}
