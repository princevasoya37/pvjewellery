import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/authSlice';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      await dispatch(registerUser(form));
      navigate('/login', { state: { message: 'Maison account application approved. Please log in with your credentials.' } });
    } catch (err) {
      console.error("Registration Error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 font-sans">
      <div className="text-center mb-8">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">Client Application</span>
        <h1 className="font-display text-3xl sm:text-4xl font-light text-luxury-black dark:text-white font-serif">Join Maison PV</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#15120F] border border-gold/20 p-8 shadow-soft-lg">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 text-red-700 dark:text-red-300 text-xs tracking-wider uppercase font-medium">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              className="input-field py-3 text-xs"
              value={form.firstName}
              onChange={handleChange}
              required
              placeholder="Eleanor"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="input-field py-3 text-xs"
              value={form.lastName}
              onChange={handleChange}
              required
              placeholder="Vance"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Confidential Email</label>
          <input
            type="email"
            name="email"
            className="input-field py-3 text-xs"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="client@maison.com"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Password (Min 8 Characters)</label>
          <input
            type="password"
            name="password"
            className="input-field py-3 text-xs"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••••••"
          />
        </div>
        <button type="submit" className="btn-primary w-full py-4 shadow-luxury" disabled={loading}>
          {loading ? 'Submitting Application...' : 'Register Client Account'}
        </button>
      </form>
      <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs font-light">
        Already have a Maison account? <Link to="/login" className="text-gold font-medium hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
