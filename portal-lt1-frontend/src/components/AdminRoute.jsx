import { Navigate, useLocation } from 'react-router-dom';
import { hasAuthSession, isAdmin } from '../utils/authSession';

function AdminRoute({ children }) {
  const location = useLocation();

  if (!hasAuthSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
