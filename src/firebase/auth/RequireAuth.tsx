import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return null;

  if (!user) {
    // Save the current location in router state, but don't save /logout
    // as we don't want to redirect back there after login
    const from = location.pathname === '/logout' ? { pathname: '/' } : location;
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return children;
}
