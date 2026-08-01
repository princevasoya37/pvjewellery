import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { selectCartItems } from '../store/cartSlice';
import { selectWishlistItems, toggleWishlistDrawer } from '../store/wishlistSlice';
import { selectThemeMode, toggleTheme, toggleCartDrawer } from '../store/themeSlice';
 
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const themeMode = useSelector(selectThemeMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate('/');
  };

  const isDark = themeMode === 'dark';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-sans border-b ${
        isDark
          ? 'bg-[#0D0A07]/95 text-[#F9F6F0] border-white/10 shadow-sm'
          : 'bg-[#FBF9F6]/95 text-[#111111] border-[#111111]/10 shadow-sm'
      } backdrop-blur-md`}
    >
      <div className="max-w-[1700px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}>
          
          {/* Left Navigation Items */}
          <nav className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.25em] font-normal">
            <Link to="/products" className="hover:opacity-80 transition-opacity py-1 relative group">
              <span>Shop</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#111111] dark:bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            <Link to="/products?type=high-jewellery" className="hover:opacity-80 transition-opacity py-1 relative group">
              <span>Collections</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#111111] dark:bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            <Link to="/products?type=custom" className="hover:opacity-80 transition-opacity py-1 relative group">
              <span>Atelier</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#111111] dark:bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          </nav>

          {/* Center Brand Logo */}
          <div className="flex-1 lg:flex-none flex justify-center items-center">
            <Link to="/" className="flex flex-col items-center justify-center focus:outline-none">
              <span className="font-brand text-lg sm:text-2xl font-semibold tracking-[0.3em] text-[#111111] dark:text-[#F9F6F0] leading-none transition-opacity hover:opacity-80">
                PV JEWELLERY
              </span>
            </Link>
          </div>

          {/* Right Navigation & Action Icons */}
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 text-[11px] uppercase tracking-[0.25em] font-normal">
            <nav className="hidden xl:flex items-center gap-10">
              <Link to="/products?type=journal" className="hover:opacity-80 transition-opacity py-1 relative group">
                <span>Journal</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#111111] dark:bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
              <Link to="/account" className="hover:opacity-80 transition-opacity py-1 relative group">
                <span>Contact</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#111111] dark:bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </nav>

            <span className="text-current opacity-15 font-light hidden xl:inline">|</span>

            {/* Icons Group */}
            <div className="flex items-center gap-5 sm:gap-6">
              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={() => dispatch(toggleTheme())}
                className="hover:opacity-70 transition-opacity duration-300 focus:outline-none"
                aria-label="Toggle Luxury Theme"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <svg className="w-5 h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>

              {/* Search Icon */}
              <Link to="/products" className="hover:opacity-70 transition-opacity duration-300 focus:outline-none" aria-label="Search">
                <svg className="w-5 h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </Link>

              {/* Wishlist Icon */}
              <button
                type="button"
                onClick={() => dispatch(toggleWishlistDrawer())}
                className="relative hover:opacity-70 transition-opacity duration-300 focus:outline-none flex items-center"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] bg-[#111111] dark:bg-gold text-[#FBF9F6] dark:text-[#0D0A07] rounded-full w-4 h-4 flex items-center justify-center font-sans font-medium">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Icon */}
              <Link to={isAuthenticated ? "/account" : "/login"} className="hover:opacity-70 transition-opacity duration-300 focus:outline-none relative group" aria-label="Account">
                <svg className="w-5 h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {user?.role === 'admin' && (
                  <span className="absolute -bottom-1 -right-0.5 w-1.5 h-1.5 rounded-full bg-gold" title="Admin Account" />
                )}
              </Link>

              {/* Shopping Bag Icon with Counter */}
              <button
                type="button"
                onClick={() => dispatch(toggleCartDrawer())}
                className="relative hover:opacity-70 transition-opacity duration-300 focus:outline-none flex items-center"
                aria-label="Shopping Bag"
              >
                <svg className="w-5 h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] bg-[#111111] dark:bg-gold text-[#FBF9F6] dark:text-[#0D0A07] rounded-full w-4 h-4 flex items-center justify-center font-sans font-medium">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="lg:hidden hover:opacity-70 transition-opacity focus:outline-none ml-1"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
              >
                <svg className="w-6 h-6 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className={`lg:hidden absolute top-full left-0 w-full border-b shadow-2xl py-8 px-8 space-y-6 text-center font-sans uppercase tracking-[0.25em] text-xs z-50 animate-fadeIn ${
          isDark 
            ? 'bg-[#15120F] text-[#F9F6F0] border-white/10' 
            : 'bg-[#FBF9F6] text-[#111111] border-[#111111]/10'
        }`}>
          <Link to="/products" className="block py-2 hover:opacity-70" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/products?type=high-jewellery" className="block py-2 hover:opacity-70" onClick={() => setMenuOpen(false)}>Collections</Link>
          <Link to="/products?type=custom" className="block py-2 hover:opacity-70" onClick={() => setMenuOpen(false)}>Atelier</Link>
          <Link to="/products?type=journal" className="block py-2 hover:opacity-70" onClick={() => setMenuOpen(false)}>Journal</Link>
          <Link to="/account" className="block py-2 hover:opacity-70" onClick={() => setMenuOpen(false)}>Contact</Link>
          
          <div className="w-12 h-[1px] bg-current opacity-20 mx-auto my-4" />

          {isAuthenticated ? (
            <div className="space-y-4">
              <Link to="/account" className="block py-2 hover:opacity-70" onClick={() => setMenuOpen(false)}>My Account</Link>
              <Link to="/account/orders" className="block py-2 hover:opacity-70" onClick={() => setMenuOpen(false)}>Order History</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="block py-2 text-gold font-semibold" onClick={() => setMenuOpen(false)}>Maison Admin</Link>
              )}
              <button type="button" onClick={handleLogout} className="block py-2 w-full text-red-500 font-medium tracking-[0.25em] uppercase text-xs">Sign Out</button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link to="/login" className="px-6 py-3 border border-current hover:opacity-75 font-semibold text-xs tracking-[0.2em] uppercase" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className={`px-6 py-3 font-semibold text-xs tracking-[0.2em] uppercase ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`} onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
