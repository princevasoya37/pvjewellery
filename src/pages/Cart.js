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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h1>
        <Link to="/products" className="btn-primary">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-gray-800 mb-6">Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextElementSibling?.classList.remove('hidden'); }} />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center text-gray-400 text-xs ${item.image ? 'hidden' : ''}`}>No image</div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                <p className="text-primary-600">${(item.price * item.quantity).toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(updateQuantity({
                        productId: item.productId,
                        quantity: Math.max(0, parseInt(e.target.value, 10) || 0),
                      }))
                    }
                    className="input-field w-16"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(removeItem(item.productId))}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-medium text-gray-800 mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary block w-full text-center mt-6">
              Proceed to checkout
            </Link>
            <Link to="/products" className="block text-center text-primary-600 text-sm mt-3 hover:underline">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
