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

  const renderRadioFilter = (title, key, options) => (
    <div className="py-5 border-b border-gray-200/60 dark:border-gray-800/60">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 text-[#111111] dark:text-white">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = filters[key] === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleFilterChange(key, isSelected ? '' : option)}
              className="flex items-center gap-3 text-left w-full py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white font-sans group transition-colors focus:outline-none"
            >
              <span className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                isSelected
                  ? 'border-[#111111] dark:border-gold'
                  : 'border-gray-300 dark:border-gray-700 group-hover:border-[#111111] dark:group-hover:border-gold'
              }`}>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111111] dark:bg-gold animate-fadeIn" />
                )}
              </span>
              <span className="uppercase tracking-[0.15em] font-light text-[10px]">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16 py-12 font-sans">
      <div className="border-b border-gray-200/60 dark:border-gray-800/60 pb-6 mb-12">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">Private Vaults</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#111111] dark:text-white">Explore Creations</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Filter Sidebar */}
        <aside className="lg:w-64 flex-shrink-0 space-y-6 bg-transparent py-2">
          <div className="border-b border-gray-200/60 dark:border-gray-800/60 pb-4">
            <span className="font-serif text-sm uppercase tracking-[0.25em] font-medium block text-[#111111] dark:text-gold">Maison Filters</span>
          </div>

          <div className="space-y-4">
            {/* Search filter */}
            <div className="py-5 border-b border-gray-200/60 dark:border-gray-800/60">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 text-[#111111] dark:text-white">Search Vault</label>
              <input
                type="text"
                className="w-full bg-white/80 dark:bg-[#1A1613] border border-gray-200 dark:border-gray-800 px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-gold transition-colors"
                placeholder="Keyword..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Custom 4Cs filters */}
            {renderRadioFilter('Diamond Cut', 'cut', ['Round', 'Princess'])}
            {renderRadioFilter('Diamond Color', 'color', ['D', 'E', 'F'])}
            {renderRadioFilter('Diamond Clarity', 'clarity', ['VVS1', 'IF'])}

            {/* Carat range slider */}
            <div className="py-5 border-b border-gray-200/60 dark:border-gray-800/60">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#111111] dark:text-white">Carat Weight</h3>
                <span className="text-[9px] tracking-wider text-gray-500 font-sans">
                  {filters.caratMin || '0.5'} - {filters.caratMax || '5.0'} CT
                </span>
              </div>
              <div className="space-y-2 pt-1">
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={filters.caratMax || '5.0'}
                  onChange={(e) => handleFilterChange('caratMax', e.target.value)}
                  className="w-full h-[2px] bg-gray-200 dark:bg-gray-800 appearance-none cursor-pointer accent-[#111111] dark:accent-gold"
                />
                <div className="flex justify-between text-[9px] font-light text-gray-400">
                  <span>0.5 CT</span>
                  <span>5.0 CT</span>
                </div>
              </div>
            </div>

            {/* Metal Type */}
            {renderRadioFilter('Metal Type', 'metal', ['Gold', 'Platinum'])}

            {/* Collection dropdown */}
            <div className="py-5 border-b border-gray-200/60 dark:border-gray-800/60">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 text-[#111111] dark:text-white">Collection Type</label>
              <select
                className="w-full bg-white/80 dark:bg-[#1A1613] border border-gray-200 dark:border-gray-800 px-3 py-2 text-[11px] uppercase tracking-wider text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-gold transition-colors"
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

            {/* Category selection */}
            {categories.length > 0 && (
              <div className="py-5 border-b border-gray-200/60 dark:border-gray-800/60">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 text-[#111111] dark:text-white">Category</label>
                <select
                  className="w-full bg-white/80 dark:bg-[#1A1613] border border-gray-200 dark:border-gray-800 px-3 py-2 text-[11px] uppercase tracking-wider text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-gold transition-colors"
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

            {/* Investment Range */}
            <div className="py-5 border-b border-gray-200/60 dark:border-gray-800/60">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 text-[#111111] dark:text-white">Investment Range (₹)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  className="w-1/2 bg-white/80 dark:bg-[#1A1613] border border-gray-200 dark:border-gray-800 px-2 py-2 text-[11px] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-gold transition-colors"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span className="text-gray-400 font-light">-</span>
                <input
                  type="number"
                  min="0"
                  className="w-1/2 bg-white/80 dark:bg-[#1A1613] border border-gray-200 dark:border-gray-800 px-2 py-2 text-[11px] text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-gold transition-colors"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {/* Sort options */}
            <div className="py-5 border-b border-gray-200/60 dark:border-gray-800/60">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] mb-3 text-[#111111] dark:text-white">Sort Masterpieces</label>
              <select
                className="w-full bg-white/80 dark:bg-[#1A1613] border border-gray-200 dark:border-gray-800 px-3 py-2 text-[11px] uppercase tracking-wider text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-gold transition-colors"
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
              <div className="flex items-center justify-between text-xs text-gray-400 font-sans pb-8 border-b border-gray-200/60 dark:border-gray-800/60">
                <span className="uppercase tracking-widest font-medium">Curated Vault</span>
                <span>{pagination.total} Creation{pagination.total !== 1 ? 's' : ''} Available</span>
              </div>

              {Object.entries(filters).filter(([k, v]) => v && ['search', 'type', 'category', 'shape', 'cut', 'color', 'clarity', 'caratMax', 'metal'].includes(k)).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-6 pb-2 font-sans">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 mr-2 font-medium">Active Filters:</span>
                  {Object.entries(filters).map(([k, v]) => {
                    if (!v || !['search', 'type', 'category', 'shape', 'cut', 'color', 'clarity', 'caratMax', 'metal'].includes(k)) return null;
                    const labelMap = {
                      search: `Keyword: ${v}`,
                      type: `Vault: ${v}`,
                      category: `Category: ${categories?.find(c => c._id === v)?.name || v}`,
                      shape: `Silhouette: ${v}`,
                      cut: `Cut: ${v}`,
                      color: `Color: Grade ${v}`,
                      clarity: `Clarity: ${v}`,
                      caratMax: `Max Carat: ${v} CT`,
                      metal: `Metal: ${v}`
                    };
                    return (
                      <span key={k} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#C5A880] text-[10px] uppercase tracking-widest rounded-none">
                        <span>{labelMap[k]}</span>
                        <button
                          type="button"
                          onClick={() => handleFilterChange(k, '')}
                          className="hover:text-[#111111] dark:hover:text-white transition-colors ml-1 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      const reset = {
                        ...filters,
                        search: '',
                        type: '',
                        category: '',
                        shape: '',
                        minPrice: '',
                        maxPrice: '',
                        cut: '',
                        color: '',
                        clarity: '',
                        caratMin: '',
                        caratMax: '',
                        metal: '',
                        page: 1
                      };
                      dispatch(setFilters(reset));
                      updateUrl(reset);
                      dispatch(fetchProducts(reset));
                    }}
                    className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#C5A880] transition-colors ml-2 underline"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* 4-column borderless grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 pt-8">
                {list.map((p) => {
                  const isWishlisted = wishlistItems.some((i) => i._id === p._id);
                  const compareAtPrice = p.compareAtPrice || (p.price > 400000 ? Math.round(p.price * 1.15) : null);
                  return (
                    <div key={p._id} className="group flex flex-col justify-between overflow-hidden relative bg-transparent">
                      {/* aspect-4/5 frame with borderless/shadowless design */}
                      <div className="relative aspect-[4/5] bg-[#FBF9F6] dark:bg-black overflow-hidden rounded-lg">
                        <Link to={`/products/${p.slug}`} className="block w-full h-full">
                          {p.images?.[0] ? (
                            <img
                              src={getImageUrl(p.images[0])}
                              alt={p.name}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                          className="absolute top-4 right-4 w-9 h-9 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-red-500 hover:scale-110 active:scale-95 transition-all focus:outline-none z-10 shadow-sm"
                          aria-label="Wishlist"
                          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                        >
                          <svg className={`w-4.5 h-4.5 stroke-[1.25] ${isWishlisted ? 'fill-current text-red-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        </button>

                        {/* Sale badge */}
                        {compareAtPrice > p.price && (
                          <span className="absolute top-4 left-4 bg-[#111111] dark:bg-gold text-white dark:text-black text-[9px] font-sans font-medium uppercase tracking-[0.25em] px-2.5 py-1 z-10 shadow-sm leading-none">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Details block centered with serif titles */}
                      <div className="pt-4 flex flex-col items-center text-center">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 font-sans mb-1.5 block">
                          {categories.find(c => c._id === p.category)?.name || 'High Joaillerie'}
                        </span>
                        <Link to={`/products/${p.slug}`} className="block w-full">
                          <h3 className="font-serif text-lg font-normal tracking-wide text-[#111111] dark:text-white line-clamp-1 group-hover:text-[#C5A880] transition-colors leading-snug">
                            {p.name}
                          </h3>
                        </Link>
                        <div className="mt-1 text-sm font-sans font-medium text-[#C5A880] tracking-wider">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                          {compareAtPrice > p.price && (
                            <span className="ml-2 text-xs text-gray-400 line-through font-light">
                              ₹{Number(compareAtPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16 pt-8 border-t border-gray-200/60 dark:border-gray-800/60 font-sans text-xs">
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
