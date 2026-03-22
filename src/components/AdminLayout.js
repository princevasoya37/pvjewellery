import { Link, Outlet, useLocation } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-slate-950/3 flex">
      <aside className="w-60 bg-slate-950 text-slate-100 flex-shrink-0 flex flex-col border-r border-slate-800/80">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin" className="font-display text-xl font-semibold tracking-tight flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300 text-sm">
              PV
            </span>
            <span>Admin</span>
          </Link>
        </div>
        <nav className="px-3 py-4 flex-1 space-y-1">
          {nav.map(({ to, label, end }) => {
            const active = end ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-slate-800 text-slate-50 shadow-[0_0_0_1px_rgba(148,163,184,0.6)]'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <span>{label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-slate-800/80 mt-auto">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/70"
          >
            <span>←</span>
            <span>Back to site</span>
          </Link>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-slate-50/80">
          <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">PV Jewellery Admin</p>
                <p className="text-sm text-slate-600">Operational overview & management</p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
