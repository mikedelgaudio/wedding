import { useAuth } from '../hooks/useAuth';

export function Logout() {
  const auth = useAuth();

  if (!auth) {
    return null; // or handle the case where auth is not available
  }

  return (
    <button
      className="w-full focus:outline-none focus:ring cursor-pointer bg-stone-900 text-white mt-6 py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => auth.signOutUser()}
    >
      LOGOUT
    </button>
  );
}
