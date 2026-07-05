import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug } from '../store/productsSlice';
import { addItem } from '../store/cartSlice';
import { toggleWishlistItem, selectWishlistItems } from '../store/wishlistSlice';
import { toggleCartDrawer } from '../store/themeSlice';
import { getImageUrl } from '../api/client';

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector((s) => s.products);
  const wishlistItems = useSelector(selectWishlistItems);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
  }, [dispatch, slug]);

  const handleAddToCart = () => {
    if (!currentProduct) return;
    dispatch(addItem({
      productId: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images?.[0] ? currentProduct.images[0] : '',
      quantity,
    }));
    setAdded(true);
    dispatch(toggleCartDrawer());
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    if (!currentProduct) return;
    dispatch(toggleWishlistItem({
      _id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      images: currentProduct.images,
      slug: currentProduct.slug,
    }));
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-24 text-center tracking-widest uppercase text-xs font-sans">Summoning Vault Creation...</div>;
  if (error || !currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-red-600 font-sans tracking-wide">
        {error || 'Masterpiece not found'}
      </div>
    );
  }

  const mainImage = getImageUrl(currentProduct.images?.[0]);
  const isWishlisted = wishlistItems.some((i) => i._id === currentProduct._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="aspect-square bg-[#F5F5F5] dark:bg-black rounded-none overflow-hidden relative border border-gold/20 shadow-soft-lg group">
          {mainImage ? (
            <img 
              src={mainImage} 
              alt={currentProduct.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-gray-400">Haute Creation</div>
          )}

          {/* Wishlist Floating Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-6 right-6 w-12 h-12 bg-white dark:bg-black border border-gold/40 flex items-center justify-center text-gold shadow-xl hover:scale-110 active:scale-95 transition-all focus:outline-none z-10"
            aria-label="Add to wishlist"
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <svg className={`w-6 h-6 stroke-1 ${isWishlisted ? 'fill-current text-gold' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          <span className="absolute top-6 left-6 pill-badge shadow-sm">
            Maison Vault
          </span>
        </div>

        <div className="space-y-8 flex flex-col justify-between">
          <div className="space-y-4 border-b border-gold/20 pb-8">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-semibold block">High Joaillerie</span>
            <h1 className="font-display text-4xl sm:text-5xl font-light tracking-tight dark:text-white leading-snug">{currentProduct.name}</h1>
            <p className="text-2xl text-luxury-black font-semibold font-sans dark:text-gold pt-2">
              ₹{Number(currentProduct.price).toLocaleString('en-IN')}
              {currentProduct.compareAtPrice && (
                <span className="ml-3 text-gray-400 line-through text-lg font-light">
                  ₹{Number(currentProduct.compareAtPrice).toLocaleString('en-IN')}
                </span>
              )}
            </p>
          </div>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed font-sans">
            {currentProduct.description}
          </p>

          {(currentProduct.cut || currentProduct.color || currentProduct.clarity || currentProduct.carat || currentProduct.shape || currentProduct.metal) && (
            <div className="p-6 bg-white/60 dark:bg-[#15120F] border border-gold/20 shadow-sm space-y-3">
              <h3 className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-gold">Gemological Specification</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs pt-2 font-sans font-light">
                {currentProduct.cut && <div><span className="text-gray-400 uppercase tracking-widest block text-[9px]">Cut</span> <span className="font-medium dark:text-white">{currentProduct.cut}</span></div>}
                {currentProduct.color && <div><span className="text-gray-400 uppercase tracking-widest block text-[9px]">Color</span> <span className="font-medium dark:text-white">{currentProduct.color}</span></div>}
                {currentProduct.clarity && <div><span className="text-gray-400 uppercase tracking-widest block text-[9px]">Clarity</span> <span className="font-medium dark:text-white">{currentProduct.clarity}</span></div>}
                {currentProduct.carat != null && <div><span className="text-gray-400 uppercase tracking-widest block text-[9px]">Carat Weight</span> <span className="font-medium dark:text-white">{currentProduct.carat} ct</span></div>}
                {currentProduct.shape && <div><span className="text-gray-400 uppercase tracking-widest block text-[9px]">Silhouette</span> <span className="font-medium dark:text-white">{currentProduct.shape}</span></div>}
                {currentProduct.metal && <div><span className="text-gray-400 uppercase tracking-widest block text-[9px]">Precious Metal</span> <span className="font-medium dark:text-white">{currentProduct.metal}</span></div>}
              </div>
            </div>
          )}

          {currentProduct.certifications?.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-sans border-t border-gold/10 pt-4">
              <span className="font-semibold text-gold uppercase tracking-wider text-[10px]">Inspected By:</span>
              <span>{currentProduct.certifications.join(' • ')}</span>
            </div>
          )}

          <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-6 border-t border-gold/20">
            <div className="flex items-center border border-gold/40 bg-white dark:bg-black h-14 px-4 self-start sm:self-auto">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mr-4">Qty</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 text-lg font-light hover:text-gold transition-colors focus:outline-none dark:text-white"
              >
                -
              </button>
              <span className="px-4 text-sm font-semibold dark:text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 text-lg font-light hover:text-gold transition-colors focus:outline-none dark:text-white"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0}
              className={`btn-primary flex-1 h-14 shadow-luxury ${added ? 'bg-gold text-luxury-black' : ''}`}
            >
              {added ? 'Secured in Shopping Bag' : 'Acquire Masterpiece'}
            </button>
          </div>

          {currentProduct.stock != null && currentProduct.stock <= 5 && currentProduct.stock > 0 && (
            <p className="text-xs text-amber-600 font-sans tracking-wide">
              ✦ Confidential notice: Only {currentProduct.stock} left in the private atelier vault.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
