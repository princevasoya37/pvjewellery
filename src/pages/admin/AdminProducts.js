import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import AdminProductForm from '../../components/admin/AdminProductForm';
import BulkUploadModal from '../../components/admin/BulkUploadModal';

export default function AdminProducts() {
  const [list, setList] = useState({ items: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/admin/products', { params: { page, limit: 20, search: search || undefined } })
      .then((res) => setList(res.data))
      .catch(() => setList({ items: [], pagination: {} }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    api.delete(`/admin/products/${id}`).then(() => fetchProducts()).catch((e) => alert(e.response?.data?.message || 'Delete failed'));
  };

  const handleSaved = () => {
    setEditingId(null);
    setCreateOpen(false);
    setBulkOpen(false);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-semibold text-gray-800">Products</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-xs"
          />
          <button type="button" onClick={() => setBulkOpen(true)} className="btn-secondary">
            Bulk CSV
          </button>
          <button type="button" onClick={() => setCreateOpen(true)} className="btn-primary">
            Add product
          </button>
        </div>
      </div>

      {createOpen && (
        <AdminProductForm onClose={() => setCreateOpen(false)} onSaved={handleSaved} />
      )}
      {editingId && (
        <AdminProductForm productId={editingId} onClose={() => setEditingId(null)} onSaved={handleSaved} />
      )}
      {bulkOpen && <BulkUploadModal onClose={() => setBulkOpen(false)} onDone={handleSaved} />}

      {loading ? (
        <p className="text-gray-500 py-8">Loading…</p>
      ) : list.items.length === 0 ? (
        <p className="text-gray-500 py-8">No products. Add one or bulk upload CSV.</p>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Price</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Stock</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Updated</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700 w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {list.items.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/products/${p.slug}`} className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 capitalize">{p.type}</td>
                      <td className="px-4 py-3">₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setEditingId(p._id)} className="text-primary-600 text-sm mr-2 hover:underline">Edit</button>
                        <button type="button" onClick={() => handleDelete(p._id)} className="text-red-600 text-sm hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {list.pagination?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-50">Prev</button>
              <span className="py-2 text-gray-600">Page {page} of {list.pagination.totalPages}</span>
              <button type="button" disabled={page >= list.pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
