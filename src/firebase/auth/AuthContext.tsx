import { createContext } from 'react';
import type { IAuthContextType } from './IAuthContextType';

export const AuthContext = createContext<IAuthContextType>({
  user: null,
  checking: true,
  signOutUser: async () => {},
});
