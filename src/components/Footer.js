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
    <footer className="bg-luxury-black text-gray-300 font-sans mt-auto border-t border-gold/20">
      
      {/* The Inner Circle Newsletter */}
      <div className="border-b border-gold/10 relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-luxury-black via-[#0D0D0D] to-luxury-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-medium block mb-2">Exclusive Maison Access</span>
          <h3 className="font-display text-3xl md:text-4xl font-light text-white mb-4 tracking-wide font-serif">Join The Inner Circle</h3>
          <p className="text-sm text-gray-400 font-light mb-8 max-w-lg mx-auto leading-relaxed">
            Receive confidential previews of high jewellery acquisitions, private salon invitations, and bespoke diamond insights.
          </p>
          
          {submitted ? (
            <div className="py-4 border border-gold/40 max-w-md mx-auto bg-gold/5 animate-fadeIn">
              <p className="text-gold font-sans text-xs uppercase tracking-[0.2em] font-medium">Thank you. You have entered the Circle.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row max-w-md mx-auto shadow-2xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your private email"
                className="flex-1 px-6 py-4 bg-[#141414] border border-gold/30 text-white placeholder-gray-500 text-xs font-sans focus:outline-none focus:border-gold rounded-none"
                required
              />
              <button 
                type="submit" 
                className="px-8 py-4 bg-gold text-luxury-black font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white hover:text-luxury-black transition-colors rounded-none"
              >
                Join
              </button>
            </form>
          )}
          <span className="block text-[10px] text-gray-500 mt-4 tracking-wider">Unsubscribe anytime. Your confidentiality is our utmost priority.</span>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Col 1: Maison Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block focus:outline-none group">
              <div className="h-16 mb-3 flex items-center transition-transform duration-500 group-hover:scale-105">
                <img 
                  src="/logo.png" 
                  alt="PV Jewellery Logo" 
                  className="h-full w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]"
                />
              </div>
              <span className="font-display text-xl tracking-[0.25em] text-white font-semibold block">PV JEWELLERY</span>
              <span className="block font-sans text-[9px] uppercase tracking-[0.4em] text-gold mt-1">Haute Joaillerie</span>
            </Link>
            <p className="text-xs text-gray-400 font-light leading-relaxed pr-4">
              Crafting timeless expressions of modern romance with ethically sourced, flawless conflict-free diamonds and peerless artisanal gold.
            </p>
            <div className="flex items-center gap-5 pt-2">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-luxury-black transition-all" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-luxury-black transition-all" aria-label="Pinterest">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.406.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.771-2.249 3.771-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.378-.295 1.202-.335 1.365-.053.217-.176.265-.4.161-1.495-.696-2.431-2.88-2.431-4.639 0-3.776 2.744-7.246 7.923-7.246 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-luxury-black transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: High Jewellery Links */}
          <div className="space-y-4 font-sans">
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Collections</h4>
            <ul className="space-y-3 text-xs text-gray-400 font-light">
              <li><Link to="/products?type=high-jewellery" className="hover:text-gold transition">High Jewellery</Link></li>
              <li><Link to="/products?type=engagement" className="hover:text-gold transition">Bridal & Solitaires</Link></li>
              <li><Link to="/products?type=diamonds" className="hover:text-gold transition">Flawless Diamonds</Link></li>
              <li><Link to="/products?type=gemstones" className="hover:text-gold transition">Royal Gemstones</Link></li>
              <li><Link to="/products" className="hover:text-gold transition font-medium text-white">View All Creations</Link></li>
            </ul>
          </div>

          {/* Col 3: Client Experience */}
          <div className="space-y-4 font-sans">
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Maison Experience</h4>
            <ul className="space-y-3 text-xs text-gray-400 font-light">
              <li><Link to="/account" className="hover:text-gold transition">Private Salon Booking</Link></li>
              <li><Link to="/account" className="hover:text-gold transition">My Confidential Account</Link></li>
              <li><Link to="/account/orders" className="hover:text-gold transition">Order & Care History</Link></li>
              <li><Link to="/cart" className="hover:text-gold transition">My Bag</Link></li>
              <li><span className="text-gray-500">Lifetime Warranty & Care</span></li>
            </ul>
          </div>

          {/* Col 4: Private Concierge */}
          <div className="space-y-4 font-sans">
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Concierge Service</h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Our gemologists and master jewellers remain at your personal disposal for custom commissions and bridal consultations.
            </p>
            <div className="pt-2">
              <span className="block text-sm text-gold font-serif font-light">concierge@pvjewellery.com</span>
              <span className="block text-[11px] text-gray-500 mt-1 font-sans">Mon–Sat, 10:00 AM – 7:00 PM IST</span>
            </div>
          </div>

        </div>

        {/* Certifications & Secure Badges */}
        <div className="mt-20 pt-10 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
          <div className="flex flex-wrap items-center justify-center gap-8 text-[11px] text-gray-500 font-medium tracking-widest uppercase">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-gold rounded-full" /> GIA Certified</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-gold rounded-full" /> IGI Inspected</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-gold rounded-full" /> Responsible Jewellery Council</span>
          </div>

          <div className="flex items-center gap-6 text-[10px] text-gray-600 uppercase tracking-wider">
            <span>Secure Encryption</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>Amex</span>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="mt-8 pt-8 border-t border-gold/10 text-center text-[10px] uppercase tracking-[0.2em] text-gray-500">
          &copy; {new Date().getFullYear()} PV JEWELLERY MAISON. ALL RIGHTS RESERVED. ETHICAL, FLAWLESS, TIMELESS.
        </div>
      </div>
    </footer>
  );
}
