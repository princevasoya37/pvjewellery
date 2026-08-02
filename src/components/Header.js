import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { selectCartItems } from '../store/cartSlice';
import { selectWishlistItems, toggleWishlistDrawer } from '../store/wishlistSlice';
import { selectThemeMode, toggleTheme, toggleCartDrawer } from '../store/themeSlice';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  
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

  // Lock body scroll when mobile off-canvas drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const handleSwitchAccount = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
    setMenuOpen(false);
    navigate('/login', { state: { message: 'Signed out. Please log in with another account.' } });
  };

  const isDark = themeMode === 'dark';
  const userInitials = user?.firstName?.[0] && user?.lastName?.[0] 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : (user?.email?.[0]?.toUpperCase() || 'M');

  return (
    <>
      <header 
        className={`sticky top-0 left-0 right-0 w-full z-50 transition-all duration-300 font-sans border-b ${
          isDark
            ? 'bg-[#0D0A07]/95 text-[#F9F6F0] border-white/10 shadow-md'
            : 'bg-[#FBF9F6]/95 text-[#111111] border-[#111111]/10 shadow-md'
        } backdrop-blur-md`}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className={`grid grid-cols-3 items-center transition-all duration-300 ${
            scrolled ? 'py-3' : 'py-4 sm:py-5'
          }`}>
            
            {/* Left Column: Mobile Off-Canvas Menu Button (< lg) or Desktop Nav Links (>= lg) */}
            <div className="flex items-center justify-start">
              {/* Mobile Off-Canvas Drawer Toggle Button */}
              <button
                type="button"
                className="lg:hidden hover:opacity-70 transition-opacity focus:outline-none py-1 pr-2 flex items-center gap-2 group"
                onClick={() => setMenuOpen(true)}
                aria-label="Open Navigation Sidebar"
              >
                <svg className="w-6 h-6 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium hidden sm:inline text-gold">Menu</span>
              </button>

              {/* Desktop Left Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] uppercase tracking-[0.2em] font-medium whitespace-nowrap">
                <Link to="/products" className="hover:text-gold transition-colors py-1 relative group">
                  <span>Shop</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <Link to="/products?type=high-jewellery" className="hover:text-gold transition-colors py-1 relative group">
                  <span>Collections</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <Link to="/products?type=custom" className="hover:text-gold transition-colors py-1 relative group">
                  <span>Atelier</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                <Link to="/products?type=journal" className="hover:text-gold transition-colors py-1 relative group">
                  <span>Journal</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </nav>
            </div>

            {/* Center Column: Brand Title (Always Centered & Separated) */}
            <div className="flex justify-center items-center px-2 min-w-0">
              <Link to="/" className="flex flex-col items-center justify-center focus:outline-none group">
                <span className="font-brand text-base sm:text-xl lg:text-2xl font-bold tracking-[0.25em] sm:tracking-[0.3em] text-[#111111] dark:text-[#F9F6F0] leading-none transition-opacity group-hover:opacity-80 truncate">
                  PV JEWELLERY
                </span>
              </Link>
            </div>

            {/* Right Column: Clean Actions & User Portal */}
            <div className="flex items-center justify-end gap-3 sm:gap-5 text-[11px] uppercase tracking-[0.2em] font-medium">
              
              {/* Clean Single Sign-In Link (Desktop) */}
              {!isAuthenticated ? (
                <Link 
                  to="/login" 
                  className="hidden xl:inline-block hover:text-gold transition-colors py-1 relative group font-semibold text-gold"
                >
                  <span>Sign In</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ) : (
                <Link 
                  to="/account" 
                  className="hidden xl:inline-block hover:text-gold transition-colors py-1 relative group"
                >
                  <span>My Account</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              )}

              <span className="text-current opacity-20 font-light hidden xl:inline">|</span>

              {/* Action Icons Group */}
              <div className="flex items-center gap-3.5 sm:gap-5">
                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={() => dispatch(toggleTheme())}
                  className="hover:opacity-70 transition-opacity duration-300 focus:outline-none"
                  aria-label="Toggle Luxury Theme"
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? (
                    <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  )}
                </button>

                {/* Search Icon */}
                <Link to="/products" className="hover:opacity-70 transition-opacity duration-300 focus:outline-none" aria-label="Search">
                  <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 text-[9px] bg-[#111111] dark:bg-gold text-[#FBF9F6] dark:text-[#0D0A07] rounded-full w-4 h-4 flex items-center justify-center font-sans font-medium">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* User Account Icon & Interactive Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="hover:opacity-80 transition-opacity duration-300 focus:outline-none flex items-center gap-1.5 py-1"
                    aria-label="Account Menu"
                    title={isAuthenticated ? `Account (${user?.email})` : 'User Portal'}
                  >
                    {isAuthenticated ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gold/20 border border-gold text-gold flex items-center justify-center text-[10px] sm:text-[11px] font-semibold tracking-normal font-serif shadow-sm">
                        {userInitials}
                      </div>
                    ) : (
                      <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                    {user?.role === 'admin' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" title="Admin Active" />
                    )}
                  </button>

                  {/* Desktop User Dropdown */}
                  {userDropdownOpen && (
                    <div className={`absolute right-0 mt-3 w-72 border shadow-2xl p-5 z-50 animate-fadeIn font-sans text-left uppercase tracking-wider text-xs ${
                      isDark 
                        ? 'bg-[#15120F] text-[#F9F6F0] border-gold/30' 
                        : 'bg-[#FBF9F6] text-[#111111] border-gold/40'
                    }`}>
                      {isAuthenticated ? (
                        <div className="space-y-4 normal-case tracking-normal">
                          <div className="flex items-center gap-3 pb-3 border-b border-gold/20">
                            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold text-gold flex items-center justify-center text-sm font-semibold font-serif shrink-0">
                              {userInitials}
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="font-display text-sm font-medium truncate dark:text-white">
                                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Maison Client'}
                              </h4>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                                Logged in as <span className="text-gold font-medium">{user?.email}</span>
                              </p>
                              <span className="text-[9px] uppercase tracking-widest text-gold font-semibold block mt-0.5">
                                {user?.role === 'admin' ? 'Maison Administrator' : 'VIP Inner Circle Client'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-1 text-xs uppercase tracking-[0.2em]">
                            <Link 
                              to="/account" 
                              className="block py-2 px-3 hover:bg-gold/10 hover:text-gold transition-colors font-medium flex items-center justify-between"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <span>Maison Account</span>
                              <span className="text-gold">→</span>
                            </Link>
                            <Link 
                              to="/account/orders" 
                              className="block py-2 px-3 hover:bg-gold/10 hover:text-gold transition-colors font-medium flex items-center justify-between"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <span>Acquisition History</span>
                              <span className="text-gold">→</span>
                            </Link>
                            {user?.role === 'admin' && (
                              <Link 
                                to="/admin" 
                                className="block py-2 px-3 bg-gold/10 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all font-semibold flex items-center justify-between"
                                onClick={() => setUserDropdownOpen(false)}
                              >
                                <span>Maison Admin Portal</span>
                                <span>✦</span>
                              </Link>
                            )}
                          </div>

                          <div className="pt-3 border-t border-gold/20 space-y-2 uppercase tracking-[0.2em] text-[11px]">
                            <button
                              type="button"
                              onClick={handleSwitchAccount}
                              className="w-full text-left py-2 px-3 text-gold hover:bg-gold/10 transition-colors font-medium flex items-center justify-between"
                            >
                              <span>Switch Account</span>
                              <span>⇄</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="w-full text-left py-2 px-3 text-red-500 hover:bg-red-500/10 transition-colors font-medium flex items-center justify-between"
                            >
                              <span>Sign Out</span>
                              <span>✕</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 normal-case tracking-normal">
                          <div className="pb-3 border-b border-gold/20 text-center">
                            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold block">Confidential Portal</span>
                            <h4 className="font-serif text-base font-light dark:text-white mt-1">Welcome to PV Jewellery</h4>
                          </div>
                          <div className="space-y-3">
                            <Link
                              to="/login"
                              className="block w-full text-center py-3 bg-gold text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-gold-light transition-all shadow-md"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              Sign In to Account
                            </Link>
                            <Link
                              to="/register"
                              className="block w-full text-center py-3 border border-gold text-gold font-semibold text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-black transition-all"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              Register New Account
                            </Link>
                          </div>
                          <div className="pt-2 text-center">
                            <Link
                              to="/forgot-password"
                              className="text-[11px] text-gray-500 hover:text-gold transition-colors font-light"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              Forgot confidential password?
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Shopping Bag Icon with Counter */}
                <button
                  type="button"
                  onClick={() => dispatch(toggleCartDrawer())}
                  className="relative hover:opacity-70 transition-opacity duration-300 focus:outline-none flex items-center"
                  aria-label="Shopping Bag"
                >
                  <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 text-[9px] bg-[#111111] dark:bg-gold text-[#FBF9F6] dark:text-[#0D0A07] rounded-full w-4 h-4 flex items-center justify-center font-sans font-medium">
                      {cartCount}
                    </span>
                  )}
                </button>

              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Backdrop Overlay for Left Off-Canvas Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Left Off-Canvas Responsive Navigation Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-full w-[85vw] max-w-sm z-[60] flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDark 
            ? 'bg-[#120F0C] text-[#F9F6F0] border-r border-gold/20' 
            : 'bg-[#FBF9F6] text-[#111111] border-r border-gold/30'
        }`}
        aria-label="Responsive Navigation Sidebar"
      >
        {/* Sidebar Header with Brand & Close (X) Button */}
        <div className="p-6 border-b border-gold/20 flex items-center justify-between">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <span className="font-brand text-lg font-bold tracking-[0.25em] text-[#111111] dark:text-[#F9F6F0]">
              PV JEWELLERY
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all focus:outline-none"
            aria-label="Close Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8 font-sans">
          
          {/* Main Collection Navigation Links */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold block">Navigation</span>
            <nav className="space-y-3 uppercase tracking-[0.2em] text-xs font-medium">
              <Link 
                to="/products" 
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gold/10 hover:text-gold transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span>Shop</span>
                <span className="text-gold">→</span>
              </Link>
              <Link 
                to="/products?type=high-jewellery" 
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gold/10 hover:text-gold transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span>Collections</span>
                <span className="text-gold">→</span>
              </Link>
              <Link 
                to="/products?type=custom" 
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gold/10 hover:text-gold transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span>Atelier</span>
                <span className="text-gold">→</span>
              </Link>
              <Link 
                to="/products?type=journal" 
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gold/10 hover:text-gold transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span>Journal</span>
                <span className="text-gold">→</span>
              </Link>
            </nav>
          </div>

          <div className="w-full h-[1px] bg-gold/20" />

          {/* User Account / Portal Section */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold block">Client Portal</span>

            {isAuthenticated ? (
              <div className="space-y-4">
                {/* User Card */}
                <div className="flex items-center gap-3 p-3 bg-gold/10 border border-gold/30 rounded">
                  <div className="w-9 h-9 rounded-full bg-gold text-black font-serif font-bold text-xs flex items-center justify-center shrink-0">
                    {userInitials}
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-xs font-semibold truncate dark:text-white">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Maison Client'}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-2 uppercase tracking-[0.2em] text-xs font-medium">
                  <Link 
                    to="/account" 
                    className="flex items-center justify-between py-2 px-3 hover:bg-gold/10 hover:text-gold transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>Maison Account</span>
                    <span>→</span>
                  </Link>
                  <Link 
                    to="/account/orders" 
                    className="flex items-center justify-between py-2 px-3 hover:bg-gold/10 hover:text-gold transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>Acquisition History</span>
                    <span>→</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center justify-between py-2 px-3 bg-gold/10 text-gold font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>Maison Admin Portal</span>
                      <span>✦</span>
                    </Link>
                  )}
                </div>

                <div className="pt-2 space-y-2 uppercase tracking-[0.2em] text-xs font-medium">
                  <button 
                    type="button" 
                    onClick={handleSwitchAccount} 
                    className="w-full text-left py-2 px-3 text-gold hover:bg-gold/10 transition-colors flex items-center justify-between"
                  >
                    <span>Switch Account</span>
                    <span>⇄</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={handleLogout} 
                    className="w-full text-left py-2 px-3 text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-between"
                  >
                    <span>Sign Out</span>
                    <span>✕</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 bg-gold text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-gold-light transition-all shadow-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In to Account
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-3 border border-gold text-gold font-semibold text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-black transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Register New Account
                </Link>
                <div className="pt-2 text-center">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-gray-500 hover:text-gold transition-colors font-light"
                    onClick={() => setMenuOpen(false)}
                  >
                    Forgot confidential password?
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gold/20 text-center">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-medium block">
            Maison PV High Jewellery & Solitaires
          </span>
        </div>
      </aside>
    </>
  );
}
