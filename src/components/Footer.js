import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Newsletter - Join the Inner Circle */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl font-semibold text-white mb-2">Join the Inner Circle</h3>
            <p className="text-sm text-gray-400 mb-6">
              Exclusive access to new launches, early offers, and diamond expertise. No spam.
            </p>
            {submitted ? (
              <p className="text-accent-light font-medium">Thank you. You’re in the circle.</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-dark focus:border-transparent"
                  required
                />
                <button type="submit" className="px-6 py-3 bg-accent-dark text-white font-medium rounded-md hover:bg-accent transition-colors">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">PV Jewellery</h3>
            <p className="text-sm text-gray-400">
              Fine diamonds and jewellery. Quality and trust since day one. Ethically sourced, conflict-free.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Quick links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition">Shop</Link></li>
              <li><Link to="/products?type=diamond" className="hover:text-white transition">Diamonds</Link></li>
              <li><Link to="/products?type=jewellery" className="hover:text-white transition">Jewellery</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
              <li><Link to="/account" className="hover:text-white transition">Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">Contact</h3>
            <p className="text-sm text-gray-400">support@pvjewelleryshop.com</p>
            <p className="text-sm text-gray-400 mt-1">Personal Concierge: Mon–Sat, 10am–6pm</p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 pt-8 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center mb-4">Secure payment & certifications</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <span className="text-gray-500 font-medium text-sm">Visa</span>
            <span className="text-gray-500 font-medium text-sm">Mastercard</span>
            <span className="text-gray-500 font-medium text-sm">Amex</span>
            <span className="text-gray-500 font-medium text-sm">PayPal</span>
            <span className="text-gray-500 font-medium text-sm">GIA</span>
            <span className="text-gray-500 font-medium text-sm">RJC</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PV Jewellery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
