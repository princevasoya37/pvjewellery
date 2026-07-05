import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const nav = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products', end: false },
  { to: '/admin/categories', label: 'Categories', end: false },
  { to: '/admin/orders', label: 'Orders', end: false },
  { to: '/admin/coupons', label: 'Coupons', end: false },
  { to: '/admin/users', label: 'Users', end: false },
];

export default function AdminLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950/3 flex font-sans">
      <aside className="w-64 bg-slate-950 text-slate-100 flex-shrink-0 flex flex-col border-r border-slate-800/80">
        <div className="px-6 py-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin" className="font-serif text-xl font-semibold tracking-[0.2em] uppercase flex items-center gap-3 text-gold">
            <span className="inline-flex h-10 w-10 items-center justify-center border border-gold bg-black text-gold font-light text-lg">
              PV
            </span>
            <span>Maison Admin</span>
          </Link>
        </div>
        <nav className="px-4 py-6 flex-1 space-y-2 uppercase tracking-wider text-xs">
          {nav.map(({ to, label, end }) => {
            const active = end ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-4 py-3 rounded-none text-xs font-medium transition-all ${
                  active
                    ? 'bg-gold text-black font-semibold shadow-md border-l-2 border-white'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-gold'
                }`}
              >
                <span>{label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-6 border-t border-slate-800/80 mt-auto space-y-3 font-sans text-xs uppercase tracking-wider">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-900 hover:text-gold transition-colors"
          >
            <span>←</span>
            <span>Return to Boutique</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-left"
          >
            <span>✕</span>
            <span>Secure Sign Out</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-slate-50/80 dark:bg-[#15120F]">
          <div className="border-b border-slate-200 dark:border-gold/20 bg-white/80 dark:bg-[#1A1613] backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold font-sans">PV Jewellery Maison Atelier</p>
                <p className="text-sm text-slate-600 dark:text-gray-300 font-light mt-1 font-sans">Confidential Operations & Vault Inventory Control</p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-8 py-8 font-sans">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
