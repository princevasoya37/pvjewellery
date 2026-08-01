import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth);

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return children;
}
