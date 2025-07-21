import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return null;

  if (!user) {
    // Save the current location in router state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
