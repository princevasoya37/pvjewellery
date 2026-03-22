import { useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, setFilters } from '../store/productsSlice';
import { getImageUrl } from '../api/client';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name' },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list, pagination, filters, loading, error, categories } = useSelector((s) => s.products);

  const syncFiltersFromUrl = useCallback(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(setFilters(params));
    return params;
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = syncFiltersFromUrl();
    dispatch(fetchProducts({ ...params, page: params.page || 1 }));
  }, [dispatch, syncFiltersFromUrl]);

  const updateUrl = (newFilters) => {
    const next = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v != null && v !== '') next.set(k, String(v));
    });
    setSearchParams(next);
  };

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value, page: 1 };
    dispatch(setFilters(next));
    updateUrl(next);
    dispatch(fetchProducts(next));
  };

  const handlePageChange = (page) => {
    const next = { ...filters, page };
    dispatch(setFilters(next));
    updateUrl(next);
    dispatch(fetchProducts(next));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-semibold text-gray-800 mb-6">Shop</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              className="input-field"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterChange('search', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="input-field"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All</option>
              <option value="diamond">Diamond</option>
              <option value="jewellery">Jewellery</option>
            </select>
          </div>
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="input-field"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min price</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max price</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cut</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Round"
              value={filters.cut || ''}
              onChange={(e) => handleFilterChange('cut', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. D, E"
              value={filters.color || ''}
              onChange={(e) => handleFilterChange('color', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clarity</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. VVS1"
              value={filters.clarity || ''}
              onChange={(e) => handleFilterChange('clarity', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
            <select
              className="input-field"
              value={filters.sort || 'newest'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </aside>

        <div className="flex-1">
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500">No products match your filters.</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {pagination.total} product{pagination.total !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {list.map((p) => (
                  <Link key={p._id} to={`/products/${p.slug}`} className="card group">
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">No image</div>
                      {p.images?.[0] && (
                        <img
                          src={getImageUrl(p.images[0])}
                          alt={p.name}
                          className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 truncate">{p.name}</h3>
                      <p className="text-primary-600 font-medium mt-1">
                        ${typeof p.price === 'number' ? p.price.toLocaleString() : p.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    type="button"
                    className="btn-secondary disabled:opacity-50"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </button>
                  <span className="flex items-center px-4">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn-secondary disabled:opacity-50"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
