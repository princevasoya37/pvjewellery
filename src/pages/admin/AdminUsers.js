import { useState, useEffect } from 'react';
import api from '../../api/client';

export default function AdminUsers() {
  const [data, setData] = useState({ items: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get('/admin/users', { params: { page, limit: 20 } })
      .then((r) => setData(r.data))
      .catch(() => setData({ items: [], pagination: {} }))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold text-gray-800">Users</h1>
      </div>

      {loading ? (
        <p className="text-gray-500 py-8">Loading…</p>
      ) : data.items?.length === 0 ? (
        <p className="text-gray-500 py-8">No users.</p>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Role</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.items.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${u.role === 'admin' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
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
    </div>
  );
}
