import { Navigate, useLocation } from 'react-router-dom';
import { hasAuthSession } from '../utils/authSession';

function AuthRoute({ children }) {
  const location = useLocation();

  if (!hasAuthSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default AuthRoute;
