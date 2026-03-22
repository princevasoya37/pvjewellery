import { Link } from 'react-router-dom';

export default function OrderFailure() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Payment Failed</h1>
      <p className="text-gray-600 mb-8">
        We're sorry, but your payment could not be processed at this time. Please check your card details and try again.
      </p>
      <div className="space-x-4">
        <Link to="/checkout" className="btn-primary">
          Try Again
        </Link>
        <Link to="/cart" className="btn-secondary">
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
