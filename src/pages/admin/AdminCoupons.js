import { useState, useEffect } from 'react';
import api from '../../api/client';

export default function AdminCoupons() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percent',
    value: '',
    minOrder: '',
    maxUses: '',
    validFrom: '',
    validTo: '',
    isActive: true,
  });

  const fetchCoupons = () => {
    api.get('/admin/coupons').then((r) => setList(r.data)).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({
      code: c.code || '',
      type: c.type || 'percent',
      value: c.value ?? '',
      minOrder: c.minOrder ?? '',
      maxUses: c.maxUses ?? '',
      validFrom: c.validFrom ? new Date(c.validFrom).toISOString().slice(0, 16) : '',
      validTo: c.validTo ? new Date(c.validTo).toISOString().slice(0, 16) : '',
      isActive: c.isActive !== false,
    });
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      value: Number(form.value) || 0,
      minOrder: form.minOrder ? Number(form.minOrder) : undefined,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      validFrom: form.validFrom ? new Date(form.validFrom).toISOString() : undefined,
      validTo: form.validTo ? new Date(form.validTo).toISOString() : undefined,
    };
    if (editingId) {
      api.put(`/admin/coupons/${editingId}`, payload).then(() => { setFormOpen(false); setEditingId(null); fetchCoupons(); }).catch((err) => alert(err.response?.data?.message || 'Failed'));
    } else {
      api.post('/admin/coupons', payload).then(() => { setFormOpen(false); setForm({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', validFrom: '', validTo: '', isActive: true }); fetchCoupons(); }).catch((err) => alert(err.response?.data?.message || 'Failed'));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    api.delete(`/admin/coupons/${id}`).then(() => fetchCoupons()).catch((e) => alert(e.response?.data?.message || 'Delete failed'));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold text-gray-800">Coupons</h1>
        <button type="button" onClick={() => { setFormOpen(true); setEditingId(null); setForm({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', validFrom: '', validTo: '', isActive: true }); }} className="btn-primary">
          Add coupon
        </button>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 my-8">
            <h2 className="font-display text-lg font-semibold mb-4">{editingId ? 'Edit coupon' : 'New coupon'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} required className="input-field" placeholder="SAVE10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="input-field">
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input type="number" min="0" step="0.01" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} required className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min order</label>
                  <input type="number" min="0" value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max uses</label>
                  <input type="number" min="0" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid from</label>
                  <input type="datetime-local" value={form.validFrom} onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid to</label>
                  <input type="datetime-local" value={form.validTo} onChange={(e) => setForm((f) => ({ ...f, validTo: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 py-8">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500 py-8">No coupons. Add one.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Code</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Value</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Used</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Active</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{c.code}</td>
                  <td className="px-4 py-3 capitalize">{c.type}</td>
                  <td className="px-4 py-3">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="px-4 py-3">{c.usedCount ?? 0}</td>
                  <td className="px-4 py-3">{c.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => openEdit(c)} className="text-primary-600 text-sm mr-2 hover:underline">Edit</button>
                    <button type="button" onClick={() => handleDelete(c._id)} className="text-red-600 text-sm hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
