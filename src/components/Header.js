import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { selectCartItems } from '../store/cartSlice';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-gradient-to-b from-[#fafaf9] via-white to-white shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group rounded-xl pr-1 -ml-1 pl-1 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
            aria-label="PV Jewellery Studio home"
          >
            <div
              className="brand-seal h-11 w-11 sm:h-12 sm:w-12 transition-transform duration-300 ease-out-soft group-hover:-translate-y-px group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.7)_inset,0_3px_12px_rgba(15,23,42,0.08),0_6px_24px_rgba(200,138,38,0.18)]"
              aria-hidden
            >
              <img src="/logo.png" alt="" className="brand-seal-img" />
            </div>
            <div className="flex min-w-0 flex-col items-start leading-none gap-0.5">
              <span className="font-brand text-lg sm:text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-accent-dark via-slate-900 to-accent-dark transition-all duration-300 group-hover:from-accent group-hover:to-accent-dark">
                PV Jewellery
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-gray-600 hover:text-primary-600 transition">
              Shop
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" className="text-gray-600 hover:text-primary-600 transition">
                  Account
                </Link>
                <Link to="/account/orders" className="text-gray-600 hover:text-primary-600 transition">
                  Orders
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-accent-dark hover:text-accent transition">
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-primary-600 transition">
                  Register
                </Link>
              </>
            )}
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <Link to="/products" className="block py-2" onClick={() => setMenuOpen(false)}>Shop</Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" className="block py-2" onClick={() => setMenuOpen(false)}>Account</Link>
                <Link to="/account/orders" className="block py-2" onClick={() => setMenuOpen(false)}>Orders</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block py-2" onClick={() => setMenuOpen(false)}>Admin</Link>
                )}
                <button type="button" onClick={handleLogout} className="block py-2 w-full text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
            <Link to="/cart" className="block py-2" onClick={() => setMenuOpen(false)}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
