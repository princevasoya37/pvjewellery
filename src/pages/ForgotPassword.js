import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call POST /auth/forgot-password
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">If an account exists for {email}, we sent a reset link.</p>
        <Link to="/login" className="text-primary-600 hover:underline">Back to login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-gray-800 mb-6">Forgot password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full">Send reset link</button>
      </form>
      <p className="mt-4 text-center">
        <Link to="/login" className="text-primary-600 hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
