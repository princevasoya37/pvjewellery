import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((s) => s.auth);
  const from = location.state?.from?.pathname;
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      const data = await dispatch(loginUser(email, password));

      let targetPath = from;

      if (!targetPath || ['/login', '/register', '/forgot-password'].includes(targetPath)) {
        if (data?.user?.role === 'admin') {
          targetPath = '/admin';
        } else {
          targetPath = '/account';
        }
      }

      navigate(targetPath, { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 font-sans">
      <div className="text-center mb-8">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">Private Portal</span>
        <h1 className="font-display text-3xl sm:text-4xl font-light text-luxury-black dark:text-white font-serif">Maison Sign In</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#15120F] border border-gold/20 p-8 shadow-soft-lg">
        {successMessage && (
          <div className="p-4 bg-green-50 dark:bg-green-950/40 border border-green-300 text-green-700 dark:text-green-300 text-xs tracking-wider uppercase font-medium">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 text-red-700 dark:text-red-300 text-xs tracking-wider uppercase font-medium">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Registered Email</label>
          <input
            type="email"
            className="input-field py-3 text-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="client@maison.com"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Confidential Password</label>
          <input
            type="password"
            className="input-field py-3 text-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
          />
        </div>
        <div className="flex items-center justify-between text-xs font-light">
          <Link to="/forgot-password" className="text-gold hover:underline">
            Forgot confidential password?
          </Link>
        </div>
        <button type="submit" className="btn-primary w-full py-4 shadow-luxury" disabled={loading}>
          {loading ? 'Authenticating Credentials...' : 'Sign In to Private Portal'}
        </button>
      </form>
      <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs font-light">
        Don&apos;t have an account? <Link to="/register" className="text-gold font-medium hover:underline">Apply for Client Account</Link>
      </p>
    </div>
  );
}
