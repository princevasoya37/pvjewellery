import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../../api/client';

const TYPES = ['diamond', 'jewellery'];

export default function AdminProductForm({ productId, onClose, onSaved }) {
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'diamond',
    category: '',
    collection: '',
    images: [],
    price: '',
    compareAtPrice: '',
    sku: '',
    stock: 0,
    isActive: true,
    cut: '',
    color: '',
    clarity: '',
    carat: '',
    shape: '',
    metal: '',
    certifications: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {});
    api.get('/products/collections').then((r) => setCollections(r.data)).catch(() => {});
    if (productId) {
      api.get(`/admin/products/${productId}`)
        .then((r) => {
          const d = r.data;
          setForm({
            name: d.name || '',
            description: d.description || '',
            type: d.type || 'diamond',
            category: d.category?._id || d.category || '',
            collection: d.collection?._id || d.collection || '',
            images: Array.isArray(d.images) ? d.images : [],
            price: d.price ?? '',
            compareAtPrice: d.compareAtPrice ?? '',
            sku: d.sku || '',
            stock: d.stock ?? 0,
            isActive: d.isActive !== false,
            cut: d.cut || '',
            color: d.color || '',
            clarity: d.clarity || '',
            carat: d.carat ?? '',
            shape: d.shape || '',
            metal: d.metal || '',
            certifications: Array.isArray(d.certifications) ? d.certifications.join(', ') : '',
          });
        })
        .catch(() => setError('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = () => {
    if (!imageFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', imageFile);
    api.post('/admin/upload/image', fd)
      .then((r) => {
        const imageUrl = r.data.fullUrl || r.data.url;
        if (imageUrl) setForm((prev) => ({ ...prev, images: [...(prev.images || []), imageUrl] }));
        setImageFile(null);
      })
      .catch((e) => setError(e.response?.data?.message || 'Upload failed'))
      .finally(() => setUploading(false));
  };

  const removeImage = (url) => {
    setForm((prev) => ({ ...prev, images: (prev.images || []).filter((u) => u !== url) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      category: form.category || undefined,
      collection: form.collection || undefined,
      images: form.images,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      sku: form.sku.trim() || undefined,
      stock: Number(form.stock) || 0,
      isActive: form.isActive,
      cut: form.cut.trim() || undefined,
      color: form.color.trim() || undefined,
      clarity: form.clarity.trim() || undefined,
      carat: form.carat !== '' ? Number(form.carat) : undefined,
      shape: form.shape.trim() || undefined,
      metal: form.metal.trim() || undefined,
      certifications: form.certifications ? form.certifications.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
    };
    const req = productId ? api.put(`/admin/products/${productId}`, payload) : api.post('/admin/products', payload);
    req
      .then(() => onSaved())
      .catch((e) => setError(e.response?.data?.message || (e.response?.data?.errors && JSON.stringify(e.response.data.errors)) || 'Save failed'))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="card p-8 text-gray-500">Loading…</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-display text-xl font-semibold">{productId ? 'Edit product' : 'New product'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-field">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                <option value="">—</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
              <select name="collection" value={form.collection} onChange={handleChange} className="input-field">
                <option value="">—</option>
                {collections.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.images || []).map((url) => (
                <span key={url} className="relative inline-block">
                  <img src={getImageUrl(url)} alt="" className="w-16 h-16 object-cover rounded border" onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect fill="%23f3f4f6" width="64" height="64"/><text x="50%" y="50%" fill="%239ca3af" font-size="10" text-anchor="middle" dy=".3em">No image</text></svg>'; }} />
                  <button type="button" onClick={() => removeImage(url)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0])} className="text-sm" />
              <button type="button" onClick={handleImageUpload} disabled={!imageFile || uploading} className="btn-secondary text-sm">
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare at price</label>
              <input name="compareAtPrice" type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field" />
          </div>
          {form.type === 'diamond' && (
            <div className="border-t pt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Diamond attributes</p>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500">Cut</label><input name="cut" value={form.cut} onChange={handleChange} className="input-field" /></div>
                <div><label className="block text-xs text-gray-500">Color</label><input name="color" value={form.color} onChange={handleChange} className="input-field" /></div>
                <div><label className="block text-xs text-gray-500">Clarity</label><input name="clarity" value={form.clarity} onChange={handleChange} className="input-field" /></div>
                <div><label className="block text-xs text-gray-500">Carat</label><input name="carat" type="number" min="0" step="0.01" value={form.carat} onChange={handleChange} className="input-field" /></div>
                <div><label className="block text-xs text-gray-500">Shape</label><input name="shape" value={form.shape} onChange={handleChange} className="input-field" /></div>
                <div><label className="block text-xs text-gray-500">Metal</label><input name="metal" value={form.metal} onChange={handleChange} className="input-field" /></div>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Certifications (comma-separated)</label>
                <input name="certifications" value={form.certifications} onChange={handleChange} className="input-field" placeholder="e.g. GIA, IGI" />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
