import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Logout() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      if (auth) {
        await auth.signOutUser();
        navigate('/login', { replace: true, state: null });
      }
    };

    handleLogout();
  }, [auth, navigate]);

  return (
    <div className="h-lvh flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Logging out...</p>
      </div>
    </div>
  );
}
