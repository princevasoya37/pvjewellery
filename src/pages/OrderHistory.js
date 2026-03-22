import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/client';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/orders')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : res.data?.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-gray-800 mb-6">Order history</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} to={`/account/orders/${o._id}`} className="card p-4 block hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <span className="font-medium">{o.orderNumber || o._id}</span>
                <span className="text-sm text-gray-500">{o.status}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">${o.total?.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      )}
      <Link to="/account" className="inline-block mt-6 text-primary-600 hover:underline">Back to account</Link>
    </div>
  );
}
