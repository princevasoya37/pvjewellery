import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(() => setStats({ orders: 0, products: 0, users: 0, totalSales: 0, avgOrderValue: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-500">Loading dashboard…</div>
      </div>
    );
  }

  const cards = [
    { label: 'Total sales', value: stats?.totalSales != null ? `₹${Number(stats.totalSales).toLocaleString('en-IN')}` : '₹0', to: '/admin/orders', color: 'primary' },
    { label: 'Orders', value: stats?.orders ?? 0, to: '/admin/orders', color: 'accent' },
    { label: 'Avg order value', value: stats?.avgOrderValue != null ? `₹${Number(stats.avgOrderValue).toLocaleString('en-IN')}` : '₹0', to: '/admin/orders', color: 'gray' },
    { label: 'Products', value: stats?.products ?? 0, to: '/admin/products', color: 'gray' },
    { label: 'Users', value: stats?.users ?? 0, to: '/admin/users', color: 'gray' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">High-level performance across orders, sales, products and users.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="glass-panel rounded-2xl p-5 hover:-translate-y-1 hover:shadow-soft-lg transition-all duration-200 block"
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-[0.14em]">{c.label}</p>
            <p className="text-2xl font-semibold mt-2 text-slate-900">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
