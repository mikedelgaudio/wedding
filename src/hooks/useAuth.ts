import { useContext } from 'react';
import { AuthContext } from '../firebase/auth/AuthContext';

export const useAuth = () => useContext(AuthContext);
