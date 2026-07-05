import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTotal,
  updateQuantity,
  removeItem,
} from '../store/cartSlice';
import { getImageUrl } from '../api/client';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 font-sans">
        <svg className="w-16 h-16 stroke-1 text-gold/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
        <h1 className="font-display text-3xl font-light text-luxury-black dark:text-white font-serif">Your Maison Shopping Bag is Empty</h1>
        <p className="text-gray-500 text-xs font-light tracking-wide">Explore our confidential high jewellery collections and bespoke masterworks.</p>
        <Link to="/products" className="btn-primary shadow-luxury">Discover Vaults</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="border-b border-gold/20 pb-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between">
        <div>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">Acquisition Bag</span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-luxury-black dark:text-white font-serif">Your Curated Masterpieces</h1>
        </div>
        <span className="text-xs text-gray-500 font-light mt-2 sm:mt-0">
          Insured White-Glove Worldwide Delivery Included
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="bg-white dark:bg-[#15120F] border border-gold/20 p-6 shadow-soft-lg flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-32 aspect-square bg-[#F5F5F5] dark:bg-black border border-gold/20 overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400">Maison</div>
                )}
              </div>

              <div className="flex-1 w-full flex flex-col justify-between">
                <div>
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold font-medium block mb-1">Haute Creation</span>
                  <Link to={`/products/${item.productId}`}>
                    <h3 className="font-display text-xl font-light text-luxury-black dark:text-white line-clamp-1">{item.name}</h3>
                  </Link>
                  <p className="text-gold font-semibold font-sans mt-2">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center border border-gold/40 bg-white dark:bg-black h-10 px-2">
                    <button
                      type="button"
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                      className="px-3 text-sm hover:text-gold transition-colors dark:text-white focus:outline-none"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-semibold dark:text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                      className="px-3 text-sm hover:text-gold transition-colors dark:text-white focus:outline-none"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => dispatch(removeItem(item.productId))}
                    className="text-xs uppercase tracking-wider text-gray-400 hover:text-red-500 underline transition-colors font-light"
                  >
                    Remove Masterpiece
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#15120F] border border-gold/20 p-8 shadow-soft-lg sticky top-28 space-y-6">
            <h3 className="font-serif text-lg font-medium dark:text-gold uppercase tracking-wider pb-4 border-b border-gold/20">
              Investment Overview
            </h3>

            <div className="space-y-3 font-sans text-xs font-light">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span className="font-semibold text-luxury-black dark:text-white">₹{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Maison Courtesy</span>
                  <span>-₹{Number(discount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-800">
                <span>White-Glove Shipping</span>
                <span className="text-gold font-semibold uppercase">Complimentary</span>
              </div>
              <div className="flex justify-between text-base font-bold text-luxury-black dark:text-white pt-4 border-t border-gold/20">
                <span className="uppercase tracking-widest text-xs">Total Estimated</span>
                <span className="text-gold text-lg font-semibold">₹{Number(total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary block w-full text-center py-4 shadow-luxury">
              Proceed to Secure Checkout
            </Link>

            <Link to="/products" className="block text-center text-xs uppercase tracking-widest text-gray-500 hover:text-luxury-black dark:hover:text-white transition-colors pt-2 font-light">
              ← Continue Exploring Vaults
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
