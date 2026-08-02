import { useState, useEffect, useCallback } from 'react';
import api from '../../api/client';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

export default function AdminOrders() {
  const [data, setData] = useState({ items: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = useCallback(() => {
    setLoading(true);
    api.get('/admin/orders', { params: { page, limit: 20, status: statusFilter || undefined } })
      .then((r) => setData(r.data))
      .catch(() => setData({ items: [], pagination: {} }))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = (orderId, status, tracking) => {
    setUpdatingId(orderId);
    api.patch(`/admin/orders/${orderId}`, { status, trackingNumber: tracking })
      .then(() => { fetchOrders(); setDetailOrder((d) => (d && d._id === orderId ? null : d)); })
      .catch((e) => alert(e.response?.data?.message || 'Update failed'))
      .finally(() => setUpdatingId(null));
  };

  const openDetail = (id) => {
    api.get(`/admin/orders/${id}`).then((r) => { setDetailOrder(r.data); setTrackingNumber(r.data.trackingNumber || ''); }).catch(() => alert('Failed to load order'));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-semibold text-gray-800">Orders</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field max-w-xs">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 py-8">Loading…</p>
      ) : data.items?.length === 0 ? (
        <p className="text-gray-500 py-8">No orders.</p>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Order #</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.items.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">{o.orderNumber}</td>
                      <td className="px-4 py-3">
                        {o.user ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() || o.user.email : '—'}
                      </td>
                      <td className="px-4 py-3">₹{Number(o.total).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                          disabled={updatingId === o._id}
                          className="text-sm border rounded px-2 py-1"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => openDetail(o._id)} className="text-primary-600 text-sm hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {data.pagination?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-50">Prev</button>
              <span className="py-2 text-gray-600">Page {page} of {data.pagination.totalPages}</span>
              <button type="button" disabled={page >= data.pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}

      {detailOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-display text-xl font-semibold">Order {detailOrder.orderNumber}</h2>
              <button type="button" onClick={() => setDetailOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p className="text-sm text-gray-600">Customer: {detailOrder.user?.email} {detailOrder.user?.firstName || detailOrder.user?.lastName ? `(${[detailOrder.user.firstName, detailOrder.user.lastName].filter(Boolean).join(' ')})` : ''}</p>
            <p className="text-sm text-gray-600">Total: ₹{Number(detailOrder.total).toLocaleString('en-IN')} · Status: {detailOrder.status}</p>
            <p className="text-sm text-gray-600 mt-2">Shipping: {detailOrder.shippingAddress?.line1}, {detailOrder.shippingAddress?.city}, {detailOrder.shippingAddress?.zip}</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking number</label>
              <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="input-field mb-2" placeholder="Optional" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => updateStatus(detailOrder._id, s, trackingNumber)} disabled={updatingId === detailOrder._id} className="btn-secondary text-sm disabled:opacity-50">
                  Set {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
