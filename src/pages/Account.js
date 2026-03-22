import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Account() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-gray-800 mb-6">My account</h1>
      <p className="text-gray-600 mb-4">
        {user?.firstName} {user?.lastName} ({user?.email})
      </p>
      <nav className="space-y-2">
        <Link to="/account/orders" className="block p-4 card hover:shadow-md transition">
          Order history
        </Link>
        <Link to="/account/addresses" className="block p-4 card hover:shadow-md transition">
          Addresses
        </Link>
        <Link to="/account/wishlist" className="block p-4 card hover:shadow-md transition">
          Wishlist
        </Link>
      </nav>
    </div>
  );
}
