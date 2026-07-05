import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import PrivateRoute from '../components/PrivateRoute';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import * as ordersApi from '../api/orders';

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
      const orderItems = items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
      }));

      const { clientSecret, orderNumber } = await ordersApi.createOrder({
        items: orderItems,
        shippingAddress: address,
      });

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
              country: 'US',
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          dispatch(clearCart());
          navigate('/order-success', { state: { orderNumber } });
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Payment authentication failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6 font-sans">
        <svg className="w-16 h-16 stroke-1 text-gold/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
        <p className="text-gray-600 text-sm tracking-widest uppercase font-light">Your shopping bag is empty.</p>
        <button type="button" onClick={() => navigate('/products')} className="btn-primary">
          Discover Maison Vaults
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/30 text-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span>SSL 256-Bit Secured Checkout</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-light dark:text-white leading-tight">Secure Acquisition</h1>
        <p className="text-xs text-gray-500 mt-2 font-light tracking-wide">
          Insured Worldwide Delivery • GIA Certified • Flawless Handcrafted Provenance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          {/* Shipping Address Panel */}
          <div className="bg-white dark:bg-[#15120F] p-8 border border-gold/20 shadow-soft-lg space-y-6">
            <h2 className="font-serif text-lg font-medium dark:text-gold uppercase tracking-wider pb-4 border-b border-gold/20 flex items-center gap-2">
              <span>01. Secured Shipping Destination</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Address line 1</label>
                <input type="text" className="input-field py-3 text-xs" value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Address line 2</label>
                <input type="text" className="input-field py-3 text-xs" value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">City</label>
                  <input type="text" className="input-field py-3 text-xs" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">State / Province</label>
                  <input type="text" className="input-field py-3 text-xs" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Postal Code</label>
                  <input type="text" className="input-field py-3 text-xs" value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Country</label>
                  <input type="text" className="input-field py-3 text-xs" value={address.country} onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Secure Contact Number</label>
                <input type="tel" className="input-field py-3 text-xs" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} required />
              </div>
            </div>
          </div>

          {/* Secure Payment Panel */}
          <div className="bg-white dark:bg-[#15120F] p-8 border border-gold/20 shadow-soft-lg space-y-6">
            <h2 className="font-serif text-lg font-medium dark:text-gold uppercase tracking-wider pb-4 border-b border-gold/20 flex items-center justify-between">
              <span>02. Encrypted Payment Portal</span>
              <span className="text-[10px] text-gray-400 font-sans tracking-tight">Stripe Gateway</span>
            </h2>
            <div className="p-4 bg-[#F5F2EB] dark:bg-black border border-gold/30 shadow-inner">
              <CardElement options={{
                style: {
                  base: {
                    fontSize: '15px',
                    color: '#424770',
                    fontFamily: 'Montserrat, sans-serif',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }} />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 p-3 bg-red-50 border border-red-200">{error}</p>}
          </div>

          <button type="submit" className="btn-primary w-full py-5 text-sm shadow-luxury" disabled={processing || !stripe}>
            {processing ? 'Authenticating Secure Transaction...' : 'Complete Acquisition & Place Order'}
          </button>
        </form>

        {/* Order Summary Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#15120F] p-8 border border-gold/20 shadow-soft-lg space-y-6">
            <h3 className="font-serif text-lg font-medium dark:text-gold uppercase tracking-wider pb-4 border-b border-gold/20">
              Acquisition Summary ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-xs pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="font-medium block dark:text-white line-clamp-1">{item.name}</span>
                    <span className="text-gray-500 text-[10px]">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-semibold font-sans text-gold">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gold/20 pt-6 space-y-3 font-sans text-xs">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Insured White-Glove Shipping</span>
                <span className="text-gold uppercase font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Private Concierge Packaging</span>
                <span className="text-gold uppercase font-semibold">Included</span>
              </div>
              <div className="flex justify-between text-base font-bold text-luxury-black dark:text-white pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="uppercase tracking-widest text-xs">Total Investment</span>
                <span className="text-gold text-lg">₹{Number(total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-4 bg-gold/5 border border-gold/20 text-[11px] text-gray-500 dark:text-gray-400 space-y-2">
              <div className="flex items-center gap-2 text-gold font-semibold uppercase tracking-wider text-[10px]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>Maison Guarantee</span>
              </div>
              <p className="leading-snug">
                Every creation arrives in our signature lacquered box accompanied by its original GIA certification and lifetime appraisal warranty.
              </p>
            </div>
          </div>
        </div>
      </div>
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
