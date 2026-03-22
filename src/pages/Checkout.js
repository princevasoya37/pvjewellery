import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import PrivateRoute from '../components/PrivateRoute';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import * as ordersApi from '../api/orders';

// In production, this should be in .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Px9lRRu9G8pY8Xf8x8x8x8x8x8x8X');

function CheckoutForm() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [address, setAddress] = useState({
    line1: '', line2: '', city: '', state: '', zip: '', country: '', phone: '',
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // 1. Create order on backend to get clientSecret
      const orderItems = items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
      }));

      const { clientSecret, orderNumber } = await ordersApi.createOrder({
        items: orderItems,
        shippingAddress: address,
      });

      // 2. Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${address.line1} Customer`,
            phone: address.phone,
            address: {
              line1: address.line1,
              city: address.city,
              state: address.state,
              postal_code: address.zip,
              country: 'US', // Stripe expects ISO country code, defaulting to US for demo
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        // navigate('/order-failure'); // Optional: show error on same page instead
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          dispatch(clearCart());
          navigate('/order-success', { state: { orderNumber } });
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <button type="button" onClick={() => navigate('/products')} className="btn-primary">
          Shop now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-gray-800 mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address line 1</label>
              <input type="text" className="input-field" value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address line 2</label>
              <input type="text" className="input-field" value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" className="input-field" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" className="input-field" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                <input type="text" className="input-field" value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" className="input-field" value={address.country} onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" className="input-field" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} required />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-medium mb-4">Payment Method</h2>
          <div className="p-3 border border-gray-300 rounded-md">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }} />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-6">
          <span className="text-gray-700 font-medium">Total Amount</span>
          <span className="text-xl font-bold text-gray-900">${total.toLocaleString()}</span>
        </div>

        <button type="submit" className="btn-primary w-full py-3" disabled={processing || !stripe}>
          {processing ? 'Processing Payment...' : 'Place Order & Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default function Checkout() {
  return (
    <PrivateRoute>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </PrivateRoute>
  );
}

