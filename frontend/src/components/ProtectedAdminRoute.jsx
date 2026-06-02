import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedAdminRoute;