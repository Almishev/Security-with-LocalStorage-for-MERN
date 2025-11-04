import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth.js';

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/employee" replace />;
  }

  return children;
};

export default AdminRoute;