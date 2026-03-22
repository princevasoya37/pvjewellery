import { useState, useEffect } from 'react';
import api from '../../api/client';

export default function AdminCategories() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', order: 0 });

  const fetchCategories = () => {
    api.get('/admin/categories').then((r) => setList(r.data)).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, order: c.order ?? 0 });
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      api.put(`/admin/categories/${editingId}`, form).then(() => { setFormOpen(false); setEditingId(null); fetchCategories(); }).catch((err) => alert(err.response?.data?.message || 'Failed'));
    } else {
      api.post('/admin/categories', form).then(() => { setFormOpen(false); setForm({ name: '', order: 0 }); fetchCategories(); }).catch((err) => alert(err.response?.data?.message || 'Failed'));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category?')) return;
    api.delete(`/admin/categories/${id}`).then(() => fetchCategories()).catch((e) => alert(e.response?.data?.message || 'Delete failed'));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold text-gray-800">Categories</h1>
        <button type="button" onClick={() => { setFormOpen(true); setEditingId(null); setForm({ name: '', order: 0 }); }} className="btn-primary">
          Add category
        </button>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="font-display text-lg font-semibold mb-4">{editingId ? 'Edit category' : 'New category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))} className="input-field" />
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
        <p className="text-gray-500 py-8">No categories. Add one.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Slug</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700">Order</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">{c.slug}</td>
                  <td className="px-4 py-3">{c.order ?? 0}</td>
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
