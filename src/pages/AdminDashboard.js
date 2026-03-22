import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(() => setStats({ orders: 0, products: 0, users: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-gray-800 mb-6">Admin dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <h3 className="text-sm text-gray-500">Orders</h3>
          <p className="text-2xl font-semibold">{stats?.orders ?? 0}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm text-gray-500">Products</h3>
          <p className="text-2xl font-semibold">{stats?.products ?? 0}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm text-gray-500">Users</h3>
          <p className="text-2xl font-semibold">{stats?.users ?? 0}</p>
        </div>
      </div>
      <nav className="flex flex-wrap gap-4">
        <Link to="/admin/products" className="btn-primary">Products</Link>
        <Link to="/admin/orders" className="btn-secondary">Orders</Link>
        <Link to="/admin/users" className="btn-secondary">Users</Link>
        <Link to="/admin/coupons" className="btn-secondary">Coupons</Link>
      </nav>
    </div>
  );
}
