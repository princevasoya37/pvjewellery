import { useLocation, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const location = useLocation();
  const { orderNumber } = location.state || {};

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order {orderNumber && <span className="font-semibold text-gray-900">#{orderNumber}</span>} has been received and is being processed.
      </p>
      <div className="space-x-4">
        <Link to="/account/orders" className="btn-primary">
          View My Orders
        </Link>
        <Link to="/products" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
