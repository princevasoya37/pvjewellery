import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, updateQuantity, removeItem, addItem } from '../store/cartSlice';
import { selectWishlistItems, selectIsWishlistOpen, toggleWishlistDrawer, removeWishlistItem } from '../store/wishlistSlice';
import { selectIsCartDrawerOpen, toggleCartDrawer } from '../store/themeSlice';
import { getImageUrl } from '../api/client';

export default function Drawers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const isCartOpen = useSelector(selectIsCartDrawerOpen);

  const wishlistItems = useSelector(selectWishlistItems);
  const isWishlistOpen = useSelector(selectIsWishlistOpen);

  const handleMoveToBag = (item) => {
    dispatch(addItem({
      productId: item._id,
      name: item.name,
      price: item.price,
      image: item.images && item.images[0] ? item.images[0] : '',
      quantity: 1,
    }));
    dispatch(removeWishlistItem(item._id));
    dispatch(toggleWishlistDrawer());
    dispatch(toggleCartDrawer());
  };

  return (
    <>
      {/* Overlay for Cart Drawer */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-fadeIn"
          onClick={() => dispatch(toggleCartDrawer())}
        />
      )}

      {/* Cart Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-500 ease-out-soft ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } dark:bg-[#15120F] dark:text-[#F9F6F0] dark:border-l dark:border-gold/20 font-sans`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gold/20 flex items-center justify-between bg-[#F5F2EB] dark:bg-[#1C1815]">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gold stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <span className="font-serif text-lg tracking-[0.2em] uppercase font-medium">Maison Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(toggleCartDrawer())}
            className="p-2 hover:text-gold transition-colors focus:outline-none"
            aria-label="Close cart drawer"
          >
            <svg className="w-6 h-6 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <svg className="w-16 h-16 stroke-1 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <p className="font-sans text-xs uppercase tracking-[0.2em]">Your bag is currently empty</p>
              <button
                type="button"
                onClick={() => { dispatch(toggleCartDrawer()); navigate('/products'); }}
                className="btn-primary text-[10px]"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="flex gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-[#F5F5F5] dark:bg-black shrink-0 border border-gold/20 overflow-hidden">
                  {item.image ? (
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-sans">Maison</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-display text-sm font-semibold line-clamp-1 dark:text-white">{item.name}</h4>
                    <span className="text-gold font-semibold font-sans mt-1 block">₹{Number(item.price).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-gold/40 rounded-none bg-white dark:bg-black">
                      <button
                        type="button"
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                        className="px-2.5 py-1 text-gray-600 dark:text-gray-300 hover:text-gold transition-colors focus:outline-none"
                      >
                        -
                      </button>
                      <span className="px-2 font-semibold text-xs dark:text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                        className="px-2.5 py-1 text-gray-600 dark:text-gray-300 hover:text-gold transition-colors focus:outline-none"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => dispatch(removeItem(item.productId))}
                      className="text-gray-400 hover:text-red-500 font-sans text-[10px] uppercase tracking-wider underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gold/20 bg-[#F5F2EB] dark:bg-[#1C1815] space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="uppercase tracking-widest text-xs">Estimated Subtotal</span>
              <span className="text-base text-gold font-sans font-bold">₹{Number(cartTotal).toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal font-light">
              Taxes, insured white-glove worldwide delivery & private concierge verification calculated at checkout.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 font-sans text-[10px] uppercase tracking-[0.2em]">
              <button
                type="button"
                onClick={() => { dispatch(toggleCartDrawer()); navigate('/cart'); }}
                className="btn-secondary w-full py-3"
              >
                View Bag
              </button>
              <button
                type="button"
                onClick={() => { dispatch(toggleCartDrawer()); navigate('/checkout'); }}
                className="btn-primary w-full py-3"
              >
                Secure Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for Wishlist Drawer */}
      {isWishlistOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-fadeIn"
          onClick={() => dispatch(toggleWishlistDrawer())}
        />
      )}

      {/* Wishlist Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-500 ease-out-soft ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        } dark:bg-[#15120F] dark:text-[#F9F6F0] dark:border-l dark:border-gold/20 font-sans`}
      >
        {/* Wishlist Header */}
        <div className="p-6 border-b border-gold/20 flex items-center justify-between bg-[#F5F2EB] dark:bg-[#1C1815]">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gold stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="font-serif text-lg tracking-[0.2em] uppercase font-medium">Maison Wishlist ({wishlistItems.length})</span>
          </div>
          <button
            type="button"
            onClick={() => dispatch(toggleWishlistDrawer())}
            className="p-2 hover:text-gold transition-colors focus:outline-none"
            aria-label="Close wishlist drawer"
          >
            <svg className="w-6 h-6 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <svg className="w-16 h-16 stroke-1 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <p className="font-sans text-xs uppercase tracking-[0.2em]">Your wishlist is empty</p>
              <button
                type="button"
                onClick={() => { dispatch(toggleWishlistDrawer()); navigate('/products'); }}
                className="btn-primary text-[10px]"
              >
                Discover Vaults
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item._id} className="flex gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-[#F5F5F5] dark:bg-black shrink-0 border border-gold/20 overflow-hidden">
                  {item.images && item.images[0] ? (
                    <img src={getImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400 font-sans">Maison</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-display text-sm font-semibold line-clamp-1 dark:text-white">{item.name}</h4>
                    <span className="text-gold font-semibold font-sans mt-1 block">₹{Number(item.price).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 font-sans">
                    <button
                      type="button"
                      onClick={() => handleMoveToBag(item)}
                      className="px-4 py-2 bg-luxury-black text-gold text-[10px] uppercase tracking-widest hover:bg-gold hover:text-luxury-black transition-colors"
                    >
                      Move to Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(removeWishlistItem(item._id))}
                      className="text-gray-400 hover:text-red-500 font-sans text-[10px] uppercase tracking-wider underline transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
