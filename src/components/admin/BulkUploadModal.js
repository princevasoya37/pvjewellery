import { useState } from 'react';
import api from '../../api/client';

const SAMPLE_CSV = `name,type,price,stock,sku,description,category,images,cut,color,clarity,carat,shape
Round Brilliant Diamond,diamond,150000,1,DIAM-001,Premium round diamond,,/uploads/products/sample.jpg,Ideal,E,G,1.2,Round
Gold Ring,jewellery,25000,5,RING-001,Elegant gold ring,,,,,,`;

export default function BulkUploadModal({ onClose, onDone }) {
  const [csv, setCsv] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!csv.trim()) {
      setError('Paste CSV data first.');
      return;
    }
    setError('');
    setLoading(true);
    api.post('/admin/products/bulk', { csv: csv.trim() })
      .then((r) => {
        setResult(r.data);
        if (r.data.inserted > 0) setTimeout(() => onDone(), 1500);
      })
      .catch((e) => setError(e.response?.data?.message || 'Bulk upload failed'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-display text-xl font-semibold">Bulk upload (CSV)</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-4 text-sm text-gray-600 border-b bg-gray-50">
          <p>Columns: name, type (diamond|jewellery), price, stock, sku, description, category (name or id), <strong>images</strong> (path like /uploads/products/xxx.jpg or full URL; use | for multiple), cut, color, clarity, carat, shape, metal, certifications (use | for multiple).</p>
          <button type="button" onClick={() => setCsv(SAMPLE_CSV)} className="text-primary-600 hover:underline mt-1">Insert sample CSV</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 flex flex-col flex-1 min-h-0">
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          {result && (
            <p className="text-green-700 text-sm mb-2">
              Inserted: {result.inserted}. {result.errors?.length ? `Errors: ${result.errors.length}` : ''}
            </p>
          )}
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder="Paste CSV here…"
            rows={12}
            className="input-field font-mono text-sm flex-1 min-h-[200px]"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Close</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Importing…' : 'Import'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
