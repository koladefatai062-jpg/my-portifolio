import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import './Admin.css';

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories', 'Shoes'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const EMPTY = { name: '', description: '', price: '', category: 'T-Shirts', sizes: [], images: [''], stock: '', featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('rogue_token');

  const load = () => getProducts().then(setProducts).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSizeToggle = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editing) {
        await updateProduct(editing, payload, token);
      } else {
        await createProduct(payload, token);
      }
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (p) => {
    setForm({ ...p, price: String(p.price), stock: String(p.stock) });
    setEditing(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id, token);
      load();
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">ROGUE</h2>
        <nav>
          <a href="/admin" className="admin-nav-link">Dashboard</a>
          <a href="/admin/products" className="admin-nav-link active">Products</a>
          <a href="/admin/orders" className="admin-nav-link">Orders</a>
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="section-title">Products</h1>
          <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY); }}>
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showForm && (
          <form className="admin-form" onSubmit={handleSubmit}>
            <h3>{editing ? 'Edit Product' : 'New Product'}</h3>
            <div className="form-grid">
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
              <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
              <div className="form-full">
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={3} />
              </div>
              <div className="form-full">
                <label className="form-label">Sizes</label>
                <div className="size-grid">
                  {SIZES.map(s => (
                    <button type="button" key={s} className={`size-btn ${form.sizes.includes(s) ? 'active' : ''}`} onClick={() => handleSizeToggle(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="form-full">
                <input name="images.0" placeholder="Image URL" value={form.images[0] || ''} onChange={(e) => setForm(f => ({ ...f, images: [e.target.value] }))} />
              </div>
              <div className="form-full">
                <label className="form-checkbox">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                  Featured product
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">{editing ? 'Update' : 'Create'}</button>
          </form>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(p)} style={{ marginRight: 8 }}>Edit</button>
                  <button className="btn btn-sm btn-outline" onClick={() => handleDelete(p._id)} style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
