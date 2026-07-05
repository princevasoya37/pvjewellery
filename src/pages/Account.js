import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

export default function Account() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="border-b border-gold/20 pb-6 mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">Confidential Portal</span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-luxury-black dark:text-white font-serif">Maison Account</h1>
        </div>
        <div className="text-xs font-light text-gray-500 dark:text-gray-400">
          Logged in as <span className="font-medium text-gold">{user?.email}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#15120F] border border-gold/20 p-8 shadow-soft-lg mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gold/10 border border-gold flex items-center justify-center text-gold font-serif text-2xl font-light">
            {user?.firstName?.[0] || 'M'}{user?.lastName?.[0] || 'P'}
          </div>
          <div>
            <h2 className="font-display text-2xl font-light dark:text-white">{user?.firstName || 'Maison'} {user?.lastName || 'Client'}</h2>
            <span className="text-xs uppercase tracking-widest text-gold font-medium block mt-1">
              {user?.role === 'admin' ? 'Maison Administrator' : 'VIP Inner Circle Client'}
            </span>
          </div>
        </div>

        {user?.role === 'admin' && (
          <Link to="/admin" className="btn-primary shadow-luxury text-xs py-3">
            Launch Admin Operations
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Link to="/account/orders" className="card p-8 group hover:border-gold transition-all duration-300 dark:bg-[#15120F]">
          <span className="text-3xl text-gold mb-4 block">✦</span>
          <h3 className="font-display text-2xl font-light text-luxury-black dark:text-white mb-2 group-hover:text-gold transition-colors">Acquisition History</h3>
          <p className="text-xs text-gray-500 font-light leading-snug">Inspect your past high jewellery acquisitions and white-glove shipment tracking.</p>
        </Link>
        <Link to="/account/addresses" className="card p-8 group hover:border-gold transition-all duration-300 dark:bg-[#15120F]">
          <span className="text-3xl text-gold mb-4 block">⬭</span>
          <h3 className="font-display text-2xl font-light text-luxury-black dark:text-white mb-2 group-hover:text-gold transition-colors">Secured Vault Addresses</h3>
          <p className="text-xs text-gray-500 font-light leading-snug">Manage your private delivery destinations and concierge delivery instructions.</p>
        </Link>
        <Link to="/products" className="card p-8 group hover:border-gold transition-all duration-300 dark:bg-[#15120F]">
          <span className="text-3xl text-gold mb-4 block">◆</span>
          <h3 className="font-display text-2xl font-light text-luxury-black dark:text-white mb-2 group-hover:text-gold transition-colors">Discover Vaults</h3>
          <p className="text-xs text-gray-500 font-light leading-snug">Explore new confidential additions to our high jewellery solitaire collections.</p>
        </Link>
      </div>

      <div className="border-t border-gold/20 pt-8 flex justify-center">
        <button
          type="button"
          onClick={handleLogout}
          className="btn-secondary text-xs px-12 py-3 text-red-500 border-red-500/40 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-md"
        >
          Securely Sign Out of Private Portal
        </button>
      </div>
    </div>
  );
}
