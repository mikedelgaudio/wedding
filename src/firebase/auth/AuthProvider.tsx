import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase.service';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser);
      setChecking(false);
    });
  }, []);

  const signOutUser = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, checking, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
