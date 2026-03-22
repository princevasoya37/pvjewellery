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
      const data = await dispatch(loginUser(email, password)).unwrap();

      let targetPath = from;

      // If there is no "from" (direct visit to login) or it points back to auth pages,
      // choose a sensible default based on user role.
      if (!targetPath || ['/login', '/register', '/forgot-password'].includes(targetPath)) {
        if (data?.user?.role === 'admin') {
          targetPath = '/admin';
        } else {
          targetPath = '/account';
        }
      }

      navigate(targetPath, { replace: true });
    } catch (_) {}
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-gray-800 mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600 text-sm">
        Don&apos;t have an account? <Link to="/register" className="text-primary-600 hover:underline">Register</Link>
      </p>
    </div>
  );
}
