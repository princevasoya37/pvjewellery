import { useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, setFilters } from '../store/productsSlice';
import { toggleWishlistItem, selectWishlistItems } from '../store/wishlistSlice';
import { getImageUrl } from '../api/client';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Masterpieces' },
  { value: 'priceAsc', label: 'Acquisition: Low to High' },
  { value: 'priceDesc', label: 'Acquisition: High to Low' },
  { value: 'name', label: 'Maison Title' },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list, pagination, filters, loading, error, categories } = useSelector((s) => s.products);
  const wishlistItems = useSelector(selectWishlistItems);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="border-b border-gold/20 pb-6 mb-12">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">Private Vaults</span>
        <h1 className="font-display text-4xl sm:text-5xl font-light text-luxury-black dark:text-white font-serif">Explore Creations</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Filter Sidebar */}
        <aside className="lg:w-64 flex-shrink-0 space-y-8 bg-white/60 dark:bg-[#15120F] border border-gold/20 p-8 shadow-sm">
          <div className="border-b border-gold/20 pb-4">
            <span className="font-serif text-sm uppercase tracking-[0.25em] font-medium block dark:text-gold">Maison Filters</span>
          </div>

          <div className="space-y-6 text-xs uppercase tracking-wider">
            <div>
              <label className="block text-gray-500 mb-2 font-medium">Search Vault</label>
              <input
                type="text"
                className="input-field py-2.5 text-xs uppercase tracking-wider"
                placeholder="Search..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange('search', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-2 font-medium">Collection Type</label>
              <select
                className="input-field py-2.5 text-xs uppercase tracking-wider"
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Vaults</option>
                <option value="high-jewellery">High Joaillerie</option>
                <option value="engagement">Bridal & Solitaires</option>
                <option value="gemstones">Royal Gemstones</option>
                <option value="gold">Heritage Gold</option>
                <option value="custom">Bespoke Atelier</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 mb-2 font-medium">Diamond Silhouette</label>
              <select
                className="input-field py-2.5 text-xs uppercase tracking-wider"
                value={filters.shape || ''}
                onChange={(e) => handleFilterChange('shape', e.target.value)}
              >
                <option value="">All Silhouettes</option>
                <option value="Round">Round Brilliant</option>
                <option value="Princess">Princess Cut</option>
                <option value="Emerald">Emerald Cut</option>
                <option value="Pear">Pear Silhouette</option>
                <option value="Oval">Oval Majestic</option>
              </select>
            </div>

            {categories.length > 0 && (
              <div>
                <label className="block text-gray-500 mb-2 font-medium">Category</label>
                <select
                  className="input-field py-2.5 text-xs uppercase tracking-wider"
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-gray-500 mb-2 font-medium">Min Investment (₹)</label>
              <input
                type="number"
                min="0"
                className="input-field py-2.5 text-xs"
                placeholder="Min..."
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-2 font-medium">Max Investment (₹)</label>
              <input
                type="number"
                min="0"
                className="input-field py-2.5 text-xs"
                placeholder="Max..."
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-500 mb-2 font-medium">Sort Masterpieces</label>
              <select
                className="input-field py-2.5 text-xs uppercase tracking-wider"
                value={filters.sort || 'newest'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {error && <p className="text-red-600 mb-4 font-sans">{error}</p>}

          {loading ? (
            <div className="py-24 text-center font-sans tracking-widest uppercase text-xs text-gray-400">Summoning Masterpieces...</div>
          ) : list.length === 0 ? (
            <div className="py-24 text-center font-sans tracking-widest text-xs text-gray-400 uppercase">No Masterpieces match your criteria in the current vault.</div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-gray-400 font-sans pb-8 border-b border-gold/10">
                <span className="uppercase tracking-widest font-medium">Curated Vault</span>
                <span>{pagination.total} Creation{pagination.total !== 1 ? 's' : ''} Available</span>
              </div>

              {Object.entries(filters).filter(([k, v]) => v && ['search', 'type', 'category', 'shape'].includes(k)).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-6 pb-2 font-sans">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 mr-2 font-medium">Active Filters:</span>
                  {Object.entries(filters).map(([k, v]) => {
                    if (!v || !['search', 'type', 'category', 'shape'].includes(k)) return null;
                    const labelMap = {
                      search: `Keyword: ${v}`,
                      type: `Vault: ${v}`,
                      category: `Category: ${categories?.find(c => c._id === v)?.name || v}`,
                      shape: `Silhouette: ${v}`
                    };
                    return (
                      <span key={k} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/30 text-gold text-[10px] uppercase tracking-widest rounded-none">
                        <span>{labelMap[k]}</span>
                        <button
                          type="button"
                          onClick={() => handleFilterChange(k, '')}
                          className="hover:text-white transition-colors ml-1 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      const reset = { ...filters, search: '', type: '', category: '', shape: '', minPrice: '', maxPrice: '', page: 1 };
                      dispatch(setFilters(reset));
                      updateUrl(reset);
                      dispatch(fetchProducts(reset));
                    }}
                    className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-gold transition-colors ml-2 underline"
                  >
                    Clear All
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pt-8">
                {list.map((p) => {
                  const isWishlisted = wishlistItems.some((i) => i._id === p._id);
                  return (
                    <div key={p._id} className="card group flex flex-col justify-between overflow-hidden relative border border-gold/20 shadow-soft-lg dark:bg-[#15120F]">
                      <div className="aspect-square bg-[#F5F5F5] dark:bg-black overflow-hidden relative">
                        <Link to={`/products/${p.slug}`} className="block w-full h-full">
                          {p.images?.[0] ? (
                            <img
                              src={getImageUrl(p.images[0])}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400 font-sans">Haute Creation</div>
                          )}
                        </Link>

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dispatch(toggleWishlistItem({
                              _id: p._id,
                              name: p.name,
                              price: p.price,
                              images: p.images,
                              slug: p.slug,
                            }));
                          }}
                          className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-gold/40 flex items-center justify-center text-gold shadow-md hover:scale-110 active:scale-95 transition-all focus:outline-none z-10"
                          aria-label="Wishlist"
                          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                        >
                          <svg className={`w-5 h-5 stroke-1 ${isWishlisted ? 'fill-current text-gold' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </button>

                        <span className="absolute top-4 left-4 pill-badge shadow-sm">
                          Maison
                        </span>
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-1 border-t border-gold/10">
                        <div>
                          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold font-medium block mb-1">Haute Joaillerie</span>
                          <Link to={`/products/${p.slug}`}>
                            <h3 className="font-display text-xl font-light dark:text-white line-clamp-1 group-hover:text-gold transition-colors">{p.name}</h3>
                          </Link>
                          {p.description && <p className="text-xs text-gray-500 line-clamp-2 mt-2 font-light leading-snug">{p.description}</p>}
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                          <span className="font-sans text-sm font-semibold tracking-wide dark:text-gold">
                            ₹{Number(p.price).toLocaleString('en-IN')}
                          </span>
                          <Link
                            to={`/products/${p.slug}`}
                            className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-gold hover:text-luxury-black dark:hover:text-white transition-colors"
                          >
                            Acquire →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gold/20 font-sans text-xs">
                  <button
                    type="button"
                    className="btn-secondary disabled:opacity-30"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </button>
                  <span className="px-6 font-serif tracking-widest text-sm uppercase dark:text-white">
                    Vault {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn-secondary disabled:opacity-30"
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
